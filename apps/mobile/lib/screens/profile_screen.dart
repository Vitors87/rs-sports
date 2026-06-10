import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/activity.dart';
import '../models/user.dart';
import '../services/profile_service.dart';
import '../theme/app_theme.dart';
import '../widgets/sport_badge.dart';
import '../widgets/user_avatar.dart';
import '../widgets/empty_state.dart';
import 'groups_screen.dart';
import 'rankings_screen.dart';

const _kDemoUsername = 'demo_runner';

class ProfileScreen extends StatefulWidget {
  final String username;

  const ProfileScreen({super.key, this.username = _kDemoUsername});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _service = ProfileService();
  ProfileResult? _result;
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
      final result = await _service.fetchProfile(widget.username);
      if (mounted) setState(() => _result = result);
    } catch (e) {
      if (mounted) setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _openEditProfile() {
    if (_result == null) return;
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => _EditProfileSheet(
        user: _result!.user,
        service: _service,
        onSaved: _load,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Perfil'),
        actions: [
          if (_result?.isSelf == true)
            IconButton(icon: const Icon(Icons.edit_outlined), onPressed: _openEditProfile),
          IconButton(icon: const Icon(Icons.refresh), onPressed: _load),
        ],
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
    final result = _result!;
    return RefreshIndicator(
      onRefresh: _load,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _ProfileHeader(user: result.user),
          const SizedBox(height: 16),
          _StatsRow(stats: result.user.stats),
          if (result.achievements.isNotEmpty) ...[
            const SizedBox(height: 20),
            const Text('Logros',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppTheme.textPrimary)),
            const SizedBox(height: 10),
            ...result.achievements.map((a) => _AchievementTile(achievement: a)),
          ],
          const SizedBox(height: 20),
          const Text('Actividades',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppTheme.textPrimary)),
          const SizedBox(height: 10),
          if (result.activities.isEmpty)
            const EmptyState(emoji: '🏃', title: 'Sin actividades aún')
          else
            ...result.activities.map((a) => _ActivityRow(activity: a)),
          const SizedBox(height: 24),
          const Text('Explorar',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppTheme.textPrimary)),
          const SizedBox(height: 10),
          const _ExploreSection(),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}

class _ExploreSection extends StatelessWidget {
  const _ExploreSection();

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _ExploreTile(
          icon: Icons.group_outlined,
          title: 'Comunidades',
          subtitle: 'Grupos de Running, Ciclismo y Trekking',
          color: AppTheme.cyclingColor,
          onTap: () => Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const GroupsScreen()),
          ),
        ),
        const SizedBox(height: 8),
        _ExploreTile(
          icon: Icons.leaderboard_outlined,
          title: 'Rankings',
          subtitle: 'Clasificación por disciplina y kilómetros',
          color: AppTheme.runningColor,
          onTap: () => Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const RankingsScreen()),
          ),
        ),
      ],
    );
  }
}

class _ExploreTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final Color color;
  final VoidCallback onTap;

  const _ExploreTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: AppTheme.surface,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppTheme.divider),
        ),
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 22),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title,
                      style: const TextStyle(
                          fontWeight: FontWeight.w600,
                          fontSize: 14,
                          color: AppTheme.textPrimary)),
                  Text(subtitle,
                      style: const TextStyle(
                          fontSize: 12, color: AppTheme.textSecondary)),
                ],
              ),
            ),
            const Icon(Icons.chevron_right, color: AppTheme.textSecondary),
          ],
        ),
      ),
    );
  }
}

class _ProfileHeader extends StatelessWidget {
  final UserProfile user;

  const _ProfileHeader({required this.user});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        UserAvatar(avatarUrl: user.avatarUrl, initials: user.initials, size: 72),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                user.name,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  color: AppTheme.textPrimary,
                ),
              ),
              Text(
                '@${user.username}',
                style: const TextStyle(fontSize: 14, color: AppTheme.textSecondary),
              ),
              if (user.bio != null && user.bio!.isNotEmpty) ...[
                const SizedBox(height: 4),
                Text(user.bio!, style: const TextStyle(fontSize: 14, color: AppTheme.textSecondary)),
              ],
            ],
          ),
        ),
      ],
    );
  }
}

