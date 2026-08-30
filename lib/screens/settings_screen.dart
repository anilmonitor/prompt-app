import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:share_plus/share_plus.dart';
import '../providers/theme_provider.dart';
import '../providers/favorites_provider.dart';
import 'profile_screen.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  Future<void> _launchURL(String urlString) async {
    final Uri url = Uri.parse(urlString);
    if (!await launchUrl(url)) {
      debugPrint('Could not launch $url');
    }
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final isDark = themeProvider.isDarkMode;

    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      appBar: AppBar(
        title:
            const Text('Settings', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Appearance Section
          _SectionHeader(title: 'APPEARANCE'),
          Card(
            elevation: 0,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            color: Theme.of(context)
                .colorScheme
                .surfaceContainerHighest
                .withValues(alpha: 0.3),
            child: Column(
              children: [
                ListTile(
                  leading: _SettingIcon(
                    icon: isDark ? Icons.dark_mode : Icons.light_mode,
                    color: const Color(0xFFFFC107),
                  ),
                  title: const Text('Dark Mode'),
                  subtitle: Text(isDark ? 'On' : 'Off',
                      style: TextStyle(
                          color: Colors.grey.shade500, fontSize: 12)),
                  trailing: Switch(
                    value: isDark,
                    onChanged: (value) {
                      themeProvider.toggleTheme();
                    },
                    activeThumbColor: Theme.of(context).colorScheme.primary,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // General Section
          _SectionHeader(title: 'GENERAL'),
          Card(
            elevation: 0,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            color: Theme.of(context)
                .colorScheme
                .surfaceContainerHighest
                .withValues(alpha: 0.3),
            child: Column(
              children: [
                ListTile(
                  leading: _SettingIcon(
                    icon: Icons.person_outline_rounded,
                    color: const Color(0xFF6C63FF),
                  ),
                  title: const Text('Profile'),
                  trailing: const Icon(Icons.chevron_right, color: Colors.grey),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => const ProfileScreen()),
                    );
                  },
                ),
                _Divider(),
                ListTile(
                  leading: _SettingIcon(
                    icon: Icons.delete_outline_rounded,
                    color: const Color(0xFFFF6B6B),
                  ),
                  title: const Text('Clear Favorites'),
                  trailing: const Icon(Icons.chevron_right, color: Colors.grey),
                  onTap: () {
                    _showClearFavoritesDialog(context);
                  },
                ),
                _Divider(),
                ListTile(
                  leading: _SettingIcon(
                    icon: Icons.notifications_outlined,
                    color: const Color(0xFF38EF7D),
                  ),
                  title: const Text('Notifications'),
                  subtitle: Text('Coming soon',
                      style: TextStyle(
                          color: Colors.grey.shade500, fontSize: 12)),
                  trailing: const Icon(Icons.chevron_right, color: Colors.grey),
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: const Text('Notifications coming soon! 🔔'),
                        behavior: SnackBarBehavior.floating,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12)),
                        margin: const EdgeInsets.all(16),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Share & Support Section
          _SectionHeader(title: 'SUPPORT'),
          Card(
            elevation: 0,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            color: Theme.of(context)
                .colorScheme
                .surfaceContainerHighest
                .withValues(alpha: 0.3),
            child: Column(
              children: [
                ListTile(
                  leading: _SettingIcon(
                    icon: Icons.share_rounded,
                    color: const Color(0xFF4FACFE),
                  ),
                  title: const Text('Share App'),
                  trailing: const Icon(Icons.chevron_right, color: Colors.grey),
                  onTap: () {
                    Share.share(
                      '🔥 Check out Trendy Baba — the ultimate AI Prompt collection app!\n\nDownload now and boost your creativity! ✨',
                    );
                  },
                ),
                _Divider(),
                ListTile(
                  leading: _SettingIcon(
                    icon: Icons.star_outline_rounded,
                    color: const Color(0xFFFFD700),
                  ),
                  title: const Text('Rate the App'),
                  trailing: const Icon(Icons.chevron_right, color: Colors.grey),
                  onTap: () {
                    _launchURL('https://play.google.com/store/apps/details?id=com.anilmonitor.trendybaba.ai.prompt');
                  },
                ),
                _Divider(),
                ListTile(
                  leading: _SettingIcon(
                    icon: Icons.bug_report_outlined,
                    color: const Color(0xFFFF8A65),
                  ),
                  title: const Text('Report a Bug'),
                  trailing: const Icon(Icons.chevron_right, color: Colors.grey),
                  onTap: () {
                    _launchURL('mailto:anilmonitor@gmail.com?subject=Trendy Baba Bug Report');
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // About Section
          _SectionHeader(title: 'ABOUT'),
          Card(
            elevation: 0,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            color: Theme.of(context)
                .colorScheme
                .surfaceContainerHighest
                .withValues(alpha: 0.3),
            child: Column(
              children: [
                ListTile(
                  leading: _SettingIcon(
                    icon: Icons.info_outline_rounded,
                    color: const Color(0xFFA18CD1),
                  ),
                  title: const Text('About Trendy Baba'),
                  trailing: const Icon(Icons.chevron_right, color: Colors.grey),
                  onTap: () {
                    showAboutDialog(
                      context: context,
                      applicationName: 'Trendy Baba',
                      applicationVersion: '1.0.3',
                      applicationLegalese: '© 2026 Anil Monitor',
                      children: [
                        const SizedBox(height: 16),
                        const Text(
                            'A premium gallery of AI Prompts powered by MongoDB and Flutter. Designed to inspire creativity.'),
                      ],
                    );
                  },
                ),
                _Divider(),
                ListTile(
                  leading: _SettingIcon(
                    icon: Icons.privacy_tip_outlined,
                    color: const Color(0xFF78909C),
                  ),
                  title: const Text('Privacy Policy'),
                  trailing: const Icon(Icons.chevron_right, color: Colors.grey),
                  onTap: () {
                    _launchURL('https://prompt-app-mu.vercel.app/privacy');
                  },
                ),
                _Divider(),
                ListTile(
                  leading: _SettingIcon(
                    icon: Icons.description_outlined,
                    color: const Color(0xFF90A4AE),
                  ),
                  title: const Text('Terms of Service'),
                  trailing: const Icon(Icons.chevron_right, color: Colors.grey),
                  onTap: () {
                    _launchURL('https://policies.google.com/terms');
                  },
                ),
              ],
            ),
          ),

          const SizedBox(height: 40),
          Center(
            child: Column(
              children: [
                Text(
                  'Trendy Baba v1.0.3',
                  style: TextStyle(color: Colors.grey.withValues(alpha: 0.5)),
                ),
                const SizedBox(height: 4),
                Text(
                  'Made with ❤️ by Anil Monitor',
                  style: TextStyle(
                      color: Colors.grey.withValues(alpha: 0.4), fontSize: 12),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }

  void _showClearFavoritesDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Text('Clear All Favorites?'),
          content: const Text(
              'This will remove all prompts from your favorites list. This action cannot be undone.'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: () {
                final favProv =
                    Provider.of<FavoritesProvider>(context, listen: false);
                // Clear all by toggling each
                final ids = List<String>.from(favProv.favoriteIds);
                for (final id in ids) {
                  favProv.toggleFavorite(id);
                }
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: const Text('All favorites cleared'),
                    behavior: SnackBarBehavior.floating,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                    margin: const EdgeInsets.all(16),
                  ),
                );
              },
              child: const Text('Clear All'),
            ),
          ],
        );
      },
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;
  const _SectionHeader({required this.title});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(left: 8, bottom: 10),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.bold,
          color: Colors.grey,
          letterSpacing: 1.2,
        ),
      ),
    );
  }
}

class _SettingIcon extends StatelessWidget {
  final IconData icon;
  final Color color;

  const _SettingIcon({required this.icon, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Icon(icon, color: color, size: 22),
    );
  }
}

class _Divider extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Divider(height: 1, color: Colors.grey.withValues(alpha: 0.15));
  }
}
