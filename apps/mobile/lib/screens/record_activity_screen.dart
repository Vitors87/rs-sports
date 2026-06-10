import 'dart:async';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import '../models/sport.dart';
import '../services/activity_service.dart';
import '../services/location_service.dart';
import '../services/sport_service.dart';
import '../theme/app_theme.dart';

enum _RecordState { idle, recording, paused, summary }

class RecordActivityScreen extends StatefulWidget {
  const RecordActivityScreen({super.key});

  @override
  State<RecordActivityScreen> createState() => _RecordActivityScreenState();
}

class _RecordActivityScreenState extends State<RecordActivityScreen> {
  // Sport
  String _sportType = 'RUNNING';
  List<Sport> _sports = [];

  // Stopwatch
  final _stopwatch = Stopwatch();
  Timer? _uiTimer;

  // GPS
  final _location = LocationService();
  StreamSubscription<Position>? _positionSub;
  final List<Position> _trackPoints = [];
  double _distanceKm = 0.0;
  bool _gpsActive = false;
  String? _gpsWarning;

  // State
  _RecordState _state = _RecordState.idle;

  // Summary inputs
  final _titleCtrl = TextEditingController();
  final _elevationCtrl = TextEditingController();
  bool _saving = false;

  static const _sportTypes = [
    ('RUNNING', 'Running', '🏃'),
    ('CYCLING', 'Ciclismo', '🚴'),
    ('TREKKING', 'Trekking', '⛰️'),
  ];

  @override
  void initState() {
    super.initState();
    _loadSports();
  }

  @override
  void dispose() {
    _stopwatch.stop();
    _uiTimer?.cancel();
    _positionSub?.cancel();
    _titleCtrl.dispose();
    _elevationCtrl.dispose();
    super.dispose();
  }

  Future<void> _loadSports() async {
    try {
      final sports = await SportService().fetchSports();
      if (mounted) setState(() => _sports = sports);
    } catch (_) {}
  }

  Sport? get _currentSport {
    try {
      return _sports.firstWhere((s) => s.type == _sportType);
    } catch (_) {
      return null;
    }
  }

  String _formatElapsed() {
    final e = _stopwatch.elapsed;
    final h = e.inHours.toString().padLeft(2, '0');
    final m = (e.inMinutes % 60).toString().padLeft(2, '0');
    final s = (e.inSeconds % 60).toString().padLeft(2, '0');
    return '$h:$m:$s';
  }

  String _autoTitle() {
    final label = AppTheme.sportLabel(_sportType);
    final now = DateTime.now();
    return '$label ${now.day}/${now.month}/${now.year}';
  }

