import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../models/prompt_item.dart';
import '../config/api_config.dart';
import '../data/sample_data.dart';

class PromptService {
  static final PromptService _instance = PromptService._internal();
  factory PromptService() => _instance;
  PromptService._internal();

  // In-memory cache for ultra-fast instant UI rendering
  List<PromptItem> _cachedPrompts = [];
  List<PromptItem> get cachedPrompts => _cachedPrompts;

  /// Fetch all prompts from MongoDB via Next.js REST API
  Future<List<PromptItem>> getPrompts({
    String? category,
    String? query,
    bool forceRefresh = false,
  }) async {
    try {
      final uri = Uri.parse(ApiConfig.promptsEndpoint).replace(
        queryParameters: {
          if (category != null && category != 'All') 'category': category,
          if (query != null && query.isNotEmpty) 'q': query,
        },
      );

      final response = await http
          .get(uri, headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          })
          .timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final List<dynamic> jsonList = jsonDecode(response.body);
        final prompts = jsonList
            .map((item) => PromptItem.fromJson(item as Map<String, dynamic>))
            .toList();

        if (category == null || category == 'All') {
          _cachedPrompts = prompts;
        }
        return prompts;
      } else {
        debugPrint('Failed to load prompts from API: ${response.statusCode}');
        return _fallbackPrompts(category, query);
      }
    } catch (e) {
      debugPrint('Error fetching prompts from API: $e');
      return _fallbackPrompts(category, query);
    }
  }

  /// Fallback to local cache or sample data when offline or during dev
  List<PromptItem> _fallbackPrompts(String? category, String? query) {
    List<PromptItem> source = _cachedPrompts.isNotEmpty
        ? _cachedPrompts
        : samplePrompts;

    if (category != null && category != 'All') {
      source = source.where((p) => p.category == category).toList();
    }

    if (query != null && query.isNotEmpty) {
      final q = query.toLowerCase();
      source = source.where((p) {
        return p.title.toLowerCase().contains(q) ||
            p.category.toLowerCase().contains(q) ||
            p.promptText.toLowerCase().contains(q);
      }).toList();
    }

    return source;
  }
}
