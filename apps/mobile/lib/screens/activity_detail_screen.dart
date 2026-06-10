import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/activity.dart';
import '../models/comment.dart';
import '../services/activity_service.dart';
import '../theme/app_theme.dart';
import '../widgets/sport_badge.dart';
import '../widgets/user_avatar.dart';

class ActivityDetailScreen extends StatefulWidget {
  final Activity activity;

  const ActivityDetailScreen({super.key, required this.activity});

  @override
  State<ActivityDetailScreen> createState() => _ActivityDetailScreenState();
}

class _ActivityDetailScreenState extends State<ActivityDetailScreen> {
  final _service = ActivityService();
  final _commentController = TextEditingController();
  final _scrollController = ScrollController();

  List<Comment> _comments = [];
  bool _loadingComments = true;
  bool _posting = false;

  @override
  void initState() {
    super.initState();
    _loadComments();
  }

  @override
  void dispose() {
    _commentController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _loadComments() async {
    setState(() => _loadingComments = true);
    try {
      final comments = await _service.fetchComments(widget.activity.id);
      if (mounted) setState(() => _comments = comments);
    } catch (_) {
    } finally {
      if (mounted) setState(() => _loadingComments = false);
    }
  }

  Future<void> _postComment() async {
    final content = _commentController.text.trim();
    if (content.isEmpty) return;
    setState(() => _posting = true);
    try {
      final comment = await _service.postComment(widget.activity.id, content);
      if (mounted) {
        _commentController.clear();
        setState(() => _comments = [..._comments, comment]);
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (_scrollController.hasClients) {
            _scrollController.animateTo(
              _scrollController.position.maxScrollExtent,
              duration: const Duration(milliseconds: 300),
              curve: Curves.easeOut,
            );
          }
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _posting = false);
    }
  }

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
    final a = widget.activity;
    return Scaffold(
      appBar: AppBar(title: const Text('Actividad')),
      body: Column(
        children: [
          Expanded(
            child: ListView(
              controller: _scrollController,
              padding: const EdgeInsets.all(16),
              children: [
                _ActivityHeader(activity: a, formatDate: _formatDate),
                const SizedBox(height: 16),
                if (a.description != null && a.description!.isNotEmpty) ...[
                  Text(a.description!, style: const TextStyle(fontSize: 15, color: AppTheme.textSecondary)),
                  const SizedBox(height: 16),
                ],
                if (a.distance != null || a.duration != null || a.elevation != null)
                  _StatsGrid(activity: a),
                const SizedBox(height: 24),
                const Text(
                  'Comentarios',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppTheme.textPrimary),
                ),
                const SizedBox(height: 12),
                if (_loadingComments)
                  const Center(child: CircularProgressIndicator())
                else if (_comments.isEmpty)
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 16),
                    child: Text('Sin comentarios aún. ¡Sé el primero!',
                        style: TextStyle(color: AppTheme.textSecondary)),
                  )
                else
                  ..._comments.map((c) => _CommentTile(comment: c)),
              ],
            ),
          ),
          _CommentInput(
            controller: _commentController,
            posting: _posting,
            onPost: _postComment,
          ),
        ],
      ),
    );
  }
}

class _ActivityHeader extends StatelessWidget {
  final Activity activity;
  final String Function(String) formatDate;

  const _ActivityHeader({required this.activity, required this.formatDate});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            UserAvatar(
              avatarUrl: activity.user.avatarUrl,
              initials: activity.user.initials,
              size: 44,
              backgroundColor: AppTheme.sportColor(activity.sport.type),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(activity.user.name,
                      style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
                  Text('@${activity.user.username} · ${formatDate(activity.date)}',
                      style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary)),
                ],
              ),
            ),
            SportBadge(type: activity.sport.type, name: activity.sport.name),
          ],
        ),
        const SizedBox(height: 12),
        Text(
          activity.title,
          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: AppTheme.textPrimary),
        ),
      ],
    );
  }
}

class _StatsGrid extends StatelessWidget {
  final Activity activity;

  const _StatsGrid({required this.activity});

  @override
  Widget build(BuildContext context) {
    final stats = <(IconData, String, String)>[
      if (activity.distance != null) (Icons.straighten, '${activity.distance!.toStringAsFixed(1)} km', 'Distancia'),
      if (activity.duration != null) (Icons.timer_outlined, _fmtDur(activity.duration!), 'Duración'),
      if (activity.elevation != null) (Icons.terrain, '${activity.elevation!.toStringAsFixed(0)} m', 'Elevación'),
    ];
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.background,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: stats
            .map((s) => Expanded(child: _StatCell(icon: s.$1, value: s.$2, label: s.$3)))
            .toList(),
      ),
    );
  }

  String _fmtDur(int minutes) {
    if (minutes < 60) return '${minutes}min';
    final h = minutes ~/ 60;
    final m = minutes % 60;
    return m == 0 ? '${h}h' : '${h}h ${m}min';
  }
}

class _StatCell extends StatelessWidget {
  final IconData icon;
  final String value;
  final String label;

  const _StatCell({required this.icon, required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Icon(icon, color: AppTheme.primary, size: 22),
        const SizedBox(height: 4),
        Text(value, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15, color: AppTheme.textPrimary)),
        Text(label, style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary)),
      ],
    );
  }
}

class _CommentTile extends StatelessWidget {
  final Comment comment;

  const _CommentTile({required this.comment});

  String _timeAgo(String iso) {
    try {
      final dt = DateTime.parse(iso).toLocal();
      final diff = DateTime.now().difference(dt);
      if (diff.inDays > 30) return DateFormat('d MMM', 'es').format(dt);
      if (diff.inDays > 1) return 'Hace ${diff.inDays} días';
      if (diff.inDays == 1) return 'Ayer';
      if (diff.inHours > 0) return 'Hace ${diff.inHours}h';
      if (diff.inMinutes > 0) return 'Hace ${diff.inMinutes}min';
      return 'Ahora';
    } catch (_) {
      return '';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CircleAvatar(
            radius: 16,
            backgroundColor: AppTheme.primary,
            child: Text(
              comment.user.initials,
              style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppTheme.background,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(comment.user.name,
                          style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                      const SizedBox(width: 6),
                      Text(_timeAgo(comment.createdAt),
                          style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary)),
                    ],
                  ),
                  const SizedBox(height: 2),
                  Text(comment.content, style: const TextStyle(fontSize: 14)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _CommentInput extends StatelessWidget {
  final TextEditingController controller;
  final bool posting;
  final VoidCallback onPost;

  const _CommentInput({required this.controller, required this.posting, required this.onPost});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(
        left: 16,
        right: 8,
        top: 8,
        bottom: MediaQuery.of(context).viewInsets.bottom + 8,
      ),
      decoration: const BoxDecoration(
        color: AppTheme.surface,
        border: Border(top: BorderSide(color: AppTheme.divider)),
      ),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: controller,
              decoration: const InputDecoration(
                hintText: 'Escribe un comentario...',
                border: OutlineInputBorder(),
                contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                isDense: true,
              ),
              maxLines: null,
              textInputAction: TextInputAction.send,
              onSubmitted: (_) => onPost(),
            ),
          ),
          const SizedBox(width: 8),
          posting
              ? const SizedBox(width: 40, height: 40, child: CircularProgressIndicator(strokeWidth: 2))
              : IconButton(
                  icon: const Icon(Icons.send, color: AppTheme.primary),
                  onPressed: onPost,
                ),
        ],
      ),
    );
  }
}
