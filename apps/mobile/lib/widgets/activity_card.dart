import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/activity.dart';
import '../theme/app_theme.dart';
import 'user_avatar.dart';
import 'sport_badge.dart';

class ActivityCard extends StatelessWidget {
  final Activity activity;
  final VoidCallback? onLike;
  final VoidCallback? onComment;
  final VoidCallback? onTap;

  const ActivityCard({
    super.key,
    required this.activity,
    this.onLike,
    this.onComment,
    this.onTap,
  });

  String _formatDate(String iso) {
    try {
      final dt = DateTime.parse(iso).toLocal();
      return DateFormat('d MMM yyyy', 'es').format(dt);
    } catch (_) {
      return iso;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _Header(activity: activity, formatDate: _formatDate),
              const SizedBox(height: 12),
              Text(
                activity.title,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.textPrimary,
                ),
              ),
              if (activity.description != null && activity.description!.isNotEmpty) ...[
                const SizedBox(height: 4),
                Text(
                  activity.description!,
                  style: const TextStyle(fontSize: 14, color: AppTheme.textSecondary),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
              if (_hasStats) ...[
                const SizedBox(height: 12),
                _StatsRow(activity: activity),
              ],
              const SizedBox(height: 12),
              const Divider(height: 1, color: AppTheme.divider),
              const SizedBox(height: 8),
              _Actions(activity: activity, onLike: onLike, onComment: onComment),
            ],
          ),
        ),
      ),
    );
  }

  bool get _hasStats =>
      activity.distance != null || activity.duration != null || activity.elevation != null;
}

class _Header extends StatelessWidget {
  final Activity activity;
  final String Function(String) formatDate;

  const _Header({required this.activity, required this.formatDate});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        UserAvatar(
          avatarUrl: activity.user.avatarUrl,
          initials: activity.user.initials,
          size: 40,
          backgroundColor: AppTheme.sportColor(activity.sport.type),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                activity.user.name,
                style: const TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 14,
                  color: AppTheme.textPrimary,
                ),
              ),
              Text(
                '@${activity.user.username} · ${formatDate(activity.date)}',
                style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
              ),
            ],
          ),
        ),
        SportBadge(type: activity.sport.type, name: activity.sport.name, compact: true),
      ],
    );
  }
}

class _StatsRow extends StatelessWidget {
  final Activity activity;

  const _StatsRow({required this.activity});

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 12,
      children: [
        if (activity.distance != null)
          _StatChip(
            icon: Icons.straighten,
            value: '${activity.distance!.toStringAsFixed(1)} km',
          ),
        if (activity.duration != null)
          _StatChip(
            icon: Icons.timer_outlined,
            value: _formatDuration(activity.duration!),
          ),
        if (activity.elevation != null)
          _StatChip(
            icon: Icons.terrain,
            value: '${activity.elevation!.toStringAsFixed(0)} m',
          ),
      ],
    );
  }

  String _formatDuration(int minutes) {
    if (minutes < 60) return '${minutes}min';
    final h = minutes ~/ 60;
    final m = minutes % 60;
    return m == 0 ? '${h}h' : '${h}h ${m}min';
  }
}

class _StatChip extends StatelessWidget {
  final IconData icon;
  final String value;

  const _StatChip({required this.icon, required this.value});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 14, color: AppTheme.textSecondary),
        const SizedBox(width: 4),
        Text(
          value,
          style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary),
        ),
      ],
    );
  }
}

class _Actions extends StatelessWidget {
  final Activity activity;
  final VoidCallback? onLike;
  final VoidCallback? onComment;

  const _Actions({required this.activity, this.onLike, this.onComment});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        InkWell(
          onTap: onLike,
          borderRadius: BorderRadius.circular(8),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            child: Row(
              children: [
                Icon(
                  activity.isLiked ? Icons.favorite : Icons.favorite_border,
                  size: 20,
                  color: activity.isLiked ? Colors.red : AppTheme.textSecondary,
                ),
                const SizedBox(width: 4),
                Text(
                  '${activity.likeCount}',
                  style: TextStyle(
                    fontSize: 13,
                    color: activity.isLiked ? Colors.red : AppTheme.textSecondary,
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(width: 8),
        InkWell(
          onTap: onComment,
          borderRadius: BorderRadius.circular(8),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            child: Row(
              children: [
                const Icon(Icons.chat_bubble_outline, size: 20, color: AppTheme.textSecondary),
                const SizedBox(width: 4),
                Text(
                  '${activity.commentCount}',
                  style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
