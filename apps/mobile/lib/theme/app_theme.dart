import 'package:flutter/material.dart';

class AppTheme {
  static const Color primary = Color(0xFF2A9D8F);
  static const Color primaryDark = Color(0xFF1A7A6D);
  static const Color runningColor = Color(0xFFE76F51);
  static const Color cyclingColor = Color(0xFFF4A261);
  static const Color trekkingColor = Color(0xFF264653);
  static const Color background = Color(0xFFF4F6F9);
  static const Color surface = Colors.white;
  static const Color textPrimary = Color(0xFF1A1A2E);
  static const Color textSecondary = Color(0xFF6B7280);
  static const Color divider = Color(0xFFE5E7EB);

  static ThemeData get theme => ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: primary,
          brightness: Brightness.light,
        ),
        useMaterial3: true,
        scaffoldBackgroundColor: background,
        cardTheme: CardThemeData(
          color: surface,
          elevation: 0,
          margin: EdgeInsets.zero,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: const BorderSide(color: Color(0xFFE5E7EB)),
          ),
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: surface,
          elevation: 0,
          scrolledUnderElevation: 1,
          foregroundColor: textPrimary,
          titleTextStyle: TextStyle(
            color: textPrimary,
            fontSize: 18,
            fontWeight: FontWeight.w700,
          ),
        ),
        bottomNavigationBarTheme: const BottomNavigationBarThemeData(
          backgroundColor: surface,
          selectedItemColor: primary,
          unselectedItemColor: Color(0xFF9CA3AF),
          showSelectedLabels: true,
          showUnselectedLabels: true,
          type: BottomNavigationBarType.fixed,
          elevation: 8,
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: surface,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Color(0xFFD1D5DB)),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Color(0xFFD1D5DB)),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: primary, width: 2),
          ),
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: primary,
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            textStyle: const TextStyle(fontWeight: FontWeight.w600),
          ),
        ),
        outlinedButtonTheme: OutlinedButtonThemeData(
          style: OutlinedButton.styleFrom(
            foregroundColor: primary,
            side: const BorderSide(color: primary),
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        ),
        chipTheme: ChipThemeData(
          backgroundColor: background,
          selectedColor: primary.withValues(alpha: 0.15),
          labelStyle: const TextStyle(fontSize: 13),
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          side: const BorderSide(color: Color(0xFFD1D5DB)),
        ),
      );

  static Color sportColor(String type) {
    switch (type.toUpperCase()) {
      case 'RUNNING':
        return runningColor;
      case 'CYCLING':
        return cyclingColor;
      case 'TREKKING':
        return trekkingColor;
      default:
        return primary;
    }
  }

  static String sportEmoji(String type) {
    switch (type.toUpperCase()) {
      case 'RUNNING':
        return '🏃';
      case 'CYCLING':
        return '🚴';
      case 'TREKKING':
        return '⛰️';
      default:
        return '🏅';
    }
  }

  static String sportLabel(String type) {
    switch (type.toUpperCase()) {
      case 'RUNNING':
        return 'Running';
      case 'CYCLING':
        return 'Ciclismo';
      case 'TREKKING':
        return 'Trekking';
      default:
        return type;
    }
  }

  static String difficultyLabel(String difficulty) {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'Fácil';
      case 'moderate':
        return 'Media';
      case 'hard':
        return 'Difícil';
      default:
        return difficulty;
    }
  }

  static Color difficultyColor(String difficulty) {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return const Color(0xFF4CAF50);
      case 'moderate':
        return cyclingColor;
      case 'hard':
        return runningColor;
      default:
        return textSecondary;
    }
  }
}