  Future<void> _startRecording() async {
    setState(() => _gpsWarning = null);

    final status = await _location.requestPermission();
    if (status == LocationPermissionStatus.granted) {
      _gpsActive = true;
      _positionSub = _location.getPositionStream().listen(_onPosition, onError: (_) {
        _gpsActive = false;
        if (mounted) setState(() => _gpsWarning = 'Señal GPS perdida');
      });
    } else {
      _gpsActive = false;
      _gpsWarning = status == LocationPermissionStatus.serviceDisabled
          ? 'GPS desactivado — registrando sin distancia'
          : 'Permiso denegado — registrando sin distancia';
    }

    _stopwatch.start();
    _uiTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (mounted) setState(() {});
    });

    setState(() => _state = _RecordState.recording);
  }

  void _onPosition(Position pos) {
    if (_trackPoints.isNotEmpty) {
      final prev = _trackPoints.last;
      final delta = _location.distanceBetweenKm(
        prev.latitude, prev.longitude, pos.latitude, pos.longitude,
      );
      _distanceKm += delta;
    }
    _trackPoints.add(pos);
    if (mounted) setState(() {});
  }

  void _pause() {
    _stopwatch.stop();
    _uiTimer?.cancel();
    _positionSub?.pause();
    setState(() => _state = _RecordState.paused);
  }

  void _resume() {
    _stopwatch.start();
    _uiTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (mounted) setState(() {});
    });
    _positionSub?.resume();
    setState(() => _state = _RecordState.recording);
  }

  void _finish() {
    _stopwatch.stop();
    _uiTimer?.cancel();
    _positionSub?.cancel();
    _titleCtrl.text = _autoTitle();
    setState(() => _state = _RecordState.summary);
  }

  void _discard() {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Descartar actividad'),
        content: const Text('¿Seguro que quieres descartar esta actividad?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancelar')),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _reset();
            },
            child: const Text('Descartar', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  void _reset() {
    _stopwatch.reset();
    _uiTimer?.cancel();
    _positionSub?.cancel();
    _trackPoints.clear();
    _distanceKm = 0.0;
    _gpsActive = false;
    _gpsWarning = null;
    _titleCtrl.clear();
    _elevationCtrl.clear();
    setState(() => _state = _RecordState.idle);
  }

  Future<void> _save() async {
    final sport = _currentSport;
    if (sport == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Error al cargar el deporte, reintenta')),
      );
      return;
    }
    final title = _titleCtrl.text.trim();
    if (title.isEmpty) return;

    setState(() => _saving = true);
    try {
      await ActivityService().createActivity(
        sportId: sport.id,
        title: title,
        distance: _distanceKm > 0.001 ? double.parse(_distanceKm.toStringAsFixed(2)) : null,
        duration: _stopwatch.elapsed.inMinutes > 0 ? _stopwatch.elapsed.inMinutes : null,
        elevation: double.tryParse(_elevationCtrl.text),
        date: DateTime.now().toIso8601String(),
      );
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('¡Actividad guardada! Aparecerá en el Feed.'),
            backgroundColor: AppTheme.primary,
            duration: Duration(seconds: 3),
          ),
        );
        _reset();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    switch (_state) {
      case _RecordState.idle:
        return _IdleView(
          sportType: _sportType,
          onSportChanged: (t) => setState(() => _sportType = t),
          onStart: _startRecording,
          sportTypes: _sportTypes,
        );
      case _RecordState.recording:
      case _RecordState.paused:
        return _ActiveView(
          elapsed: _formatElapsed(),
          distanceKm: _distanceKm,
          sportType: _sportType,
          trackPoints: _trackPoints.length,
          gpsActive: _gpsActive,
          gpsWarning: _gpsWarning,
          isPaused: _state == _RecordState.paused,
          onPause: _pause,
          onResume: _resume,
          onFinish: _finish,
        );
      case _RecordState.summary:
        return _SummaryView(
          elapsed: _formatElapsed(),
          distanceKm: _distanceKm,
          sportType: _sportType,
          sportEmoji: _sportTypes
              .firstWhere((s) => s.$1 == _sportType, orElse: () => _sportTypes[0])
              .$3,
          titleCtrl: _titleCtrl,
          elevationCtrl: _elevationCtrl,
          saving: _saving,
          onSave: _save,
          onDiscard: _discard,
        );
    }
  }
}

// ─── Idle ───────────────────────────────────────────────────────────────────

class _IdleView extends StatelessWidget {
  final String sportType;
  final ValueChanged<String> onSportChanged;
  final VoidCallback onStart;
  final List<(String, String, String)> sportTypes;

  const _IdleView({
    required this.sportType,
    required this.onSportChanged,
    required this.onStart,
    required this.sportTypes,
  });

