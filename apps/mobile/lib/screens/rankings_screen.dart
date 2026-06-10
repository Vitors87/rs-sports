import 'package:flutter/material.dart';
import '../models/ranking.dart';
import '../services/ranking_service.dart';
import '../theme/app_theme.dart';
import '../widgets/empty_state.dart';

class RankingsScreen extends StatefulWidget {
  const RankingsScreen({super.key});

  @override
  State<RankingsScreen> createState() => _RankingsScreenState();
}

class _RankingsScreenState extends State<RankingsScreen>
    with SingleTickerProviderStateMixin {
  final _service = RankingService();
  late TabController _tabController;

  Map<String, List<RankingEntry>> _rankings = {};
  bool _loading = true;
  String? _error;

  static const _sports = [
    ('RUNNING', 'Running', '🏃'),
    ('CYCLING', 'Ciclismo', '🚴'),
    ('TREKKING', 'Trekking', '⛰️'),
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _sports.length, vsync: this);
    _load();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final rankings = await _service.fetchRankings();
      if (mounted) setState(() => _rankings = rankings);
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
        title: const Text('Rankings'),
        actions: [IconButton(icon: const Icon(Icons.refresh), onPressed: _load)],
        bottom: TabBar(
          controller: _tabController,
          tabs: _sports
              .map((s) => Tab(text: '${s.$3} ${s.$2}'))
              .toList(),
          labelColor: AppTheme.primary,
          unselectedLabelColor: AppTheme.textSecondary,
          indicatorColor: AppTheme.primary,
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
    return TabBarView(
      controller: _tabController,
      children: _sports.map((s) {
        final entries = _rankings[s.$1] ?? [];
        if (entries.isEmpty) {
          return EmptyState(
            emoji: s.$3,
            title: 'Sin datos aún',
            subtitle: 'No hay actividades de ${s.$2} registradas',
          );
        }
        return RefreshIndicator(
          onRefresh: _load,
          child: ListView.builder(
            padding: const EdgeInsets.symmetric(vertical: 8),
            itemCount: entries.length,
            itemBuilder: (_, i) => _RankingTile(entry: entries[i], sportType: s.$1),
          ),
        );
      }).toList(),
    );
  }
}

class _RankingTile extends StatelessWidget {
  final RankingEntry entry;
  final String sportType;

  const _RankingTile({required this.entry, required this.sportType});

  @override
  Widget build(BuildContext context) {
    final color = AppTheme.sportColor(sportType);
    final isTop3 = entry.position <= 3;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: isTop3 ? color.withValues(alpha: 0.06) : AppTheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isTop3 ? color.withValues(alpha: 0.3) : AppTheme.divider,
        ),
      ),
      child: Row(
        children: [
          SizedBox(
            width: 36,
            child: _PositionBadge(position: entry.position, color: color),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  entry.name,
                  style: const TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 14,
                    color: AppTheme.textPrimary,
                  ),
                ),
                Text(
                  '@${entry.username} · ${entry.activities} actividades',
                  style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '${entry.score} ${entry.unit}',
                style: TextStyle(
                  fontWeight: FontWeight.w700,
                  fontSize: 15,
                  color: isTop3 ? color : AppTheme.textPrimary,
                ),
              ),
              const Text('total', style: TextStyle(fontSize: 11, color: AppTheme.textSecondary)),
            ],
          ),
        ],
      ),
    );
  }
}

class _PositionBadge extends StatelessWidget {
  final int position;
  final Color color;

  const _PositionBadge({required this.position, required this.color});

  @override
  Widget build(BuildContext context) {
    if (position == 1) return const Text('🥇', style: TextStyle(fontSize: 22));
    if (position == 2) return const Text('🥈', style: TextStyle(fontSize: 22));
    if (position == 3) return const Text('🥉', style: TextStyle(fontSize: 22));
    return Container(
      width: 28,
      height: 28,
      decoration: BoxDecoration(
        color: AppTheme.background,
        shape: BoxShape.circle,
        border: Border.all(color: AppTheme.divider),
      ),
      child: Center(
        child: Text(
          '$position',
          style: const TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: AppTheme.textSecondary,
          ),
        ),
      ),
    );
  }
}
