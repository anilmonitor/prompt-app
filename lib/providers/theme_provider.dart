import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ThemeProvider with ChangeNotifier {
  static const String _themePrefKey = 'theme_preference';
  bool _isDarkMode = false; // Default to light mode

  bool get isDarkMode => _isDarkMode;

  ThemeProvider() {
    _loadFromPrefs();
  }

  ThemeMode get themeMode => _isDarkMode ? ThemeMode.dark : ThemeMode.light;

  void toggleTheme() {
    _isDarkMode = !_isDarkMode;
    _saveToPrefs();
    notifyListeners();
  }

  Future<void> _loadFromPrefs() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    // If not set, it defaults to false (light mode)
    _isDarkMode = prefs.getBool(_themePrefKey) ?? false;
    notifyListeners();
  }

  Future<void> _saveToPrefs() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.setBool(_themePrefKey, _isDarkMode);
  }
}
