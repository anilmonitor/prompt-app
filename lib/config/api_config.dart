class ApiConfig {
  // Production URL hosted on Vercel
  static const String _productionBaseUrl = 'https://prompt-app-mu.vercel.app/api';

  // Base URL configuration (uses live Vercel API with local fallback if needed)
  static String get baseUrl {
    return _productionBaseUrl;
  }

  // Endpoints
  static String get promptsEndpoint => '$baseUrl/prompts';
}
