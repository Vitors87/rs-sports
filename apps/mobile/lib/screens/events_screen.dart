import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/event.dart';
import '../services/event_service.dart';
import '../theme/app_theme.dart';
import '../widgets/sport_badge.dart';
import '../widgets/empty_state.dart';

class EventsScreen extends StatefulWidget {
  const EventsScreen({super.key});

  @override
  State<EventsScreen> createState() => _EventsScreenState();
}

class _EventsScreenState extends State<EventsScreen> {
  final _service = EventService();
  List<AppEvent> _events = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final events = await _service.fetchEvents();
      if (mounted) setState(() => _events = events);
    } catch (e) {
      if (mounted) setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _toggleParticipation(int index) async {
    final event = _events[index];
    final wasParticipating = event.isParticipating;
    setState(() {
      _events[index] = AppEvent(
        id: event.id,
        title: event.title,
        description: event.description,
        location: event.location,
        date: event.date,
        maxParticipants: event.maxParticipants,
        participants: wasParticipating ? event.participants - 1 : event.participants + 1,
        isParticipating: !wasParticipating,
        sport: event.sport,
      );
    });
    try {
      final participating = await _service.toggleParticipation(event.id);
      if (mounted) {
        setState(() {
          _events[index] = AppEvent(
            id: event.id,
            title: event.title,
            description: event.description,
            location: event.location,
            date: event.date,
            maxParticipants: event.maxParticipants,
            participants: participating
                ? event.participants + 1
                : event.participants - 1,
            isParticipating: participating,
            sport: event.sport,
          );
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _events[index] = event);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: Colors.red),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Eventos'),
        actions: [IconButton(icon: const Icon(Icons.refresh), onPressed: _load)],
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_loading) return const Center(child: CircularProgressIndicator());
    if (_error != null) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.error_outline, size: 48, color: AppTheme.textSecondary),
            const SizedBox(height: 12),
            Text(_error!, style: const TextStyle(color: AppTheme.textSecondary)),
            const SizedBox(height: 16),
            ElevatedButton(onPressed: _load, child: const Text('Reintentar')),
          ],
        ),
      );
    }
    if (_events.isEmpty) {
      return const EmptyState(
        emoji: '📅',
        title: 'Sin eventos próximos',
        subtitle: 'No hay eventos programados por ahora',
      );
    }
    return RefreshIndicator(
      onRefresh: _load,
      child: ListView.builder(
        padding: const EdgeInsets.symmetric(vertical: 8),
        itemCount: _events.length,
        itemBuilder: (_, i) => _EventCard(
          event: _events[i],
          onToggle: () => _toggleParticipation(i),
        ),
      ),
    );
  }
}

class _EventCard extends StatelessWidget {
  final AppEvent event;
  final VoidCallback onToggle;

  const _EventCard({required this.event, required this.onToggle});

  String _formatDate(String iso) {
    try {
      final dt = DateTime.parse(iso).toLocal();
      return DateFormat("d MMM yyyy, HH:mm", 'es').format(dt);
    } catch (_) {
      return iso;
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = AppTheme.sportColor(event.sport.type);
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    event.title,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: AppTheme.textPrimary,
                    ),
                  ),
                ),
                SportBadge(type: event.sport.type, name: event.sport.name, compact: true),
              ],
            ),
            if (event.description.isNotEmpty) ...[
              const SizedBox(height: 6),
              Text(
                event.description,
                style: const TextStyle(fontSize: 14, color: AppTheme.textSecondary),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
            const SizedBox(height: 10),
            _InfoRow(icon: Icons.calendar_today, text: _formatDate(event.date)),
            const SizedBox(height: 4),
            if (event.location.isNotEmpty)
              _InfoRow(icon: Icons.location_on_outlined, text: event.location),
            const SizedBox(height: 4),
            _InfoRow(
              icon: Icons.group_outlined,
              text: event.maxParticipants != null
                  ? '${event.participants} / ${event.maxParticipants} participantes'
                  : '${event.participants} participantes',
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: event.isParticipating
                  ? OutlinedButton(
                      onPressed: onToggle,
                      style: OutlinedButton.styleFrom(
                        foregroundColor: color,
                        side: BorderSide(color: color),
                      ),
                      child: const Text('Cancelar inscripción'),
                    )
                  : ElevatedButton(
                      onPressed: onToggle,
                      style: ElevatedButton.styleFrom(backgroundColor: color),
                      child: const Text('Inscribirse', style: TextStyle(color: Colors.white)),
                    ),
            ),
          ],
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String text;

  const _InfoRow({required this.icon, required this.text});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 15, color: AppTheme.textSecondary),
        const SizedBox(width: 6),
        Expanded(
          child: Text(text, style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary)),
        ),
      ],
    );
  }
}
