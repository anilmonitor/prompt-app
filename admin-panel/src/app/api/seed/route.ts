import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

const baseImages = [
  "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1682687982501-1e5898cb8f4b?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop"
];

const rawPromptTemplates = [
  {
    category: "Cyberpunk",
    title: "Neon Streets of Neo-Tokyo",
    promptText: "A futuristic cyberpunk metropolis at night, rain-slicked asphalt reflecting neon magenta and cyan holographic billboards, flying spinners navigating between towering skyscrapers, 8k resolution, cinematic atmosphere, Unreal Engine 5 render --ar 16:9 --v 6.0"
  },
  {
    category: "Cyberpunk",
    title: "Cybernetic Geisha Assassin",
    promptText: "Portrait of a cybernetic geisha with glowing optical implants, porcelain and polished titanium face plates, traditional kimono with fiber-optic embroidery, volumetric smoke, dramatic rim lighting --ar 9:16 --style raw"
  },
  {
    category: "Cyberpunk",
    title: "Retro Synthwave DeLorean",
    promptText: "A futuristic sports car speeding along an infinite neon wireframe highway into a digital chrome sunset, 80s synthwave aesthetic, laser grids, lens flare, octane render, high contrast --ar 16:9"
  },
  {
    category: "Cyberpunk",
    title: "Augmented Cyber Samurai",
    promptText: "Futuristic samurai standing on a skyscraper rooftop in a stormy cyberpunk city, holding a plasma katana glowing electric blue, reflections in puddles, cinematic lighting, masterpiece --ar 3:4"
  },
  {
    category: "Anime",
    title: "Floating Cloud Castle",
    promptText: "Studio Ghibli aesthetic, majestic floating castle above sea of puffy cumulus clouds, lush overgrown gardens hanging over marble edges, warm afternoon golden sunlight, watercolor texture, nostalgic feel --ar 16:9"
  },
  {
    category: "Anime",
    title: "School Rooftop at Sunset",
    promptText: "Makoto Shinkai style, high school rooftop looking over a sprawling Japanese city at dusk, glowing sunset gradient, cherry blossom petals drifting in the wind, hyper-detailed cloud formations --ar 16:9"
  },
  {
    category: "Anime",
    title: "Cyber Spirit Fox",
    promptText: "An ethereal nine-tailed kitsune spirit made of glowing celestial light and digital aurora borealis, mystical shrine in background, anime concept art, trending on Pixiv --ar 1:1"
  },
  {
    category: "Anime",
    title: "Mecha Pilot in Cockpit",
    promptText: "Intense close-up portrait of a young mecha pilot inside a high-tech glowing holographic cockpit, HUD displays reflecting in eyes, neon warning lights, Evangelion aesthetic, dramatic anime keyframe --ar 16:9"
  },
  {
    category: "Fantasy",
    title: "Bioluminescent Enchanted Forest",
    promptText: "A mystical ancient forest glowing with giant bioluminescent mushrooms and glowing ferns, crystal clear stream reflecting soft cyan and violet light, ethereal spirit deer in the mist, god rays --ar 16:9"
  },
  {
    category: "Fantasy",
    title: "Dragon of the Obsidian Peak",
    promptText: "A colossal obsidian-scaled dragon perched on an active volcanic caldera, glowing magma cracks across its wings, lightning storm overhead, dark fantasy epic illustration, Greg Rutkowski style --ar 16:9"
  },
  {
    category: "Fantasy",
    title: "Elven Sanctuary of Light",
    promptText: "Majestic elven palace carved into giant white crystalline roots of the World Tree, waterfalls flowing into sapphire pools, golden hour light, high fantasy landscape art, trending on ArtStation --ar 21:9"
  },
  {
    category: "Fantasy",
    title: "Wizard in Celestial Library",
    promptText: "An ancient wizard studying glowing arcane celestial orbs inside an infinite gothic library with floating spiral staircases, dust motes dancing in sunbeams, hyper-detailed oil painting --ar 4:5"
  },
  {
    category: "3D Render",
    title: "Liquid Gold & Holographic Glass",
    promptText: "Swirling ribbons of liquid gold intersecting with translucent iridescent frosted glass spheres, abstract geometry, minimal studio lighting, soft shadows, Octane Render 8k, C4D, Behance feature --ar 1:1"
  },
  {
    category: "3D Render",
    title: "Floating Chrome Geometry",
    promptText: "Futuristic 3D composition of floating metallic spheres, distorted chrome toruses, pastel pink and sky blue ambient occlusion, minimalist modern digital sculpture --ar 4:5"
  },
  {
    category: "3D Render",
    title: "Isometric Cyber Room",
    promptText: "Isometric 3D render of a cozy gamer bedroom in a futuristic cyber city, dual glowing monitors, RGB lighting, miniature plants, cute details, Blender Cycles render, high poly --ar 1:1"
  },
  {
    category: "3D Render",
    title: "Prismatic Crystal Sculpture",
    promptText: "Intricate faceted quartz crystal dispersing rainbow light refractions across a dark matte pedestal, subsurface scattering, photorealistic raytracing, high dynamic range --ar 1:1"
  },
  {
    category: "Architecture",
    title: "Minimalist Cliffside Villa",
    promptText: "Brutalist luxury concrete and glass villa perched on a dramatic coastal cliff above the Mediterranean sea at sunset, infinity pool, warm architectural lighting, Architectural Digest photography --ar 16:9"
  },
  {
    category: "Architecture",
    title: "Biophilic Eco-Skyscraper",
    promptText: "Futuristic spiral skyscraper integrated with hanging vertical forests, sky gardens, and solar glass panels, blue sky, hyper-realistic architectural visualization --ar 9:16"
  },
  {
    category: "Architecture",
    title: "Japandi Living Room Sanctuary",
    promptText: "Japandi style modern living room, light oak wood slatted walls, low-profile linen sofa, bonsai tree in stone planter, soft diffuse morning sunlight filtering through paper shoji screens --ar 16:9"
  },
  {
    category: "Architecture",
    title: "Desert Oasis Pavillion",
    promptText: "Modern rammed-earth pavilion situated in red sand dunes, internal reflective pool open to starry desert sky, ambient warm floor lanterns, architectural render --ar 16:9"
  },
  {
    category: "Space",
    title: "Majestic Cosmic Nebula",
    promptText: "Hubble telescope view of a vibrant celestial nebula, sparkling newborn stars, iridescent interstellar gas clouds in deep violet, magenta and turquoise, deep space vista, 8k wallpaper --ar 16:9"
  },
  {
    category: "Space",
    title: "Astronaut on Alien Exoplanet",
    promptText: "An astronaut standing on the purple crystal surface of a distant alien moon, looking up at a massive ringed gas giant rising over the horizon, dual suns, atmospheric depth, cinematic sci-fi --ar 21:9"
  },
  {
    category: "Space",
    title: "Interstellar Orbital Spaceport",
    promptText: "Massive ring-shaped space station orbiting a glowing blue Earth, cargo shuttles docking, solar panel arrays catching golden sun rays, photorealistic sci-fi cinematic --ar 16:9"
  },
  {
    category: "Photography",
    title: "Neon Studio Portrait",
    promptText: "Editorial fashion portrait of a model with dramatic dual-tone cyan and crimson gel lighting, sharp focus on eyes, subtle glittering freckles, shot on 85mm f/1.4 lens, Vogue cover aesthetic --ar 3:4"
  },
  {
    category: "Photography",
    title: "Steampunk Airship Pilot",
    promptText: "Detailed character portrait of an airship captain wearing weathered brass goggles, leather flight jacket with shearling collar, dramatic directional sunlight, high-end film grain --ar 4:5"
  },
  {
    category: "Photography",
    title: "Cybernetic Cyborg Model",
    promptText: "Close-up macro portrait of an android human hybrid with subtle rose-gold micro-circuitry under translucent skin, reflective hazel eyes, soft studio beauty lighting --ar 1:1"
  },
  {
    category: "Nature",
    title: "Misty Emerald Fjords",
    promptText: "Breathtaking aerial drone view of deep Norwegian fjords with sheer green mountains, cascading waterfalls into turquoise water, moody morning mist, National Geographic quality --ar 16:9"
  },
  {
    category: "Nature",
    title: "Autumn Maple Forest in Kyoto",
    promptText: "Traditional stone path winding through a glowing red and gold Japanese maple forest in Kyoto, soft mossy lanterns, light rain creating glossy reflections, peaceful atmosphere --ar 16:9"
  },
  {
    category: "Nature",
    title: "Aurora Borealis over Glacial Lake",
    promptText: "Vibrant emerald green and purple northern lights dancing across Arctic night sky, reflecting on mirror-still glacial lake, snow-capped peaks in background, long exposure photography --ar 16:9"
  },
  {
    category: "Design",
    title: "Modern Geometric Fox Logo",
    promptText: "Minimalist vector logo of a stylized geometric fox head, gradient orange to electric violet, clean lines, golden ratio grid, flat vector art, Behance Dribbble top trending --ar 1:1"
  },
  {
    category: "Design",
    title: "Futuristic Cyber Brand Mark",
    promptText: "Sleek modern tech company logo, abstract lettermark S with glowing neon gradients, dark background, vector minimalism, precision typography --ar 1:1"
  }
];