  @override
  Widget build(BuildContext context) {
    final color = AppTheme.sportColor(sportType);
    final entry = sportTypes.firstWhere((s) => s.$1 == sportType, orElse: () => sportTypes[0]);

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(title: const Text('Registrar Actividad')),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              // Sport selector
              Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: AppTheme.surface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.divider),
                ),
                child: Row(
                  children: sportTypes.map((s) {
                    final selected = s.$1 == sportType;
                    final c = AppTheme.sportColor(s.$1);
                    return Expanded(
                      child: GestureDetector(
                        onTap: () => onSportChanged(s.$1),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          decoration: BoxDecoration(
                            color: selected ? c : Colors.transparent,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Column(
                            children: [
                              Text(s.$3, style: const TextStyle(fontSize: 20)),
                              const SizedBox(height: 2),
                              Text(
                                s.$2,
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600,
                                  color: selected ? Colors.white : AppTheme.textSecondary,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),
              const Spacer(),
              // Hero display
              Column(
                children: [
                  Container(
                    width: 120,
                    height: 120,
                    decoration: BoxDecoration(
                      color: color.withValues(alpha: 0.12),
                      shape: BoxShape.circle,
                      border: Border.all(color: color.withValues(alpha: 0.3), width: 2),
                    ),
                    child: Center(
                      child: Text(entry.$3, style: const TextStyle(fontSize: 52)),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    entry.$2,
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w700,
                      color: color,
                    ),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'Listo para empezar',
                    style: TextStyle(fontSize: 14, color: AppTheme.textSecondary),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              // GPS indicator
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: AppTheme.surface,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppTheme.divider),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.gps_fixed, size: 16, color: AppTheme.primary),
                    SizedBox(width: 6),
                    Text(
                      'Seguimiento GPS activo',
                      style: TextStyle(fontSize: 13, color: AppTheme.textSecondary),
                    ),
                  ],
                ),
              ),
              const Spacer(),
              // Start button
              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: onStart,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: color,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.play_arrow_rounded, size: 28, color: Colors.white),
                      SizedBox(width: 8),
                      Text(
                        'INICIAR',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 1.5,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ─── Active (Recording / Paused) ───────────────────────────────────────────

class _ActiveView extends StatelessWidget {
  final String elapsed;
  final double distanceKm;
  final String sportType;
  final int trackPoints;
  final bool gpsActive;
  final String? gpsWarning;
  final bool isPaused;
  final VoidCallback onPause;
  final VoidCallback onResume;
  final VoidCallback onFinish;

  const _ActiveView({
    required this.elapsed,
    required this.distanceKm,
    required this.sportType,
    required this.trackPoints,
    required this.gpsActive,
    this.gpsWarning,
    required this.isPaused,
    required this.onPause,
    required this.onResume,
    required this.onFinish,
  });

  @override
  Widget build(BuildContext context) {
    final color = AppTheme.sportColor(sportType);
    final label = AppTheme.sportLabel(sportType);
    final emoji = AppTheme.sportEmoji(sportType);

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              // Header
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: color.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      '$emoji $label',
                      style: TextStyle(color: color, fontWeight: FontWeight.w600, fontSize: 14),
                    ),
                  ),
                  const Spacer(),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: isPaused
                          ? Colors.orange.withValues(alpha: 0.12)
                          : Colors.green.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 8,
                          height: 8,
                          decoration: BoxDecoration(
                            color: isPaused ? Colors.orange : Colors.green,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          isPaused ? 'EN PAUSA' : 'GRABANDO',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            color: isPaused ? Colors.orange : Colors.green,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const Spacer(),
              // Big timer
              Text(
                elapsed,
                style: const TextStyle(
                  fontSize: 64,
                  fontWeight: FontWeight.w200,
                  letterSpacing: -2,
                  color: AppTheme.textPrimary,
                  fontFeatures: [FontFeature.tabularFigures()],
                ),
              ),
              const SizedBox(height: 6),
              const Text('Duración', style: TextStyle(fontSize: 13, color: AppTheme.textSecondary)),
              const SizedBox(height: 32),
              // Distance
              Text(
                '${distanceKm.toStringAsFixed(2)} km',
                style: TextStyle(
                  fontSize: 36,
                  fontWeight: FontWeight.w600,
                  color: color,
                ),
              ),
              const SizedBox(height: 4),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    gpsActive ? Icons.gps_fixed : Icons.gps_off,
                    size: 14,
                    color: gpsActive ? Colors.green : Colors.orange,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    gpsActive ? '$trackPoints puntos GPS' : (gpsWarning ?? 'Sin GPS'),
                    style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                  ),
                ],
              ),
              const Spacer(),
              // Controls
              Row(
                children: [
                  Expanded(
                    child: SizedBox(
                      height: 56,
                      child: OutlinedButton(
                        onPressed: isPaused ? onResume : onPause,
                        style: OutlinedButton.styleFrom(
                          foregroundColor: color,
                          side: BorderSide(color: color),
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16)),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              isPaused ? Icons.play_arrow_rounded : Icons.pause_rounded,
                              size: 22,
                            ),
                            const SizedBox(width: 6),
                            Text(
                              isPaused ? 'CONTINUAR' : 'PAUSAR',
                              style: const TextStyle(
                                  fontWeight: FontWeight.w700, letterSpacing: 0.5),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: SizedBox(
                      height: 56,
                      child: ElevatedButton(
                        onPressed: onFinish,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: color,
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16)),
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.stop_rounded, size: 22, color: Colors.white),
                            SizedBox(width: 6),
                            Text(
                              'FINALIZAR',
                              style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w700,
                                letterSpacing: 0.5,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ─── Summary ────────────────────────────────────────────────────────────────

class _SummaryView extends StatelessWidget {
  final String elapsed;
  final double distanceKm;
  final String sportType;
  final String sportEmoji;
  final TextEditingController titleCtrl;
  final TextEditingController elevationCtrl;
  final bool saving;
  final VoidCallback onSave;
  final VoidCallback onDiscard;

  const _SummaryView({
    required this.elapsed,
    required this.distanceKm,
    required this.sportType,
    required this.sportEmoji,
    required this.titleCtrl,
    required this.elevationCtrl,
    required this.saving,
    required this.onSave,
    required this.onDiscard,
  });

  @override
  Widget build(BuildContext context) {
    final color = AppTheme.sportColor(sportType);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Resumen'),
        automaticallyImplyLeading: false,
      ),
      body: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          // Completion header
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [color.withValues(alpha: 0.15), color.withValues(alpha: 0.05)],
              ),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: color.withValues(alpha: 0.3)),
            ),
            child: Column(
              children: [
                Text(sportEmoji, style: const TextStyle(fontSize: 48)),
                const SizedBox(height: 8),
                Text(
                  '¡Actividad completada!',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                    color: color,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  AppTheme.sportLabel(sportType),
                  style: const TextStyle(fontSize: 14, color: AppTheme.textSecondary),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          // Stats
          Row(
            children: [
              Expanded(
                child: _SummaryStatCard(
                  icon: Icons.timer_outlined,
                  value: elapsed,
                  label: 'Duración',
                  color: color,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _SummaryStatCard(
                  icon: Icons.straighten,
                  value: '${distanceKm.toStringAsFixed(2)} km',
                  label: 'Distancia',
                  color: color,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          // Elevation input
          const Text(
            'Desnivel acumulado (m)',
            style: TextStyle(
                fontSize: 13, fontWeight: FontWeight.w600, color: AppTheme.textSecondary),
          ),
          const SizedBox(height: 6),
          TextField(
            controller: elevationCtrl,
            decoration: const InputDecoration(
              hintText: '0',
              suffixText: 'm',
              border: OutlineInputBorder(),
            ),
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
          ),
          const SizedBox(height: 16),
          // Title input
          const Text(
            'Título de la actividad',
            style: TextStyle(
                fontSize: 13, fontWeight: FontWeight.w600, color: AppTheme.textSecondary),
          ),
          const SizedBox(height: 6),
          TextField(
            controller: titleCtrl,
            decoration: const InputDecoration(border: OutlineInputBorder()),
            maxLength: 80,
          ),
          const SizedBox(height: 8),
          // Save button
          SizedBox(
            width: double.infinity,
            height: 52,
            child: ElevatedButton(
              onPressed: saving ? null : onSave,
              style: ElevatedButton.styleFrom(
                backgroundColor: color,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
              child: saving
                  ? const SizedBox(
                      width: 22,
                      height: 22,
                      child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                    )
                  : const Text(
                      'GUARDAR ACTIVIDAD',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 0.8,
                        fontSize: 15,
                      ),
                    ),
            ),
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: TextButton(
              onPressed: onDiscard,
              child: const Text('Descartar', style: TextStyle(color: AppTheme.textSecondary)),
            ),
          ),
        ],
      ),
    );
  }
}

class _SummaryStatCard extends StatelessWidget {
  final IconData icon;
  final String value;
  final String label;
  final Color color;

  const _SummaryStatCard({
    required this.icon,
    required this.value,
    required this.label,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppTheme.divider),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 8),
          Text(
            value,
            style: const TextStyle(
                fontSize: 20, fontWeight: FontWeight.w700, color: AppTheme.textPrimary),
          ),
          Text(label,
              style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary)),
        ],
      ),
    );
  }
}
