import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:provider/provider.dart';
import 'package:share_plus/share_plus.dart';
import '../models/prompt_item.dart';
import '../providers/favorites_provider.dart';
import '../providers/analytics_provider.dart';

class ReelsScreen extends StatefulWidget {
  final int initialIndex;
  final List<PromptItem> promptsList;

  const ReelsScreen({
    super.key,
    required this.initialIndex,
    required this.promptsList,
  });

  @override
  State<ReelsScreen> createState() => _ReelsScreenState();
}

class _ReelsScreenState extends State<ReelsScreen> {
  late PageController _pageController;
  int _currentPage = 0;

  @override
  void initState() {
    super.initState();
    _currentPage = widget.initialIndex;
    _pageController = PageController(initialPage: widget.initialIndex);

    // Track initial view
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (widget.promptsList.isNotEmpty) {
        Provider.of<AnalyticsProvider>(context, listen: false)
            .incrementView(widget.promptsList[widget.initialIndex].id);
      }
    });
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _copyToClipboard(BuildContext context, PromptItem item) {
    Clipboard.setData(ClipboardData(text: item.promptText));
    Provider.of<AnalyticsProvider>(context, listen: false)
        .incrementCopy(item.id);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Row(
          children: [
            Icon(Icons.check_circle, color: Colors.white),
            SizedBox(width: 12),
            Text('Prompt copied to clipboard!',
                style: TextStyle(fontWeight: FontWeight.bold)),
          ],
        ),
        backgroundColor: Colors.green.shade600,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        margin: const EdgeInsets.all(16),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  void _sharePrompt(BuildContext context, PromptItem item) {
    Share.share(
      '✨ ${item.title}\n\n${item.promptText}\n\n— Shared from Trendy Baba',
    );
    Provider.of<AnalyticsProvider>(context, listen: false)
        .incrementShare(item.id);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.black.withValues(alpha: 0.5),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.arrow_back, color: Colors.white, size: 20),
          ),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          // Page indicator
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.black.withValues(alpha: 0.5),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              '${_currentPage + 1} / ${widget.promptsList.length}',
              style: const TextStyle(
                color: Colors.white,
                fontSize: 13,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(width: 16),
        ],
      ),
      body: PageView.builder(
        controller: _pageController,
        scrollDirection: Axis.vertical,
        onPageChanged: (page) {
          setState(() => _currentPage = page);
          Provider.of<AnalyticsProvider>(context, listen: false)
              .incrementView(widget.promptsList[page].id);
        },
        itemCount: widget.promptsList.length,
        itemBuilder: (context, index) {
          final item = widget.promptsList[index];
          return _buildReelPage(context, item);
        },
      ),
    );
  }

  Widget _buildReelPage(BuildContext context, PromptItem item) {
    return Stack(
      fit: StackFit.expand,
      children: [
        // Background Image
        Hero(
          tag: item.id,
          child: CachedNetworkImage(
            imageUrl: item.imageUrl,
            fit: BoxFit.cover,
            placeholder: (context, url) => Container(color: Colors.grey[900]),
            errorWidget: (context, url, error) => Container(
              color: Colors.grey[900],
              child: const Icon(Icons.error, color: Colors.white54),
            ),
          ),
        ),

        // Gradient Overlay
        Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.bottomCenter,
              end: Alignment.topCenter,
              colors: [
                Colors.black.withValues(alpha: 0.95),
                Colors.black.withValues(alpha: 0.6),
                Colors.transparent,
                Colors.transparent,
              ],
              stops: const [0.0, 0.4, 0.7, 1.0],
            ),
          ),
        ),

        // Side Actions (Right)
        Positioned(
          right: 16,
          bottom: 180,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Favorite
              Consumer<FavoritesProvider>(
                builder: (context, favoritesProvider, child) {
                  final isFavorite = favoritesProvider.isFavorite(item.id);
                  return _SideActionButton(
                    icon: isFavorite ? Icons.favorite : Icons.favorite_border,
                    label: 'Save',
                    color: isFavorite ? Colors.red : Colors.white,
                    onTap: () => favoritesProvider.toggleFavorite(item.id),
                  );
                },
              ),
              const SizedBox(height: 20),

              // Share
              _SideActionButton(
                icon: Icons.share_rounded,
                label: 'Share',
                color: Colors.white,
                onTap: () => _sharePrompt(context, item),
              ),
              const SizedBox(height: 20),

              // Copy (quick)
              _SideActionButton(
                icon: Icons.copy_rounded,
                label: 'Copy',
                color: Colors.white,
                onTap: () => _copyToClipboard(context, item),
              ),
            ],
          ),
        ),

        // Content (Bottom)
        SafeArea(
          child: Padding(
            padding:
                const EdgeInsets.only(left: 24, right: 72, bottom: 24, top: 24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.end,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Category Badge
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: Theme.of(context)
                        .colorScheme
                        .primary
                        .withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: Theme.of(context).colorScheme.primary,
                      width: 1,
                    ),
                  ),
                  child: Text(
                    item.category,
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Title
                Text(
                  item.title,
                  style: const TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                    height: 1.1,
                  ),
                ),
                const SizedBox(height: 16),

                // Prompt Text Container (Scrollable)
                Container(
                  constraints: const BoxConstraints(maxHeight: 150),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                        color: Colors.white.withValues(alpha: 0.15)),
                  ),
                  child: SingleChildScrollView(
                    child: Text(
                      item.promptText,
                      style: const TextStyle(
                        fontSize: 14,
                        height: 1.5,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // Copy Button
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: ElevatedButton(
                    onPressed: () => _copyToClipboard(context, item),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Theme.of(context).colorScheme.primary,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(18),
                      ),
                    ),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.copy_rounded, size: 20),
                        SizedBox(width: 12),
                        Text(
                          'Copy Prompt',
                          style: TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class _SideActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _SideActionButton({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.black.withValues(alpha: 0.4),
              shape: BoxShape.circle,
              border: Border.all(
                  color: Colors.white.withValues(alpha: 0.2), width: 1),
            ),
            child: Icon(icon, color: color, size: 26),
          ),
          const SizedBox(height: 4),
          Text(label,
              style: const TextStyle(
                  color: Colors.white,
                  fontSize: 11,
                  fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
