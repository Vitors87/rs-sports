import '../models/ranking.dart';
import 'api_service.dart';

class RankingService {
  final _api = ApiService();

  Future<Map<String, List<RankingEntry>>> fetchRankings() async {
    final data = await _api.get('/api/rankings');
    final raw = data['rankings'] as Map<String, dynamic>;
    return raw.map((key, value) {
      final list = (value as List<dynamic>)
          .map((e) => RankingEntry.fromJson(e as Map<String, dynamic>))
          .toList();
      return MapEntry(key, list);
    });
  }
}
