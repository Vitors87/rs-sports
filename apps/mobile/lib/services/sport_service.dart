import '../models/sport.dart';
import 'api_service.dart';

class SportService {
  final _api = ApiService();

  Future<List<Sport>> fetchSports() async {
    final data = await _api.get('/api/sports');
    final list = data['sports'] as List<dynamic>;
    return list.map((e) => Sport.fromJson(e as Map<String, dynamic>)).toList();
  }
}
