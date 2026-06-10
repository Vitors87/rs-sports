import 'package:flutter/material.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'screens/feed_screen.dart';
import 'screens/record_activity_screen.dart';
import 'screens/routes_screen.dart';
import 'screens/events_screen.dart';
import 'screens/profile_screen.dart';
import 'theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await initializeDateFormatting('es', null);
  runApp(const RsSportsApp());
}

class RsSportsApp extends StatelessWidget {
  const RsSportsApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'rs-sports',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.theme,
      home: const MainShell(),
    );
  }
}

class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _currentIndex = 0;

  static const _screens = [
    FeedScreen(),
    RecordActivityScreen(),
    RoutesScreen(),
    EventsScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (i) => setState(() => _currentIndex = i),
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            activeIcon: Icon(Icons.home),
            label: 'Feed',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.radio_button_unchecked),
            activeIcon: Icon(Icons.radio_button_checked),
            label: 'Registrar',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.map_outlined),
            activeIcon: Icon(Icons.map),
            label: 'Rutas',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.event_outlined),
            activeIcon: Icon(Icons.event),
            label: 'Eventos',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            activeIcon: Icon(Icons.person),
            label: 'Perfil',
          ),
        ],
      ),
    );
  }
}
