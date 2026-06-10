import '../models/activity.dart';
import '../models/comment.dart';
import 'api_service.dart';

class ActivityService {
  final _api = ApiService();

  Future<List<Activity>> fetchFeed() async {
    final data = await _api.get('/api/activities');
    final list = data['activities'] as List<dynamic>;
    return list.map((e) => Activity.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<({bool liked, int likeCount})> toggleLike(String activityId) async {
    final data = await _api.post('/api/activities/$activityId/like');
    return (liked: data['liked'] as bool, likeCount: (data['likeCount'] as num).toInt());
  }

  Future<List<Comment>> fetchComments(String activityId) async {
    final data = await _api.get('/api/activities/$activityId/comments');
    final list = data['comments'] as List<dynamic>;
    return list.map((e) => Comment.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<Comment> postComment(String activityId, String content) async {
    final data = await _api.post('/api/activities/$activityId/comments', body: {'content': content});
    return Comment.fromJson(data['comment'] as Map<String, dynamic>);
  }

  Future<Activity> createActivity({
    required String sportId,
    required String title,
    String? description,
    double? distance,
    int? duration,
    double? elevation,
    required String date,
  }) async {
    final data = await _api.post('/api/activities', body: {
      'sportId': sportId,
      'title': title,
      if (description != null && description.isNotEmpty) 'description': description,
      if (distance != null) 'distance': distance,
      if (duration != null) 'duration': duration,
      if (elevation != null) 'elevation': elevation,
      'date': date,
    });
    return Activity.fromJson(data['activity'] as Map<String, dynamic>);
  }
}