class _StatsRow extends StatelessWidget {
  final UserStats stats;

  const _StatsRow({required this.stats});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.background,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          _StatCell(value: '${stats.activities}', label: 'Actividades'),
          _StatCell(value: '${stats.totalKm} km', label: 'Total km'),
          _StatCell(value: '${stats.followers}', label: 'Seguidores'),
          _StatCell(value: '${stats.following}', label: 'Siguiendo'),
        ],
      ),
    );
  }
}

class _StatCell extends StatelessWidget {
  final String value;
  final String label;

  const _StatCell({required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Column(
        children: [
          Text(value,
              style: const TextStyle(
                  fontWeight: FontWeight.w700, fontSize: 16, color: AppTheme.textPrimary)),
          Text(label,
              style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary),
              textAlign: TextAlign.center),
        ],
      ),
    );
  }
}

class _AchievementTile extends StatelessWidget {
  final Achievement achievement;

  const _AchievementTile({required this.achievement});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppTheme.primary.withValues(alpha: 0.06),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.primary.withValues(alpha: 0.2)),
      ),
      child: Row(
        children: [
          Text(achievement.icon, style: const TextStyle(fontSize: 24)),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(achievement.title,
                    style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                Text(achievement.description,
                    style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ActivityRow extends StatelessWidget {
  final Activity activity;

  const _ActivityRow({required this.activity});

  String _formatDate(String iso) {
    try {
      return DateFormat('d MMM yyyy', 'es').format(DateTime.parse(iso).toLocal());
    } catch (_) {
      return iso;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.divider),
      ),
      child: Row(
        children: [
          SportBadge(type: activity.sport.type, name: activity.sport.name, compact: true),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(activity.title,
                    style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis),
                Text(_formatDate(activity.date),
                    style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary)),
              ],
            ),
          ),
          if (activity.distance != null)
            Text('${activity.distance!.toStringAsFixed(1)} km',
                style: const TextStyle(
                    fontSize: 13, fontWeight: FontWeight.w600, color: AppTheme.textSecondary)),
        ],
      ),
    );
  }
}

class _EditProfileSheet extends StatefulWidget {
  final UserProfile user;
  final ProfileService service;
  final VoidCallback onSaved;

  const _EditProfileSheet({
    required this.user,
    required this.service,
    required this.onSaved,
  });

  @override
  State<_EditProfileSheet> createState() => _EditProfileSheetState();
}

class _EditProfileSheetState extends State<_EditProfileSheet> {
  late final TextEditingController _nameCtrl;
  late final TextEditingController _bioCtrl;
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    _nameCtrl = TextEditingController(text: widget.user.name);
    _bioCtrl = TextEditingController(text: widget.user.bio ?? '');
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _bioCtrl.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    final name = _nameCtrl.text.trim();
    if (name.isEmpty) return;
    setState(() => _saving = true);
    try {
      await widget.service.updateProfile(
        widget.user.username,
        name: name,
        bio: _bioCtrl.text.trim(),
      );
      if (mounted) {
        Navigator.pop(context);
        widget.onSaved();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        left: 20,
        right: 20,
        top: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom + 20,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Editar perfil',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
          const SizedBox(height: 16),
          const Text('Nombre', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppTheme.textSecondary)),
          const SizedBox(height: 6),
          TextField(
            controller: _nameCtrl,
            decoration: const InputDecoration(border: OutlineInputBorder()),
          ),
          const SizedBox(height: 12),
          const Text('Bio', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppTheme.textSecondary)),
          const SizedBox(height: 6),
          TextField(
            controller: _bioCtrl,
            decoration: const InputDecoration(
              border: OutlineInputBorder(),
              hintText: 'Cuéntanos sobre ti...',
            ),
            maxLines: 3,
            maxLength: 300,
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _saving ? null : _save,
              child: _saving
                  ? const SizedBox(
                      width: 18,
                      height: 18,
                      child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                    )
                  : const Text('Guardar'),
            ),
          ),
        ],
      ),
    );
  }
}
