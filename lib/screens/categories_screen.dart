import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'category_prompts_screen.dart';

class CategoriesScreen extends StatelessWidget {
  const CategoriesScreen({super.key});

  // Category-specific gradients and icons for a premium look
  static final Map<String, List<Color>> categoryGradients = {
    'Art': [const Color(0xFFFF6B6B), const Color(0xFFFF8E53)],
    'Code': [const Color(0xFF4FACFE), const Color(0xFF00F2FE)],
    'Marketing': [const Color(0xFFA18CD1), const Color(0xFFFBC2EB)],
    'Writing': [const Color(0xFF667EEA), const Color(0xFF764BA2)],
    'Business': [const Color(0xFF11998E), const Color(0xFF38EF7D)],
    'Education': [const Color(0xFFF093FB), const Color(0xFFF5576C)],
    'Music': [const Color(0xFF4776E6), const Color(0xFF8E54E9)],
    'Design': [const Color(0xFFFC5C7D), const Color(0xFF6A82FB)],
    'Photography': [const Color(0xFFFF9A9E), const Color(0xFFFAD0C4)],
    'Science': [const Color(0xFF43E97B), const Color(0xFF38F9D7)],
  };

  static final Map<String, IconData> categoryIcons = {
    'Art': Icons.palette,
    'Code': Icons.code,
    'Marketing': Icons.campaign,
    'Writing': Icons.edit_note,
    'Business': Icons.business_center,
    'Education': Icons.school,
    'Music': Icons.music_note,
    'Design': Icons.design_services,
    'Photography': Icons.camera_alt,
    'Science': Icons.science,
  };

  static List<Color> getGradient(String category) {
    return categoryGradients[category] ??
        [const Color(0xFF6C63FF), const Color(0xFF3F3D56)];
  }

  static IconData getIcon(String category) {
    return categoryIcons[category] ?? Icons.category;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      appBar: AppBar(
        title: const Text('Categories',
            style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: StreamBuilder<QuerySnapshot>(
        stream: FirebaseFirestore.instance
            .collection('prompts')
            .orderBy('createdAt', descending: true)
            .snapshots(),
        builder: (context, snapshot) {
          if (snapshot.hasError) {
            return const Center(child: Text('Something went wrong'));
          }

          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          final docs = snapshot.requireData.docs;

          // Build category → count map
          final Map<String, int> categoryCounts = {};
          for (var doc in docs) {
            final data = doc.data() as Map<String, dynamic>;
            final cat = data['category'] ?? 'Uncategorized';
            categoryCounts[cat] = (categoryCounts[cat] ?? 0) + 1;
          }

          final categories = categoryCounts.keys.toList()..sort();

          if (categories.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.category_outlined,
                      size: 64,
                      color: Colors.grey.withValues(alpha: 0.5)),
                  const SizedBox(height: 16),
                  Text(
                    'No categories yet',
                    style: TextStyle(
                        color: Colors.grey.shade600, fontSize: 16),
                  ),
                ],
              ),
            );
          }

          return Padding(
            padding: const EdgeInsets.all(16),
            child: GridView.builder(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                childAspectRatio: 1.1,
              ),
              itemCount: categories.length,
              itemBuilder: (context, index) {
                final category = categories[index];
                final count = categoryCounts[category]!;
                final gradient = getGradient(category);
                final icon = getIcon(category);

                return _CategoryCard(
                  category: category,
                  count: count,
                  gradient: gradient,
                  icon: icon,
                );
              },
            ),
          );
        },
      ),
    );
  }
}

class _CategoryCard extends StatefulWidget {
  final String category;
  final int count;
  final List<Color> gradient;
  final IconData icon;

  const _CategoryCard({
    required this.category,
    required this.count,
    required this.gradient,
    required this.icon,
  });

  @override
  State<_CategoryCard> createState() => _CategoryCardState();
}

class _CategoryCardState extends State<_CategoryCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 150),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.95).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => _controller.forward(),
      onTapUp: (_) {
        _controller.reverse();
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => CategoryPromptsScreen(
              category: widget.category,
            ),
          ),
        );
      },
      onTapCancel: () => _controller.reverse(),
      child: AnimatedBuilder(
        animation: _scaleAnimation,
        builder: (context, child) {
          return Transform.scale(
            scale: _scaleAnimation.value,
            child: child,
          );
        },
        child: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: widget.gradient,
            ),
            borderRadius: BorderRadius.circular(24),
            boxShadow: [
              BoxShadow(
                color: widget.gradient[0].withValues(alpha: 0.4),
                blurRadius: 12,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.25),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Icon(widget.icon, color: Colors.white, size: 28),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      widget.category,
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${widget.count} prompt${widget.count != 1 ? 's' : ''}',
                      style: TextStyle(
                        color: Colors.white.withValues(alpha: 0.85),
                        fontSize: 13,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
