# Trendy Baba - AI Art & Creative Prompts

<div align="center">
  <img src="admin-panel/public/logo.png" width="100" height="100" alt="Trendy Baba Logo" style="border-radius: 20px;" />
  <h3>Unleash Your Creativity with Trendy Baba AI Prompts</h3>
  <p>The premier mobile destination and web platform for curated, high-quality, copy-paste AI art prompts.</p>

  <a href="https://play.google.com/store/apps/details?id=com.anilmonitor.trendybaba.ai.prompt&pcampaignid=web_share">
    <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" width="180" alt="Get it on Google Play" />
  </a>
</div>

---

## 📱 Features

- **1-Tap Prompt Copy:** Instant copy with aspect ratios, camera parameters, and style modifiers ready for Midjourney, ChatGPT, DALL·E 3, Leonardo AI, and Stable Diffusion.
- **Categorized Galleries:** Anime, Cyberpunk, Photorealism, 3D Render, Architecture, Space, Nature, Fantasy, and Logo Design.
- **Reels-Style Feed & Favorites:** Fast browsing experience with local persistence for saved prompts.
- **MongoDB Atlas Cloud Database:** Real-time synchronized cloud prompt storage.
- **Next.js Web Showcase & Admin Panel:**
  - Public landing page at `/` with interactive prompt cards, Google Play download badge, and Light/Dark mode.
  - Dedicated admin dashboard at `/admin` for prompt management and 1-click database seeding.
  - RESTful API endpoints at `/api/prompts` and `/api/seed`.

---

## 🏗️ Architecture & Tech Stack

```
                       ┌────────────────────────┐
                       │  Flutter Mobile App    │
                       │  (Android / iOS)       │
                       └───────────┬────────────┘
                                   │ HTTP REST
                                   ▼
                       ┌────────────────────────┐
                       │ Next.js 16 Web App     │
                       │ • Landing Page ( / )   │
                       │ • Admin Panel (/admin) │
                       │ • REST API (/api/*)    │
                       └───────────┬────────────┘
                                   │ Native Driver
                                   ▼
                       ┌────────────────────────┐
                       │  MongoDB Atlas Cloud   │
                       │  (Database: prompts)   │
                       └────────────────────────┘
```

- **Mobile App:** Flutter 3.x, Dart, `http` package, `shared_preferences`, `google_fonts`
- **Web & API Backend:** Next.js 16 (App Router), React 19, TypeScript, Vanilla CSS Modules, `mongodb` driver
- **Database:** MongoDB Atlas (M0 / Serverless Cluster)
- **Deployment:** Vercel (`prompt-app-mu.vercel.app`)

---

## 📂 Project Structure

```
prompt-app/
├── lib/                             # Flutter Mobile App Source
│   ├── config/                      # API endpoint configurations
│   ├── models/                      # PromptItem data model
│   ├── screens/                     # Home, Categories, Favorites, Profile, Settings
│   ├── services/                    # PromptService (REST API client + cache)
│   ├── widgets/                     # UI components & cards
│   └── main.dart                    # Flutter entry point
├── admin-panel/                     # Next.js Web App & API
│   ├── public/                      # Static assets (logo, playstore badge)
│   ├── scripts/
│   │   └── seed.js                  # Database seeder (120+ prompts)
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   ├── prompts/         # GET, POST /api/prompts & /api/prompts/[id]
│   │   │   │   └── seed/            # POST /api/seed (1-click seeding)
│   │   │   ├── admin/               # Admin panel dashboard route
│   │   │   ├── privacy/             # Privacy policy page
│   │   │   ├── layout.tsx           # Root layout & metadata
│   │   │   └── page.tsx             # Public showcase landing page
│   │   └── lib/
│   │       └── mongodb.ts           # MongoDB singleton client helper
│   ├── .env.local                   # Environment variables (private)
│   └── package.json                 # Next.js dependencies & scripts
├── android/                         # Android native configurations
├── pubspec.yaml                     # Flutter dependencies
├── .gitignore                       # Git ignore rules
└── README.md                        # Project documentation
```

---

## 🚀 Getting Started

### 1. Environment Setup

Inside `admin-panel/`, copy the example file:
```bash
cd admin-panel
cp .env.example .env.local
```

Configure your `admin-panel/.env.local`:
```env
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.xxxxxxx.mongodb.net/trendy_baba?retryWrites=true&w=majority&appName=Cluster0"
NEXT_PUBLIC_APP_URL="https://prompt-app-mu.vercel.app"
NEXT_PUBLIC_API_URL="https://prompt-app-mu.vercel.app/api"
```

---

### 2. Run the Next.js Web App & Admin Panel

```bash
cd admin-panel
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) for the Public Showcase or [http://localhost:3000/admin](http://localhost:3000/admin) for the Admin Dashboard.

---

### 3. Seed 100+ Prompts to MongoDB Atlas

Run the automated seeder script:
```bash
cd admin-panel
npm run seed
```
*Or visit `/admin` in your browser and click the **"Seed 100+ Prompts"** button.*

---

### 4. Run the Flutter Mobile App

Ensure Flutter SDK is installed, then run from the root directory:
```bash
flutter pub get
flutter run
```

---

## 🔒 Security & Best Practices

- Secret environment variables (`.env`, `.env.local`) are ignored by `.gitignore`.
- Database credentials use MongoDB Atlas SCRAM authentication with restricted role privileges.
- Production API requests use HTTPS encryption on Vercel edge servers.

---

## 📄 License

© 2026 **Trendy Baba**. All rights reserved.
