import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class SportBadge extends StatelessWidget {
  final String type;
  final String name;
  final bool compact;

  const SportBadge({
    super.key,
    required this.type,
    required this.name,
    this.compact = false,
  });

  @override
  Widget build(BuildContext context) {
    final color = AppTheme.sportColor(type);
    final emoji = AppTheme.sportEmoji(type);
    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: compact ? 8 : 10,
        vertical: compact ? 3 : 5,
      ),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withValues(alpha: 0.4)),
      ),
      child: Text(
        compact ? emoji : '$emoji $name',
        style: TextStyle(
          color: color,
          fontSize: compact ? 12 : 13,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}
