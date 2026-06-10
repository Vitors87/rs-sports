class UserRef {
  final String name;
  final String username;
  final String? avatarUrl;

  const UserRef({required this.name, required this.username, this.avatarUrl});

  factory UserRef.fromJson(Map<String, dynamic> json) => UserRef(
        name: json['name'] as String,
        username: json['username'] as String,
        avatarUrl: json['avatarUrl'] as String?,
      );

  String get initials {
    final parts = name.trim().split(RegExp(r'\s+'));
    if (parts.length >= 2) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    }
    return name.isNotEmpty ? name[0].toUpperCase() : '?';
  }
}

class UserStats {
  final int activities;
  final int followers;
  final int following;
  final double totalKm;

  const UserStats({
    required this.activities,
    required this.followers,
    required this.following,
    required this.totalKm,
  });

  factory UserStats.fromJson(Map<String, dynamic> json) => UserStats(
        activities: (json['activities'] as num).toInt(),
        followers: (json['followers'] as num).toInt(),
        following: (json['following'] as num).toInt(),
        totalKm: (json['totalKm'] as num).toDouble(),
      );
}

class UserProfile {
  final String id;
  final String name;
  final String username;
  final String? bio;
  final String? avatarUrl;
  final UserStats stats;
  final bool isFollowing;
  final bool isSelf;

  const UserProfile({
    required this.id,
    required this.name,
    required this.username,
    this.bio,
    this.avatarUrl,
    required this.stats,
    required this.isFollowing,
    required this.isSelf,
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) => UserProfile(
        id: json['id'] as String,
        name: json['name'] as String,
        username: json['username'] as String,
        bio: json['bio'] as String?,
        avatarUrl: json['avatarUrl'] as String?,
        stats: UserStats.fromJson(json['stats'] as Map<String, dynamic>),
        isFollowing: json['isFollowing'] as bool? ?? false,
        isSelf: json['isSelf'] as bool? ?? false,
      );

  String get initials {
    final parts = name.trim().split(RegExp(r'\s+'));
    if (parts.length >= 2) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    }
    return name.isNotEmpty ? name[0].toUpperCase() : '?';
  }
}

class Achievement {
  final String icon;
  final String title;
  final String description;

  const Achievement({required this.icon, required this.title, required this.description});

  factory Achievement.fromJson(Map<String, dynamic> json) => Achievement(
        icon: json['icon'] as String,
        title: json['title'] as String,
        description: json['description'] as String,
      );
}
