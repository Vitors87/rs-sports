import '../models/user.dart';
import '../models/activity.dart';
import 'api_service.dart';

class ProfileResult {
  final UserProfile user;
  final List<Activity> activities;
  final List<Achievement> achievements;
  final bool isFollowing;
  final bool isSelf;

  const ProfileResult({
    required this.user,
    required this.activities,
    required this.achievements,
    required this.isFollowing,
    required this.isSelf,
  });
}

class ProfileService {
  final _api = ApiService();

  Future<ProfileResult> fetchProfile(String username) async {
    final data = await _api.get('/api/profile/$username');
    final activities = (data['activities'] as List<dynamic>)
        .map((e) => Activity.fromJson(e as Map<String, dynamic>))
        .toList();
    final achievements = (data['achievements'] as List<dynamic>)
        .map((e) => Achievement.fromJson(e as Map<String, dynamic>))
        .toList();
    return ProfileResult(
      user: UserProfile.fromJson(data['user'] as Map<String, dynamic>),
      activities: activities,
      achievements: achievements,
      isFollowing: data['isFollowing'] as bool? ?? false,
      isSelf: data['isSelf'] as bool? ?? false,
    );
  }

  Future<UserProfile> updateProfile(
    String username, {
    String? name,
    String? bio,
  }) async {
    final data = await _api.patch('/api/profile/$username', body: {
      if (name != null) 'name': name,
      if (bio != null) 'bio': bio,
    });
    return UserProfile.fromJson(data['user'] as Map<String, dynamic>);
  }
}
