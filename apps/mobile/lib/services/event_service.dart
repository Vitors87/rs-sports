import '../models/event.dart';
import 'api_service.dart';

class EventService {
  final _api = ApiService();

  Future<List<AppEvent>> fetchEvents() async {
    final data = await _api.get('/api/events');
    final list = data['events'] as List<dynamic>;
    return list.map((e) => AppEvent.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<bool> toggleParticipation(String eventId) async {
    final data = await _api.post('/api/events/$eventId/participate');
    return data['participating'] as bool;
  }
}
