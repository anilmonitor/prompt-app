import 'package:cloud_firestore/cloud_firestore.dart';

class PromptItem {
  final String id;
  final String imageUrl;
  final String promptText;
  final String title;
  final String category;

  const PromptItem({
    required this.id,
    required this.imageUrl,
    required this.promptText,
    required this.title,
    required this.category,
  });

  factory PromptItem.fromFirestore(DocumentSnapshot doc) {
    Map data = doc.data() as Map<String, dynamic>;
    return PromptItem(
      id: doc.id,
      imageUrl: data['imageUrl'] ?? '',
      promptText: data['promptText'] ?? '',
      title: data['title'] ?? 'Untitled',
      category: data['category'] ?? 'Uncategorized',
    );
  }
}
