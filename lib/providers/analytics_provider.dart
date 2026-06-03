import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AnalyticsProvider with ChangeNotifier {
  static const String _copyCountPrefix = 'copy_count_';
  static const String _viewCountPrefix = 'view_count_';
  static const String _shareCountPrefix = 'share_count_';
  static const String _totalCopiesKey = 'total_copies';
  static const String _totalViewsKey = 'total_views';
  static const String _totalSharesKey = 'total_shares';

  int _totalCopies = 0;
  int _totalViews = 0;
  int _totalShares = 0;
  final Map<String, int> _copyCounts = {};
  final Map<String, int> _viewCounts = {};
  final Map<String, int> _shareCounts = {};

  int get totalCopies => _totalCopies;
  int get totalViews => _totalViews;
  int get totalShares => _totalShares;

  AnalyticsProvider() {
    _loadTotals();
  }

  int getCopyCount(String promptId) => _copyCounts[promptId] ?? 0;
  int getViewCount(String promptId) => _viewCounts[promptId] ?? 0;
  int getShareCount(String promptId) => _shareCounts[promptId] ?? 0;

  Future<void> incrementCopy(String promptId) async {
    _copyCounts[promptId] = (_copyCounts[promptId] ?? 0) + 1;
    _totalCopies++;
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    prefs.setInt('$_copyCountPrefix$promptId', _copyCounts[promptId]!);
    prefs.setInt(_totalCopiesKey, _totalCopies);
  }

  Future<void> incrementView(String promptId) async {
    _viewCounts[promptId] = (_viewCounts[promptId] ?? 0) + 1;
    _totalViews++;
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    prefs.setInt('$_viewCountPrefix$promptId', _viewCounts[promptId]!);
    prefs.setInt(_totalViewsKey, _totalViews);
  }

  Future<void> incrementShare(String promptId) async {
    _shareCounts[promptId] = (_shareCounts[promptId] ?? 0) + 1;
    _totalShares++;
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    prefs.setInt('$_shareCountPrefix$promptId', _shareCounts[promptId]!);
    prefs.setInt(_totalSharesKey, _totalShares);
  }

  Future<void> _loadTotals() async {
    final prefs = await SharedPreferences.getInstance();
    _totalCopies = prefs.getInt(_totalCopiesKey) ?? 0;
    _totalViews = prefs.getInt(_totalViewsKey) ?? 0;
    _totalShares = prefs.getInt(_totalSharesKey) ?? 0;
    notifyListeners();
  }

  Future<void> loadCountsForPrompt(String promptId) async {
    final prefs = await SharedPreferences.getInstance();
    _copyCounts[promptId] = prefs.getInt('$_copyCountPrefix$promptId') ?? 0;
    _viewCounts[promptId] = prefs.getInt('$_viewCountPrefix$promptId') ?? 0;
    _shareCounts[promptId] = prefs.getInt('$_shareCountPrefix$promptId') ?? 0;
    notifyListeners();
  }
}
