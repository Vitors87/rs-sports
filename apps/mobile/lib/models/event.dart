import 'sport.dart';

class AppEvent {
  final String id;
  final String title;
  final String description;
  final String location;
  final String date;
  final int? maxParticipants;
  final int participants;
  final bool isParticipating;
  final Sport sport;

  const AppEvent({
    required this.id,
    required this.title,
    required this.description,
    required this.location,
    required this.date,
    this.maxParticipants,
    required this.participants,
    required this.isParticipating,
    required this.sport,
  });

  factory AppEvent.fromJson(Map<String, dynamic> json) => AppEvent(
        id: json['id'] as String,
        title: json['title'] as String,
        description: json['description'] as String? ?? '',
        location: json['location'] as String? ?? '',
        date: json['date'] as String,
        maxParticipants: (json['maxParticipants'] as num?)?.toInt(),
        participants: (json['participants'] as num?)?.toInt() ?? 0,
        isParticipating: json['isParticipating'] as bool? ?? false,
        sport: Sport.fromJson(json['sport'] as Map<String, dynamic>),
      );
}
