import '../models/prompt_item.dart';

final List<String> _baseImages = [
  'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1682687982501-1e5898cb8f4b?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1000&auto=format&fit=crop',
];

final List<Map<String, String>> _categoriesAndPrompts = [
  {
    'category': 'Cyberpunk',
    'title': 'Neon Streets',
    'prompt': 'A futuristic cyberpunk city at night, raining, neon lights reflecting on wet streets, flying cars, highly detailed, 8k resolution, cinematic lighting, conceptual art.',
  },
  {
    'category': 'Fantasy',
    'title': 'Ethereal Forest',
    'prompt': 'A magical forest glowing with bioluminescent plants and mushrooms, mystical creatures hiding in the shadows, fog, soft god rays filtering through the canopy, fantasy illustration, trending on ArtStation.',
  },
  {
    'category': 'Abstract',
    'title': 'Fluid Dynamics',
    'prompt': 'Vibrant fluid colors swirling together, deep purples, electric blues, and neon pinks, abstract 3D render, smooth curves, glossy finish, octane render.',
  },
  {
    'category': 'Architecture',
    'title': 'Minimalist Villa',
    'prompt': 'A modern minimalist concrete house on a cliff overlooking the ocean at sunset, clean lines, warm interior lighting, photorealistic, architectural photography.',
  },
  {
    'category': 'Space',
    'title': 'Cosmic Nebula',
    'prompt': 'A vibrant and colorful nebula in deep space, glowing stars, cosmic dust clouds, surreal colors, Hubble telescope style, extremely detailed and majestic.',
  },
  {
    'category': 'Portrait',
    'title': 'Steampunk Inventor',
    'prompt': 'A detailed portrait of a steampunk inventor wearing brass goggles and a leather coat, intricate mechanical background, dramatic lighting, masterpiece painting.',
  },
  {
    'category': 'Cyberpunk',
    'title': 'Neon Samurai',
    'prompt': 'A futuristic samurai holding a glowing neon katana, standing on a rainy Tokyo rooftop at night, glowing armor, intense atmosphere, cyberpunk aesthetic.',
  },
  {
    'category': 'Concept Art',
    'title': 'Robot AI Mind',
    'prompt': 'A highly advanced android head with glowing circuits exposed, thinking deeply, abstract data streams flowing around it, modern tech concept art.',
  },
  {
    'category': 'Nature',
    'title': 'Serene Waterfall',
    'prompt': 'A beautiful serene waterfall deep in a lush green jungle, sunlight streaming through leaves, realistic, 4k, national geographic photo.',
  },
  {
    'category': 'Surrealism',
    'title': 'Floating Islands',
    'prompt': 'Giant floating islands in the sky, cascading waterfalls falling into the clouds below, surreal landscape, highly detailed digital painting, vibrant colors.',
  },
];

final List<String> _styles = [
  'cinematic lighting, trending on ArtStation',
  '8k resolution, photorealistic, Unreal Engine 5 render',
  'vibrant colors, highly detailed, concept art',
  'masterpiece, sharp focus, octane render',
  'studio lighting, hyper-realistic, volumetric fog',
  'anime style, Studio Ghibli, beautiful scenery',
  'dark fantasy, gloomy atmospheric lighting',
  'watercolor painting, soft edges, ethereal',
  'synthwave aesthetic, retrowave, neon grids',
  'cyberpunk vibe, lens flare, high contrast',
];

List<PromptItem> _generate100Prompts() {
  final List<PromptItem> items = [];
  int idCounter = 1;

  for (int i = 0; i < 11; i++) { // Generate 110 items (11 * 10)
    for (int j = 0; j < _categoriesAndPrompts.length; j++) {
      final base = _categoriesAndPrompts[j];
      final imageIndex = (i + j) % _baseImages.length;
      final styleIndex = (i * j) % _styles.length;
      
      final category = base['category']!;
      // Make title slightly unique for variety
      final title = i == 0 ? base['title']! : '${base['title']} Vol.${i + 1}';
      
      final basePrompt = base['prompt']!;
      final style = _styles[styleIndex];
      final fullPrompt = '$basePrompt $style';

      items.add(
        PromptItem(
          id: idCounter.toString(),
          imageUrl: _baseImages[imageIndex],
          title: title,
          category: category,
          promptText: fullPrompt,
        ),
      );
      idCounter++;
    }
  }

  return items;
}

final List<PromptItem> samplePrompts = _generate100Prompts();
