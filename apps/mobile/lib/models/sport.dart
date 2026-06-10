class Sport {
  final String id;
  final String name;
  final String type;

  const Sport({required this.id, required this.name, required this.type});

  factory Sport.fromJson(Map<String, dynamic> json) => Sport(
        id: json['id'] as String,
        name: json['name'] as String,
        type: json['type'] as String,
      );

  Map<String, dynamic> toJson() => {'id': id, 'name': name, 'type': type};
}
