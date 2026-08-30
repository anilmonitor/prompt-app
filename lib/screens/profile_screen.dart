import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../providers/analytics_provider.dart';
import '../providers/favorites_provider.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  Future<void> _launchURL(String urlString) async {
    final Uri url = Uri.parse(urlString);
    if (!await launchUrl(url)) {
      debugPrint('Could not launch $url');
    }
  }

  @override
  Widget build(BuildContext context) {
    final analytics = Provider.of<AnalyticsProvider>(context);
    final favorites = Provider.of<FavoritesProvider>(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      body: CustomScrollView(
        slivers: [
          // Premium gradient header
          SliverAppBar(
            expandedHeight: 280,
            pinned: true,
            backgroundColor: Theme.of(context).colorScheme.surface,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
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
                            const Color(0xFF667EEA),
                            const Color(0xFF764BA2),
                          ],
                  ),
                ),
                child: SafeArea(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const SizedBox(height: 20),
                      // Avatar
                      Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.white, width: 3),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.3),
                              blurRadius: 20,
                              offset: const Offset(0, 10),
                            ),
                          ],
                        ),
                        child: const CircleAvatar(
                          radius: 45,
                          backgroundColor: Color(0xFF2D2D3A),
                          child: Text(
                            'TB',
                            style: TextStyle(
                              fontSize: 32,
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
                          fontSize: 26,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'Premium AI Prompt Collection',
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.white.withValues(alpha: 0.8),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),

          // Stats cards
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Stats Row
                  Row(
                    children: [
                      _StatCard(
                        icon: Icons.copy_rounded,
                        label: 'Copies',
                        value: analytics.totalCopies.toString(),
                        gradient: const [Color(0xFF00B4DB), Color(0xFF0083B0)],
                      ),
                      const SizedBox(width: 12),
                      _StatCard(
                        icon: Icons.favorite_rounded,
                        label: 'Favorites',
                        value: favorites.favoriteIds.length.toString(),
                        gradient: const [Color(0xFFFF6B6B), Color(0xFFEE5A24)],
                      ),
                      const SizedBox(width: 12),
                      _StatCard(
                        icon: Icons.share_rounded,
                        label: 'Shares',
                        value: analytics.totalShares.toString(),
                        gradient: const [Color(0xFF38EF7D), Color(0xFF11998E)],
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      _StatCard(
                        icon: Icons.visibility_rounded,
                        label: 'Views',
                        value: analytics.totalViews.toString(),
                        gradient: const [Color(0xFFA18CD1), Color(0xFFFBC2EB)],
                      ),
                      const SizedBox(width: 12),
                      const Expanded(flex: 2, child: SizedBox()),
                    ],
                  ),

                  const SizedBox(height: 32),

                  // About Section
                  const Padding(
                    padding: EdgeInsets.only(left: 4, bottom: 12),
                    child: Text(
                      'ABOUT',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: Colors.grey,
                        letterSpacing: 1.2,
                      ),
                    ),
                  ),
                  Card(
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20)),
                    color: Theme.of(context)
                        .colorScheme
                        .surfaceContainerHighest
                        .withValues(alpha: 0.3),
                    child: Column(
                      children: [
                        ListTile(
                          leading: Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: const Color(0xFF6C63FF)
                                  .withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(Icons.info_outline,
                                color: Color(0xFF6C63FF)),
                          ),
                          title: const Text('App Version'),
                          trailing: Text('1.0.3',
                              style: TextStyle(color: Colors.grey.shade500)),
                        ),
                        Divider(
                            height: 1,
                            color: Colors.grey.withValues(alpha: 0.15)),
                        ListTile(
                          leading: Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: const Color(0xFFFF6B6B)
                                  .withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(Icons.developer_mode,
                                color: Color(0xFFFF6B6B)),
                          ),
                          title: const Text('Developer'),
                          trailing: Text('Anil Monitor',
                              style: TextStyle(color: Colors.grey.shade500)),
                        ),
                        Divider(
                            height: 1,
                            color: Colors.grey.withValues(alpha: 0.15)),
                        ListTile(
                          leading: Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: const Color(0xFF38EF7D)
                                  .withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(Icons.auto_awesome,
                                color: Color(0xFF38EF7D)),
                          ),
                          title: const Text('Powered by'),
                          trailing: Text('MongoDB & Flutter',
                              style: TextStyle(color: Colors.grey.shade500)),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Social Links Section
                  const Padding(
                    padding: EdgeInsets.only(left: 4, bottom: 12),
                    child: Text(
                      'CONNECT',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: Colors.grey,
                        letterSpacing: 1.2,
                      ),
                    ),
                  ),
                  Card(
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20)),
                    color: Theme.of(context)
                        .colorScheme
                        .surfaceContainerHighest
                        .withValues(alpha: 0.3),
                    child: Column(
                      children: [
                        ListTile(
                          leading: Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(Icons.link, color: Colors.blue),
                          ),
                          title: const Text('GitHub'),
                          trailing:
                              const Icon(Icons.open_in_new, color: Colors.grey, size: 18),
                          onTap: () =>
                              _launchURL('https://github.com/anilmonitor'),
                        ),
                        Divider(
                            height: 1,
                            color: Colors.grey.withValues(alpha: 0.15)),
                        ListTile(
                          leading: Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: Colors.pink.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(Icons.camera_alt,
                                color: Colors.pink),
                          ),
                          title: const Text('Instagram'),
                          trailing:
                              const Icon(Icons.open_in_new, color: Colors.grey, size: 18),
                          onTap: () => _launchURL(
                              'https://instagram.com/anilmonitor'),
                        ),
                        Divider(
                            height: 1,
                            color: Colors.grey.withValues(alpha: 0.15)),
                        ListTile(
                          leading: Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: Colors.blue.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(Icons.alternate_email,
                                color: Colors.lightBlue),
                          ),
                          title: const Text('Twitter / X'),
                          trailing:
                              const Icon(Icons.open_in_new, color: Colors.grey, size: 18),
                          onTap: () =>
                              _launchURL('https://x.com/anilmonitor'),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 32),

                  // Made with love footer
                  Center(
                    child: Column(
                      children: [
                        Text(
                          'Made with ❤️ by Anil Monitor',
                          style: TextStyle(
                            color: Colors.grey.withValues(alpha: 0.6),
                            fontSize: 13,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '© 2026 Trendy Baba',
                          style: TextStyle(
                            color: Colors.grey.withValues(alpha: 0.4),
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final List<Color> gradient;

  const _StatCard({
    required this.icon,
    required this.label,
    required this.value,
    required this.gradient,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 12),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              gradient[0].withValues(alpha: 0.15),
              gradient[1].withValues(alpha: 0.08),
            ],
          ),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: gradient[0].withValues(alpha: 0.3),
            width: 1,
          ),
        ),
        child: Column(
          children: [
            Icon(icon, color: gradient[0], size: 26),
            const SizedBox(height: 8),
            Text(
              value,
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: gradient[0],
              ),
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey.shade500,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
