class CommentUser {
  final String name;
  final String username;

  const CommentUser({required this.name, required this.username});

  factory CommentUser.fromJson(Map<String, dynamic> json) => CommentUser(
        name: json['name'] as String,
        username: json['username'] as String,
      );

  String get initials {
    final parts = name.trim().split(RegExp(r'\s+'));
    if (parts.length >= 2) return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    return name.isNotEmpty ? name[0].toUpperCase() : '?';
  }
}

class Comment {
  final String id;
  final String content;
  final String createdAt;
  final CommentUser user;

  const Comment({
    required this.id,
    required this.content,
    required this.createdAt,
    required this.user,
  });

  factory Comment.fromJson(Map<String, dynamic> json) => Comment(
        id: json['id'] as String,
        content: json['content'] as String,
        createdAt: json['createdAt'] as String,
        user: CommentUser.fromJson(json['user'] as Map<String, dynamic>),
      );
}