const styleModifiers = [
  "8k resolution, cinematic lighting, masterpiece, photorealistic, trending on ArtStation",
  "Unreal Engine 5 render, volumetric light, highly detailed, octane render, sharp focus",
  "vibrant color palette, award-winning composition, hyper-detailed, atmospheric",
  "dramatic rim light, high contrast, studio quality, intricate textures",
  "soft god rays, depth of field, 35mm photography, editorial excellence"
];

function generate100PlusPrompts() {
  const allPrompts = [];
  let counter = 1;

  for (let loop = 0; loop < 4; loop++) {
    for (let i = 0; i < rawPromptTemplates.length; i++) {
      const template = rawPromptTemplates[i];
      const imgIdx = (loop * rawPromptTemplates.length + i) % baseImages.length;
      const modIdx = (loop + i) % styleModifiers.length;
      
      const title = loop === 0 
        ? template.title 
        : `${template.title} (Vol. ${loop + 1})`;

      const fullPrompt = `${template.promptText} -- ${styleModifiers[modIdx]}`;
      const date = new Date(Date.now() - (counter * 1000 * 60 * 30));

      allPrompts.push({
        imageUrl: baseImages[imgIdx],
        title,
        category: template.category,
        promptText: fullPrompt,
        createdAt: date
      });

      counter++;
    }
  }

  return allPrompts;
}

export async function POST() {
  try {
    const db = await getDatabase();
    const collection = db.collection("prompts");

    const prompts = generate100PlusPrompts();
    const result = await collection.insertMany(prompts);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${result.insertedCount} prompts into MongoDB Atlas!`,
      count: result.insertedCount,
    });
  } catch (error: any) {
    console.error("Error seeding prompts:", error);
    return NextResponse.json(
      { error: error.message || "Failed to seed prompts into MongoDB" },
      { status: 500 }
    );
  }
}
