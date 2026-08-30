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

  factory PromptItem.fromJson(Map<String, dynamic> json) {
    return PromptItem(
      id: json['id']?.toString() ?? json['_id']?.toString() ?? '',
      imageUrl: json['imageUrl']?.toString() ?? '',
      promptText: json['promptText']?.toString() ?? '',
      title: json['title']?.toString() ?? 'Untitled',
      category: json['category']?.toString() ?? 'Uncategorized',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'imageUrl': imageUrl,
      'promptText': promptText,
      'title': title,
      'category': category,
    };
  }
}
