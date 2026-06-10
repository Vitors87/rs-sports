import 'sport.dart';
import 'user.dart';

class Activity {
  final String id;
  final String title;
  final String? description;
  final double? distance;
  final int? duration;
  final double? elevation;
  final String date;
  final UserRef user;
  final Sport sport;
  final int commentCount;
  final int likeCount;
  final bool isLiked;

  const Activity({
    required this.id,
    required this.title,
    this.description,
    this.distance,
    this.duration,
    this.elevation,
    required this.date,
    required this.user,
    required this.sport,
    required this.commentCount,
    required this.likeCount,
    required this.isLiked,
  });

  factory Activity.fromJson(Map<String, dynamic> json) => Activity(
        id: json['id'] as String,
        title: json['title'] as String,
        description: json['description'] as String?,
        distance: (json['distance'] as num?)?.toDouble(),
        duration: (json['duration'] as num?)?.toInt(),
        elevation: (json['elevation'] as num?)?.toDouble(),
        date: json['date'] as String,
        user: UserRef.fromJson(json['user'] as Map<String, dynamic>),
        sport: Sport.fromJson(json['sport'] as Map<String, dynamic>),
        commentCount: (json['commentCount'] as num?)?.toInt() ?? 0,
        likeCount: (json['likeCount'] as num?)?.toInt() ?? 0,
        isLiked: json['isLiked'] as bool? ?? false,
      );
}
