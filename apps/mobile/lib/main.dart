import 'package:flutter/material.dart';

void main() {
  runApp(const RsSportsApp());
}

class RsSportsApp extends StatelessWidget {
  const RsSportsApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'rs-sports',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF2a9d8f)),
        useMaterial3: true,
      ),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  static const _disciplines = [
    {
      'name': 'Running',
      'description': 'Registra tus carreras y conecta con la comunidad',
      'color': 0xFFe63946,
    },
    {
      'name': 'Ciclismo',
      'description': 'Comparte rutas y aventuras en bicicleta',
      'color': 0xFF2a9d8f,
    },
    {
      'name': 'Trekking',
      'description': 'Explora senderos y montanas con otros excursionistas',
      'color': 0xFF457b9d,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('rs-sports', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Tu red social deportiva outdoor',
              style: TextStyle(fontSize: 16, color: Colors.grey),
            ),
            const SizedBox(height: 24),
            ..._disciplines.map(
              (d) => Card(
                margin: const EdgeInsets.only(bottom: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                  side: BorderSide(color: Color(d['color'] as int), width: 2),
                ),
                child: ListTile(
                  contentPadding: const EdgeInsets.all(16),
                  title: Text(
                    d['name'] as String,
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: Color(d['color'] as int),
                    ),
                  ),
                  subtitle: Padding(
                    padding: const EdgeInsets.only(top: 4),
                    child: Text(d['description'] as String),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
