import 'package:flutter/material.dart';
import '../models/route.dart';
import '../services/route_service.dart';
import '../theme/app_theme.dart';
import '../widgets/sport_badge.dart';

class RouteDetailScreen extends StatefulWidget {
  final AppRoute route;

  const RouteDetailScreen({super.key, required this.route});

  @override
  State<RouteDetailScreen> createState() => _RouteDetailScreenState();
}

class _RouteDetailScreenState extends State<RouteDetailScreen> {
  late AppRoute _route;
  bool _loading = false;

  @override
  void initState() {
    super.initState();
    _route = widget.route;
    _loadDetail();
  }

  Future<void> _loadDetail() async {
    setState(() => _loading = true);
    try {
      final detail = await RouteService().fetchRouteById(_route.id);
      if (mounted) setState(() => _route = detail);
    } catch (_) {
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  String _fmtDur(int min) {
    final h = min ~/ 60;
    final m = min % 60;
    if (h == 0) return '$m min';
    return m == 0 ? '$h h' : '$h h $m min';
  }

  @override
  Widget build(BuildContext context) {
    final route = _route;
    final color = AppTheme.sportColor(route.sport.type);
    final diffColor = AppTheme.difficultyColor(route.difficulty);
    final diffLabel = AppTheme.difficultyLabel(route.difficulty);

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 220,
            pinned: true,
            backgroundColor: color,
            foregroundColor: Colors.white,
            flexibleSpace: FlexibleSpaceBar(
              title: Text(
                route.title,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  shadows: [Shadow(blurRadius: 8, color: Colors.black54)],
                ),
              ),
              background: route.imageUrl != null && route.imageUrl!.isNotEmpty
                  ? Image.network(
                      route.imageUrl!,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => _HeroPlaceholder(color: color),
                    )
                  : _HeroPlaceholder(color: color),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Badges row
                  Row(
                    children: [
                      SportBadge(type: route.sport.type, name: route.sport.name),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                        decoration: BoxDecoration(
                          color: diffColor.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: diffColor.withValues(alpha: 0.4)),
                        ),
                        child: Text(
                          diffLabel,
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: diffColor,
                          ),
                        ),
                      ),
                      if (_loading) ...[
                        const Spacer(),
                        const SizedBox(
                          width: 16,
                          height: 16,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 16),
                  // Location
                  if (route.region != null || route.city != null) ...[
                    Row(
                      children: [
                        const Icon(Icons.place_outlined, size: 16,
                            color: AppTheme.textSecondary),
                        const SizedBox(width: 6),
                        Text(
                          [route.city, route.region]
                              .where((s) => s != null && s.isNotEmpty)
                              .join(', '),
                          style: const TextStyle(
                              fontSize: 14, color: AppTheme.textSecondary),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                  ],
                  // Stats grid
                  const Text(
                    'Estadísticas',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: AppTheme.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 10),
                  GridView.count(
                    crossAxisCount: 2,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    childAspectRatio: 2.2,
                    children: [
                      if (route.distanceKm != null)
                        _StatCard(
                          icon: Icons.straighten,
                          value: '${route.distanceKm!.toStringAsFixed(1)} km',
                          label: 'Distancia',
                          color: color,
                        ),
                      if (route.elevationGain != null)
                        _StatCard(
                          icon: Icons.terrain,
                          value: '${route.elevationGain!.toStringAsFixed(0)} m',
                          label: 'Desnivel',
                          color: color,
                        ),
                      if (route.durationMin != null)
                        _StatCard(
                          icon: Icons.timer_outlined,
                          value: _fmtDur(route.durationMin!),
                          label: 'Duración est.',
                          color: color,
                        ),
                      _StatCard(
                        icon: Icons.bar_chart,
                        value: diffLabel,
                        label: 'Dificultad',
                        color: diffColor,
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _HeroPlaceholder extends StatelessWidget {
  final Color color;
  const _HeroPlaceholder({required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: color.withValues(alpha: 0.2),
      child: Center(
        child: Icon(Icons.landscape_outlined, size: 72,
            color: color.withValues(alpha: 0.5)),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final IconData icon;
  final String value;
  final String label;
  final Color color;

  const _StatCard({
    required this.icon,
    required this.value,
    required this.label,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.07),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withValues(alpha: 0.2)),
      ),
      child: Row(
        children: [
          Icon(icon, color: color, size: 22),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  value,
                  style: const TextStyle(
                    fontWeight: FontWeight.w700,
                    fontSize: 14,
                    color: AppTheme.textPrimary,
                  ),
                ),
                Text(
                  label,
                  style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
