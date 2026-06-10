import 'package:flutter/material.dart';
import '../models/activity.dart';
import '../services/activity_service.dart';
import '../widgets/activity_card.dart';
import '../widgets/empty_state.dart';
import '../theme/app_theme.dart';
import 'activity_detail_screen.dart';
import 'new_activity_screen.dart';

class FeedScreen extends StatefulWidget {
  const FeedScreen({super.key});

  @override
  State<FeedScreen> createState() => _FeedScreenState();
}

class _FeedScreenState extends State<FeedScreen> {
  final _service = ActivityService();
  List<Activity> _activities = [];
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
      final activities = await _service.fetchFeed();
      if (mounted) setState(() => _activities = activities);
    } catch (e) {
      if (mounted) setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _toggleLike(int index) async {
    final activity = _activities[index];
    // Optimistic update
    setState(() {
      _activities[index] = Activity(
        id: activity.id,
        title: activity.title,
        description: activity.description,
        distance: activity.distance,
        duration: activity.duration,
        elevation: activity.elevation,
        date: activity.date,
        user: activity.user,
        sport: activity.sport,
        commentCount: activity.commentCount,
        likeCount: activity.isLiked ? activity.likeCount - 1 : activity.likeCount + 1,
        isLiked: !activity.isLiked,
      );
    });
    try {
      final result = await _service.toggleLike(activity.id);
      if (mounted) {
        setState(() {
          _activities[index] = Activity(
            id: activity.id,
            title: activity.title,
            description: activity.description,
            distance: activity.distance,
            duration: activity.duration,
            elevation: activity.elevation,
            date: activity.date,
            user: activity.user,
            sport: activity.sport,
            commentCount: activity.commentCount,
            likeCount: result.likeCount,
            isLiked: result.liked,
          );
        });
      }
    } catch (_) {
      // Revert on error
      if (mounted) setState(() => _activities[index] = activity);
    }
  }

  void _openDetail(Activity activity) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => ActivityDetailScreen(activity: activity)),
    ).then((_) => _load());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Feed'),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _load),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          await Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const NewActivityScreen()),
          );
          _load();
        },
        backgroundColor: AppTheme.primary,
        foregroundColor: Colors.white,
        child: const Icon(Icons.add),
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }
    if (_error != null) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.error_outline, size: 48, color: AppTheme.textSecondary),
            const SizedBox(height: 12),
            Text(_error!, textAlign: TextAlign.center, style: const TextStyle(color: AppTheme.textSecondary)),
            const SizedBox(height: 16),
            ElevatedButton(onPressed: _load, child: const Text('Reintentar')),
          ],
        ),
      );
    }
    if (_activities.isEmpty) {
      return const EmptyState(
        emoji: '🏃',
        title: 'Sin actividades aún',
        subtitle: 'Sé el primero en registrar una actividad',
      );
    }
    return RefreshIndicator(
      onRefresh: _load,
      child: ListView.builder(
        padding: const EdgeInsets.symmetric(vertical: 8),
        itemCount: _activities.length,
        itemBuilder: (_, i) => ActivityCard(
          activity: _activities[i],
          onLike: () => _toggleLike(i),
          onComment: () => _openDetail(_activities[i]),
          onTap: () => _openDetail(_activities[i]),
        ),
      ),
    );
  }
}
