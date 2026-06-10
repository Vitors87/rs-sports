import 'sport.dart';

class AppRoute {
  final String id;
  final String title;
  final double? distanceKm;
  final double? elevationGain;
  final int? durationMin;
  final String difficulty;
  final String? region;
  final String? city;
  final String? imageUrl;
  final Sport sport;

  const AppRoute({
    required this.id,
    required this.title,
    this.distanceKm,
    this.elevationGain,
    this.durationMin,
    required this.difficulty,
    this.region,
    this.city,
    this.imageUrl,
    required this.sport,
  });

  factory AppRoute.fromJson(Map<String, dynamic> json) => AppRoute(
        id: json['id'] as String,
        title: json['title'] as String,
        distanceKm: (json['distanceKm'] as num?)?.toDouble(),
        elevationGain: (json['elevationGain'] as num?)?.toDouble(),
        durationMin: (json['durationMin'] as num?)?.toInt(),
        difficulty: json['difficulty'] as String? ?? 'moderate',
        region: json['region'] as String?,
        city: json['city'] as String?,
        imageUrl: json['imageUrl'] as String?,
        sport: Sport.fromJson(json['sport'] as Map<String, dynamic>),
      );
}
