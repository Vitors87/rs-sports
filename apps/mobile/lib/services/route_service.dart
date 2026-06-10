import '../models/route.dart';
import 'api_service.dart';

class RouteService {
  final _api = ApiService();

  Future<List<AppRoute>> fetchRoutes({String? sport, String? difficulty}) async {
    final query = <String, String>{};
    if (sport != null) query['sport'] = sport;
    if (difficulty != null) query['difficulty'] = difficulty;
    final data = await _api.get('/api/routes', query: query.isNotEmpty ? query : null);
    final list = data['routes'] as List<dynamic>;
    return list.map((e) => AppRoute.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<AppRoute> fetchRouteById(String id) async {
    final data = await _api.get('/api/routes/$id');
    return AppRoute.fromJson(data['route'] as Map<String, dynamic>);
  }
}
