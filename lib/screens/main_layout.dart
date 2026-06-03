import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'home_screen.dart';
import 'categories_screen.dart';
import 'favorites_screen.dart';
import 'settings_screen.dart';
import 'profile_screen.dart';
import '../providers/theme_provider.dart';
import 'package:url_launcher/url_launcher.dart';

class MainLayout extends StatefulWidget {
  const MainLayout({super.key});

  @override
  State<MainLayout> createState() => _MainLayoutState();
}

class _MainLayoutState extends State<MainLayout> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    const HomeScreen(),
    const CategoriesScreen(),
    const FavoritesScreen(),
    const SettingsScreen(),
  ];

  // Global key for the scaffold to control the drawer
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  void _navigateTo(int index) {
    setState(() => _currentIndex = index);
    Navigator.pop(context); // Close the drawer
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      key: _scaffoldKey,
      // Premium Drawer
      drawer: Drawer(
        backgroundColor: Theme.of(context).colorScheme.surface,
        child: Column(
          children: [
            // Drawer Header with gradient
            Container(
              width: double.infinity,
              padding: const EdgeInsets.fromLTRB(24, 60, 24, 30),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: isDark
                      ? [
                          const Color(0xFF1A1A2E),
                          const Color(0xFF16213E),
                          const Color(0xFF0F3460),
                        ]
                      : [
                          const Color(0xFF6C63FF),
                          const Color(0xFF8B83FF),
                        ],
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.all(3),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white, width: 2),
                    ),
                    child: const CircleAvatar(
                      radius: 32,
                      backgroundColor: Color(0xFF2D2D3A),
                      child: Text(
                        'TB',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Trendy Baba',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Premium AI Prompts',
                    style: TextStyle(
                      fontSize: 13,
                      color: Colors.white.withValues(alpha: 0.8),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 8),

            // Navigation items
            _DrawerItem(
              icon: Icons.home_rounded,
              label: 'Home',
              isSelected: _currentIndex == 0,
              onTap: () => _navigateTo(0),
            ),
            _DrawerItem(
              icon: Icons.category_rounded,
              label: 'Categories',
              isSelected: _currentIndex == 1,
              onTap: () => _navigateTo(1),
            ),
            _DrawerItem(
              icon: Icons.favorite_rounded,
              label: 'Favorites',
              isSelected: _currentIndex == 2,
              onTap: () => _navigateTo(2),
            ),
            _DrawerItem(
              icon: Icons.person_rounded,
              label: 'Profile',
              isSelected: false,
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) => const ProfileScreen()),
                );
              },
            ),
            _DrawerItem(
              icon: Icons.settings_rounded,
              label: 'Settings',
              isSelected: _currentIndex == 3,
              onTap: () => _navigateTo(3),
            ),

            const Spacer(),

            // Dark mode toggle
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Consumer<ThemeProvider>(
                builder: (context, themeProvider, child) {
                  return Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: Theme.of(context)
                          .colorScheme
                          .surfaceContainerHighest
                          .withValues(alpha: 0.3),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          isDark ? Icons.dark_mode : Icons.light_mode,
                          color: Theme.of(context).colorScheme.primary,
                          size: 20,
                        ),
                        const SizedBox(width: 12),
                        const Text('Dark Mode'),
                        const Spacer(),
                        Switch(
                          value: isDark,
                          onChanged: (_) => themeProvider.toggleTheme(),
                          activeThumbColor: Theme.of(context).colorScheme.primary,
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),

            // Rate & Share buttons
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Expanded(
                    child: TextButton.icon(
                      onPressed: () {
                        Navigator.pop(context);
                        launchUrl(Uri.parse('https://play.google.com/store/apps/details?id=com.anilmonitor.trendybaba.ai.prompt'));
                      },
                      icon: const Icon(Icons.star_rounded, size: 18),
                      label: const Text('Rate',
                          style: TextStyle(fontSize: 13)),
                    ),
                  ),
                  Container(
                    height: 24,
                    width: 1,
                    color: Colors.grey.withValues(alpha: 0.3),
                  ),
                  Expanded(
                    child: TextButton.icon(
                      onPressed: () {
                        Navigator.pop(context);
                        // Share app
                      },
                      icon: const Icon(Icons.share_rounded, size: 18),
                      label: const Text('Share',
                          style: TextStyle(fontSize: 13)),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 8),
          ],
        ),
      ),

      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.15),
              blurRadius: 20,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: NavigationBar(
          selectedIndex: _currentIndex,
          onDestinationSelected: (index) =>
              setState(() => _currentIndex = index),
          backgroundColor: Theme.of(context).colorScheme.surface,
          indicatorColor:
              Theme.of(context).colorScheme.primary.withValues(alpha: 0.15),
          height: 70,
          labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
          animationDuration: const Duration(milliseconds: 400),
          destinations: const [
            NavigationDestination(
              icon: Icon(Icons.home_outlined),
              selectedIcon: Icon(Icons.home_rounded),
              label: 'Home',
            ),
            NavigationDestination(
              icon: Icon(Icons.category_outlined),
              selectedIcon: Icon(Icons.category_rounded),
              label: 'Categories',
            ),
            NavigationDestination(
              icon: Icon(Icons.favorite_outline),
              selectedIcon: Icon(Icons.favorite_rounded),
              label: 'Favorites',
            ),
            NavigationDestination(
              icon: Icon(Icons.settings_outlined),
              selectedIcon: Icon(Icons.settings_rounded),
              label: 'Settings',
            ),
          ],
        ),
      ),
    );
  }
}

class _DrawerItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _DrawerItem({
    required this.icon,
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 2),
      child: ListTile(
        leading: Icon(
          icon,
          color: isSelected
              ? Theme.of(context).colorScheme.primary
              : Colors.grey,
          size: 22,
        ),
        title: Text(
          label,
          style: TextStyle(
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
            color: isSelected
                ? Theme.of(context).colorScheme.primary
                : null,
          ),
        ),
        selected: isSelected,
        selectedTileColor:
            Theme.of(context).colorScheme.primary.withValues(alpha: 0.08),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(14),
        ),
        onTap: onTap,
      ),
    );
  }
}
