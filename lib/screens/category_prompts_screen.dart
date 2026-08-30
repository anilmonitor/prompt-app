import 'package:flutter/material.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import '../models/prompt_item.dart';
import '../services/prompt_service.dart';
import 'home_screen.dart';

class CategoryPromptsScreen extends StatefulWidget {
  final String category;

  const CategoryPromptsScreen({super.key, required this.category});

  @override
  State<CategoryPromptsScreen> createState() => _CategoryPromptsScreenState();
}

class _CategoryPromptsScreenState extends State<CategoryPromptsScreen> {
  late Future<List<PromptItem>> _promptsFuture;

  @override
  void initState() {
    super.initState();
    _loadPrompts();
  }

  void _loadPrompts({bool forceRefresh = false}) {
    setState(() {
      _promptsFuture = PromptService().getPrompts(
        category: widget.category,
        forceRefresh: forceRefresh,
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      appBar: AppBar(
        title: Text(widget.category,
            style: const TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0),
        child: FutureBuilder<List<PromptItem>>(
          future: _promptsFuture,
          builder: (context, snapshot) {
            if (snapshot.hasError) {
              return Center(child: Text('Error: ${snapshot.error}'));
            }

            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            }

            final prompts = snapshot.data ?? [];

            if (prompts.isEmpty) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.inbox_outlined,
                        size: 64,
                        color: Colors.grey.withValues(alpha: 0.5)),
                    const SizedBox(height: 16),
                    Text(
                      'No prompts in "${widget.category}" yet',
                      style:
                          TextStyle(color: Colors.grey.shade600, fontSize: 16),
                    ),
                  ],
                ),
              );
            }

            return RefreshIndicator(
              onRefresh: () async {
                _loadPrompts(forceRefresh: true);
                await _promptsFuture;
              },
              child: MasonryGridView.count(
                crossAxisCount: 2,
                mainAxisSpacing: 16,
                crossAxisSpacing: 16,
                itemCount: prompts.length,
                itemBuilder: (context, index) {
                  final item = prompts[index];
                  return PromptCard(
                      item: item, index: index, promptsList: prompts);
                },
              ),
            );
          },
        ),
      ),
    );
  }
}
