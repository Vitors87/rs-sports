import 'package:flutter/material.dart';
import '../models/route.dart';
import '../services/route_service.dart';
import '../theme/app_theme.dart';
import '../widgets/empty_state.dart';
import 'route_detail_screen.dart';

class RoutesScreen extends StatefulWidget {
  const RoutesScreen({super.key});

  @override
  State<RoutesScreen> createState() => _RoutesScreenState();
}

class _RoutesScreenState extends State<RoutesScreen> {
  final _service = RouteService();
  List<AppRoute> _routes = [];
  bool _loading = true;
  String? _error;
  String? _sportFilter;
  String? _difficultyFilter;

  static const _sports = [
    (null, 'Todos'),
    ('RUNNING', 'Running'),
    ('CYCLING', 'Ciclismo'),
    ('TREKKING', 'Trekking'),
  ];

  static const _difficulties = [
    (null, 'Todas'),
    ('easy', 'Fácil'),
    ('moderate', 'Media'),
    ('hard', 'Difícil'),
  ];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final routes = await _service.fetchRoutes(
        sport: _sportFilter,
        difficulty: _difficultyFilter,
      );
      if (mounted) setState(() => _routes = routes);
    } catch (e) {
      if (mounted) setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Rutas'),
        actions: [IconButton(icon: const Icon(Icons.refresh), onPressed: _load)],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(96),
          child: Column(
            children: [
              _FilterRow(
                label: 'Disciplina:',
                options: _sports.map((s) => (s.$1, s.$2)).toList(),
                selected: _sportFilter,
                onSelected: (v) {
                  setState(() => _sportFilter = v);
                  _load();
                },
              ),
              _FilterRow(
                label: 'Dificultad:',
                options: _difficulties.map((d) => (d.$1, d.$2)).toList(),
                selected: _difficultyFilter,
                onSelected: (v) {
                  setState(() => _difficultyFilter = v);
                  _load();
                },
              ),
            ],
          ),
        ),
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_loading) return const Center(child: CircularProgressIndicator());
    if (_error != null) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.error_outline, size: 48, color: AppTheme.textSecondary),
            const SizedBox(height: 12),
            Text(_error!, style: const TextStyle(color: AppTheme.textSecondary)),
            const SizedBox(height: 16),
            ElevatedButton(onPressed: _load, child: const Text('Reintentar')),
          ],
        ),
      );
    }
    if (_routes.isEmpty) {
      return const EmptyState(
        emoji: '🗺️',
        title: 'Sin rutas disponibles',
        subtitle: 'No hay rutas que coincidan con los filtros',
      );
    }
    return RefreshIndicator(
      onRefresh: _load,
      child: ListView.builder(
        padding: const EdgeInsets.symmetric(vertical: 8),
        itemCount: _routes.length,
        itemBuilder: (_, i) => _RouteCard(
          route: _routes[i],
          onTap: () => Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => RouteDetailScreen(route: _routes[i])),
          ),
        ),
      ),
    );
  }
}

class _FilterRow extends StatelessWidget {
  final String label;
  final List<(String?, String)> options;
  final String? selected;
  final ValueChanged<String?> onSelected;

  const _FilterRow({
    required this.label,
    required this.options,
    required this.selected,
    required this.onSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(left: 16, right: 16, bottom: 6),
      child: Row(
        children: [
          Text(label,
              style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary,
                  fontWeight: FontWeight.w500)),
          const SizedBox(width: 8),
          Expanded(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: options.map((opt) {
                  final isSelected = opt.$1 == selected;
                  return Padding(
                    padding: const EdgeInsets.only(right: 6),
                    child: ChoiceChip(
                      label: Text(opt.$2),
                      selected: isSelected,
                      onSelected: (_) => onSelected(opt.$1),
                      selectedColor: AppTheme.primary,
                      labelStyle: TextStyle(
                        fontSize: 12,
                        color: isSelected ? Colors.white : AppTheme.textSecondary,
                        fontWeight: FontWeight.w500,
                      ),
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    ),
                  );
                }).toList(),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _RouteCard extends StatelessWidget {
  final AppRoute route;
  final VoidCallback onTap;

  const _RouteCard({required this.route, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final color = AppTheme.sportColor(route.sport.type);
    final diffColor = AppTheme.difficultyColor(route.difficulty);
    final diffLabel = AppTheme.difficultyLabel(route.difficulty);

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image area
            if (route.imageUrl != null && route.imageUrl!.isNotEmpty)
              ClipRRect(
                borderRadius:
                    const BorderRadius.vertical(top: Radius.circular(16)),
                child: Image.network(
                  route.imageUrl!,
                  height: 140,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => _ImagePlaceholder(color: color),
                ),
              )
            else
              ClipRRect(
                borderRadius:
                    const BorderRadius.vertical(top: Radius.circular(16)),
                child: _ImagePlaceholder(color: color),
              ),
            Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          route.title,
                          style: const TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w700,
                            color: AppTheme.textPrimary,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: diffColor.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          diffLabel,
                          style: TextStyle(
                              fontSize: 11, fontWeight: FontWeight.w600, color: diffColor),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  if (route.region != null || route.city != null) ...[
                    Row(
                      children: [
                        const Icon(Icons.place_outlined, size: 13,
                            color: AppTheme.textSecondary),
                        const SizedBox(width: 3),
                        Text(
                          [route.city, route.region]
                              .where((s) => s != null && s.isNotEmpty)
                              .join(', '),
                          style: const TextStyle(
                              fontSize: 12, color: AppTheme.textSecondary),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                  ],
                  Row(
                    children: [
                      if (route.distanceKm != null)
                        _StatPill(
                          icon: Icons.straighten,
                          text: '${route.distanceKm!.toStringAsFixed(1)} km',
                          color: color,
                        ),
                      if (route.elevationGain != null) ...[
                        const SizedBox(width: 8),
                        _StatPill(
                          icon: Icons.terrain,
                          text: '${route.elevationGain!.toStringAsFixed(0)} m',
                          color: color,
                        ),
                      ],
                      if (route.durationMin != null) ...[
                        const SizedBox(width: 8),
                        _StatPill(
                          icon: Icons.timer_outlined,
                          text: _fmtDur(route.durationMin!),
                          color: color,
                        ),
                      ],
                      const Spacer(),
                      Text(
                        '${AppTheme.sportEmoji(route.sport.type)} ${AppTheme.sportLabel(route.sport.type)}',
                        style: const TextStyle(
                            fontSize: 12, color: AppTheme.textSecondary),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _fmtDur(int min) {
    final h = min ~/ 60;
    final m = min % 60;
    if (h == 0) return '${m}min';
    return m == 0 ? '${h}h' : '${h}h ${m}min';
  }
}

class _ImagePlaceholder extends StatelessWidget {
  final Color color;
  const _ImagePlaceholder({required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 140,
      width: double.infinity,
      color: color.withValues(alpha: 0.10),
      child: Center(
        child: Icon(Icons.landscape_outlined, size: 48, color: color.withValues(alpha: 0.4)),
      ),
    );
  }
}

class _StatPill extends StatelessWidget {
  final IconData icon;
  final String text;
  final Color color;

  const _StatPill({required this.icon, required this.text, required this.color});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 13, color: color),
        const SizedBox(width: 3),
        Text(text,
            style:
                TextStyle(fontSize: 12, color: color, fontWeight: FontWeight.w500)),
      ],
    );
  }
}
