import 'package:geolocator/geolocator.dart';

class LocationPoint {
  final double latitude;
  final double longitude;
  final DateTime timestamp;

  const LocationPoint({
    required this.latitude,
    required this.longitude,
    required this.timestamp,
  });
}

class LocationService {
  static final LocationService _instance = LocationService._internal();
  factory LocationService() => _instance;
  LocationService._internal();

  static const _trackSettings = LocationSettings(
    accuracy: LocationAccuracy.high,
    distanceFilter: 5,
  );

  Future<LocationPermissionStatus> checkPermissionStatus() async {
    final serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) return LocationPermissionStatus.serviceDisabled;

    final permission = await Geolocator.checkPermission();
    return _mapPermission(permission);
  }

  Future<LocationPermissionStatus> requestPermission() async {
    final serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) return LocationPermissionStatus.serviceDisabled;

    var permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
    }
    return _mapPermission(permission);
  }

  Future<Position?> getCurrentPosition() async {
    try {
      return await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(accuracy: LocationAccuracy.high),
      );
    } catch (_) {
      return null;
    }
  }

  Stream<Position> getPositionStream() =>
      Geolocator.getPositionStream(locationSettings: _trackSettings);

  double distanceBetweenKm(
    double lat1,
    double lon1,
    double lat2,
    double lon2,
  ) =>
      Geolocator.distanceBetween(lat1, lon1, lat2, lon2) / 1000.0;

  LocationPermissionStatus _mapPermission(LocationPermission p) {
    switch (p) {
      case LocationPermission.always:
      case LocationPermission.whileInUse:
        return LocationPermissionStatus.granted;
      case LocationPermission.deniedForever:
        return LocationPermissionStatus.deniedForever;
      default:
        return LocationPermissionStatus.denied;
    }
  }
}

enum LocationPermissionStatus { granted, denied, deniedForever, serviceDisabled }
