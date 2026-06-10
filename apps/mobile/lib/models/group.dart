import 'sport.dart';

class Group {
  final String id;
  final String name;
  final String description;
  final int members;
  final String recentActivity;
  final bool isMember;
  final Sport? sport;

  const Group({
    required this.id,
    required this.name,
    required this.description,
    required this.members,
    required this.recentActivity,
    required this.isMember,
    this.sport,
  });

  factory Group.fromJson(Map<String, dynamic> json) => Group(
        id: json['id'] as String,
        name: json['name'] as String,
        description: json['description'] as String? ?? '',
        members: (json['members'] as num?)?.toInt() ?? 0,
        recentActivity: json['recentActivity'] as String? ?? '',
        isMember: json['isMember'] as bool? ?? false,
        sport: json['sport'] != null
            ? Sport.fromJson(json['sport'] as Map<String, dynamic>)
            : null,
      );
}
