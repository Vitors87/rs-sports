class ApiConfig {
  // Production API deployed on Vercel
  static const String productionBaseUrl = 'https://rs-sports-api.vercel.app';

  // Local API when running with Android emulator.
  // 10.0.2.2 maps to the host machine's localhost from inside the emulator.
  // Requires the API running on port 3001: cd apps/api && npm run dev
  static const String emulatorBaseUrl = 'http://10.0.2.2:3001';

  // Switch to false to point at local API during development
  static const bool useProduction = true;

  static String get baseUrl => useProduction ? productionBaseUrl : emulatorBaseUrl;
}
