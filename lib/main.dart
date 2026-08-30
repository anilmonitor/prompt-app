import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'screens/main_layout.dart';
import 'providers/theme_provider.dart';
import 'providers/favorites_provider.dart';
import 'providers/analytics_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
        ChangeNotifierProvider(create: (_) => FavoritesProvider()),
        ChangeNotifierProvider(create: (_) => AnalyticsProvider()),
      ],
      child: const TrendyBabaApp(),
    ),
  );
}

class TrendyBabaApp extends StatelessWidget {
  const TrendyBabaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<ThemeProvider>(
      builder: (context, themeProvider, child) {
        return MaterialApp(
          title: 'Trendy Baba',
          debugShowCheckedModeBanner: false,
          themeMode: themeProvider.themeMode,
          themeAnimationDuration: Duration.zero,
          // Light Theme
          theme: ThemeData(
            useMaterial3: true,
            brightness: Brightness.light,
            colorScheme: ColorScheme.light(
              surface: const Color(0xFFF5F5F7),
              primary: const Color(0xFF6C63FF), // Vibrant purple
              secondary: const Color(0xFFFF6B6B), // Coral accent
              tertiary: const Color(0xFF38EF7D), // Green accent
              onSurface: Colors.black87,
              surfaceContainerHighest: Colors.white,
            ),
            textTheme: GoogleFonts.interTextTheme(ThemeData.light().textTheme),
            appBarTheme: const AppBarTheme(
              backgroundColor: Colors.transparent,
              elevation: 0,
              iconTheme: IconThemeData(color: Colors.black87),
              titleTextStyle: TextStyle(
                  color: Colors.black87,
                  fontSize: 20,
                  fontWeight: FontWeight.bold),
            ),
            pageTransitionsTheme: PageTransitionsTheme(
              builders: {
                TargetPlatform.android: ZoomPageTransitionsBuilder(),
                TargetPlatform.iOS: ZoomPageTransitionsBuilder(),
              },
            ),
          ),
          // Dark Theme
          darkTheme: ThemeData(
            useMaterial3: true,
            brightness: Brightness.dark,
            colorScheme: ColorScheme.dark(
              surface: const Color(0xFF0A0A0F),
              primary: const Color(0xFF7C73FF), // Soft neon purple
              secondary: const Color(0xFFFF6B6B), // Coral
              tertiary: const Color(0xFF38EF7D), // Neon green
              onSurface: Colors.white,
              surfaceContainerHighest: const Color(0xFF1A1A24),
            ),
            textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme),
            appBarTheme: const AppBarTheme(
              backgroundColor: Colors.transparent,
              elevation: 0,
              iconTheme: IconThemeData(color: Colors.white),
              titleTextStyle: TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.bold),
            ),
            pageTransitionsTheme: PageTransitionsTheme(
              builders: {
                TargetPlatform.android: ZoomPageTransitionsBuilder(),
                TargetPlatform.iOS: ZoomPageTransitionsBuilder(),
              },
            ),
          ),
          home: const MainLayout(),
        );
      },
    );
  }
}
