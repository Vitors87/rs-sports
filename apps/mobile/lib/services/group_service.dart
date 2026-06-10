import '../models/group.dart';
import 'api_service.dart';

class GroupService {
  final _api = ApiService();

  Future<List<Group>> fetchGroups() async {
    final data = await _api.get('/api/groups');
    final list = data['groups'] as List<dynamic>;
    return list.map((e) => Group.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<bool> toggleJoin(String groupId) async {
    final data = await _api.post('/api/groups/$groupId/join');
    return data['member'] as bool;
  }
}
