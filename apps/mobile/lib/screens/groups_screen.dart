import 'package:flutter/material.dart';
import '../models/group.dart';
import '../services/group_service.dart';
import '../theme/app_theme.dart';
import '../widgets/sport_badge.dart';
import '../widgets/empty_state.dart';

class GroupsScreen extends StatefulWidget {
  const GroupsScreen({super.key});

  @override
  State<GroupsScreen> createState() => _GroupsScreenState();
}

class _GroupsScreenState extends State<GroupsScreen> {
  final _service = GroupService();
  List<Group> _groups = [];
  bool _loading = true;
  String? _error;

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
      final groups = await _service.fetchGroups();
      if (mounted) setState(() => _groups = groups);
    } catch (e) {
      if (mounted) setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _toggleJoin(int index) async {
    final group = _groups[index];
    final wasMember = group.isMember;
    setState(() {
      _groups[index] = Group(
        id: group.id,
        name: group.name,
        description: group.description,
        members: wasMember ? group.members - 1 : group.members + 1,
        recentActivity: group.recentActivity,
        isMember: !wasMember,
        sport: group.sport,
      );
    });
    try {
      final isMember = await _service.toggleJoin(group.id);
      if (mounted) {
        setState(() {
          _groups[index] = Group(
            id: group.id,
            name: group.name,
            description: group.description,
            members: isMember ? group.members + 1 : group.members - 1,
            recentActivity: group.recentActivity,
            isMember: isMember,
            sport: group.sport,
          );
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _groups[index] = group);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: Colors.red),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Comunidades'),
        actions: [IconButton(icon: const Icon(Icons.refresh), onPressed: _load)],
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
    if (_groups.isEmpty) {
      return const EmptyState(
        emoji: '👥',
        title: 'Sin comunidades aún',
        subtitle: 'No hay comunidades creadas todavía',
      );
    }
    return RefreshIndicator(
      onRefresh: _load,
      child: ListView.builder(
        padding: const EdgeInsets.symmetric(vertical: 8),
        itemCount: _groups.length,
        itemBuilder: (_, i) => _GroupCard(
          group: _groups[i],
          onToggle: () => _toggleJoin(i),
        ),
      ),
    );
  }
}

class _GroupCard extends StatelessWidget {
  final Group group;
  final VoidCallback onToggle;

  const _GroupCard({required this.group, required this.onToggle});

  @override
  Widget build(BuildContext context) {
    final sport = group.sport;
    final color = sport != null ? AppTheme.sportColor(sport.type) : AppTheme.primary;

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Center(
                    child: Text(
                      sport != null ? AppTheme.sportEmoji(sport.type) : '👥',
                      style: const TextStyle(fontSize: 22),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        group.name,
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: AppTheme.textPrimary,
                        ),
                      ),
                      Row(
                        children: [
                          const Icon(Icons.group_outlined, size: 13, color: AppTheme.textSecondary),
                          const SizedBox(width: 3),
                          Text(
                            '${group.members} miembros',
                            style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                          ),
                          if (group.recentActivity.isNotEmpty) ...[
                            const Text(' · ', style: TextStyle(color: AppTheme.textSecondary, fontSize: 12)),
                            Text(
                              group.recentActivity,
                              style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                            ),
                          ],
                        ],
                      ),
                    ],
                  ),
                ),
                if (sport != null)
                  SportBadge(type: sport.type, name: sport.name, compact: true),
              ],
            ),
            if (group.description.isNotEmpty) ...[
              const SizedBox(height: 8),
              Text(
                group.description,
                style: const TextStyle(fontSize: 14, color: AppTheme.textSecondary),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: group.isMember
                  ? OutlinedButton(
                      onPressed: onToggle,
                      style: OutlinedButton.styleFrom(
                        foregroundColor: color,
                        side: BorderSide(color: color),
                      ),
                      child: const Text('Salir del grupo'),
                    )
                  : ElevatedButton(
                      onPressed: onToggle,
                      style: ElevatedButton.styleFrom(backgroundColor: color),
                      child: const Text('Unirse', style: TextStyle(color: Colors.white)),
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
