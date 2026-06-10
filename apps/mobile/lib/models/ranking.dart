class RankingEntry {
  final int position;
  final String name;
  final String username;
  final double score;
  final String unit;
  final int activities;

  const RankingEntry({
    required this.position,
    required this.name,
    required this.username,
    required this.score,
    required this.unit,
    required this.activities,
  });

  factory RankingEntry.fromJson(Map<String, dynamic> json) => RankingEntry(
        position: (json['position'] as num).toInt(),
        name: json['name'] as String,
        username: json['username'] as String,
        score: (json['score'] as num).toDouble(),
        unit: json['unit'] as String,
        activities: (json['activities'] as num).toInt(),
      );
}
