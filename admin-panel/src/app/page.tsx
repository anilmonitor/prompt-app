"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Copy, 
  Check, 
  Layers, 
  Zap, 
  Smartphone, 
  Shield, 
  TrendingUp, 
  Grid, 
  Lock,
  ArrowRight,
  DownloadCloud,
  Sun,
  Moon,
  Menu,
  X
} from "lucide-react";
import styles from "./page.module.css";

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.anilmonitor.trendybaba.ai.prompt&pcampaignid=web_share";

const FEATURED_PROMPTS = [
  {
    id: "1",
    title: "Neon Cyberpunk Samurai",
    category: "Cyberpunk",
    imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop",
    promptText: "A futuristic cyberpunk cyber-samurai standing on a skyscraper rooftop in Neo-Tokyo, rainy night, glowing neon katana, reflections in puddles, cinematic lighting, 8k resolution, Unreal Engine 5 render, highly detailed."
  },
  {
    id: "2",
    title: "Bioluminescent Mystical Forest",
    category: "Fantasy",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop",
    promptText: "An enchanted ancient forest with glowing bioluminescent blue and purple mushrooms, fairy lights floating in misty air, magical river, ethereal god rays, high fantasy, intricate details, trending on ArtStation."
  },
  {
    id: "3",
    title: "Minimalist Modern Concrete Villa",
    category: "Architecture",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop",
    promptText: "Luxury modern architectural villa overlooking the ocean at golden hour sunset, clean brutalist concrete and glass lines, infinity pool, warm ambient interior lights, architectural digest photography."
  }
];

export default function LandingPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [theme, setTheme] = useState<string>("dark");
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("trendy_theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("trendy_theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={styles.landingWrapper}>
      <div className={styles.ambientGlowTop} />
      <div className={styles.ambientGlowBottom} />

      <div className={styles.container}>
        {/* Navigation */}
        <header className={styles.navbar}>
          <Link href="/" className={styles.brand} onClick={closeMobileMenu}>
            <img src="/logo.png" alt="Trendy Baba Logo" className={styles.logo} />
            <span className={styles.brandName}>
              Trendy <span className={styles.brandAccent}>Baba</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className={styles.navLinksDesktop}>
            <a href="#showcase" className={styles.navLink}>Showcase</a>
            <a href="#features" className={styles.navLink}>Features</a>

            {/* Theme Toggle Button */}
            {mounted && (
              <button 
                onClick={toggleTheme} 
                className={styles.themeToggleBtn} 
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}

            <a 
              href={PLAY_STORE_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.navDownloadBtn}
            >
              <DownloadCloud size={16} />
              <span>Get App</span>
            </a>
          </nav>

          {/* Mobile Right Controls: Theme Toggle & Hamburger */}
          <div className={styles.mobileNavRight}>
            {mounted && (
              <button 
                onClick={toggleTheme} 
                className={styles.themeToggleBtn} 
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className={styles.hamburgerBtn}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </header>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className={styles.mobileDropdown}>
            <a href="#showcase" className={styles.mobileNavLink} onClick={closeMobileMenu}>
              Showcase
            </a>
            <a href="#features" className={styles.mobileNavLink} onClick={closeMobileMenu}>
              Features
            </a>
            <Link href="/privacy" className={styles.mobileNavLink} onClick={closeMobileMenu}>
              Privacy Policy
            </Link>
            <a 
              href={PLAY_STORE_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.mobileDownloadBtn}
              onClick={closeMobileMenu}
            >
              <DownloadCloud size={18} />
              <span>Download on Google Play</span>
            </a>
          </div>
        )}

        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            Unleash Your Creativity with <span className={styles.gradientText}>Trendy Baba AI Prompts</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Explore thousands of hand-crafted prompts for Midjourney, ChatGPT, Leonardo AI, DALL·E 3, and Stable Diffusion. Copy in 1-tap and create breathtaking visuals instantly.
          </p>

          <div className={styles.heroCtaGroup}>
            <a 
              href={PLAY_STORE_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.playStoreImageLink}
            >
              <img 
                src="/getitonplaystore.png" 
                alt="Get it on Google Play" 
                className={styles.playStoreBadgeImg} 
              />
            </a>

            <a href="#showcase" className={styles.secondaryBtn}>
              <span>Explore Prompts</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </section>

        {/* Live Showcase Section */}
        <section id="showcase" className={styles.showcaseSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Interactive Showcase</span>
            <h2 className={styles.sectionTitle}>Crafted For Next-Gen AI Generators</h2>
          </div>

          <div className={styles.showcaseGrid}>
            {FEATURED_PROMPTS.map((item) => (
              <article key={item.id} className={styles.showcaseCard}>
                <div className={styles.cardMedia}>
                  <img src={item.imageUrl} alt={item.title} className={styles.cardImage} />
                  <span className={styles.cardCatTag}>{item.category}</span>
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardPromptText}>{item.promptText}</p>
                  <div className={styles.cardFooter}>
                    <button 
                      onClick={() => handleCopy(item.id, item.promptText)}
                      className={styles.copyPromptBtn}
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check size={14} />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copy Prompt</span>
                        </>
                      )}
                    </button>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Ready to paste</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* App Features Section */}
        <section id="features" className={styles.featuresSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Features</span>
            <h2 className={styles.sectionTitle}>Built for AI Creators & Artists</h2>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIconBox}>
                <Zap size={24} />
              </div>
              <h3>1-Tap Prompt Copy</h3>
              <p>Quickly copy ready-to-use prompts with aspect ratios, style parameters, and negative prompts with a single tap.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIconBox}>
                <Layers size={24} />
              </div>
              <h3>Multi-AI Compatibility</h3>
              <p>Works seamlessly with Midjourney v6, ChatGPT-4o, Leonardo AI, DALL·E 3, Stable Diffusion, and Bing Image Creator.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIconBox}>
                <Grid size={24} />
              </div>
              <h3>Categorized Galleries</h3>
              <p>Anime, Cyberpunk, Photorealism, 3D Renders, Logo & Brand Design, Architecture, Space, Fantasy, and much more.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIconBox}>
                <TrendingUp size={24} />
              </div>
              <h3>Regular Fresh Prompts</h3>
              <p>Stay on top of AI trends with fresh prompt drops updated continuously via cloud database.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIconBox}>
                <Smartphone size={24} />
              </div>
              <h3>Smooth & Lightweight</h3>
              <p>Fast modern UI with AMOLED Dark Mode, Favorites collection, and Reels-style immersive prompt browsing.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIconBox}>
                <Shield size={24} />
              </div>
              <h3>Safe & Privacy First</h3>
              <p>No unnecessary tracking. Clean, transparent, and completely free to use whenever creativity strikes.</p>
            </div>
          </div>
        </section>

        {/* CTA Download Banner */}
        <section className={styles.ctaBanner}>
          <h2 className={styles.ctaTitle}>Ready to Create Amazing AI Art?</h2>
          <p className={styles.ctaSubtitle}>
            Download the Trendy Baba mobile app now from Google Play and start generating images in seconds.
          </p>
          <a 
            href={PLAY_STORE_URL} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.playStoreImageLink}
            style={{ margin: "0 auto" }}
          >
            <img 
              src="/getitonplaystore.png" 
              alt="Get it on Google Play" 
              className={styles.playStoreBadgeImg} 
            />
          </a>
        </section>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div className={styles.footerBrandCol}>
              <div className={styles.brand}>
                <img src="/logo.png" alt="Trendy Baba" className={styles.logo} />
                <span className={styles.brandName}>
                  Trendy <span className={styles.brandAccent}>Baba</span>
                </span>
              </div>
              <p className={styles.footerDesc}>
                The mobile destination for high-quality, copy-paste AI art prompts. Designed for creators, designers, and AI enthusiasts.
              </p>
            </div>

            <div className={styles.footerLinksWrapper}>
              <div className={styles.footerNavGroup}>
                <div className={styles.footerColTitle}>Navigation</div>
                <ul className={styles.footerLinkList}>
                  <li><a href="#showcase" className={styles.footerLink}>Showcase</a></li>
                  <li><a href="#features" className={styles.footerLink}>Features</a></li>
                  <li><a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className={styles.footerLink}>Google Play Store</a></li>
                </ul>
              </div>

              <div className={styles.footerNavGroup}>
                <div className={styles.footerColTitle}>Legal & Access</div>
                <ul className={styles.footerLinkList}>
                  <li><Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link></li>
                  <li>
                    <Link href="/admin" className={styles.footerLink} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <Lock size={12} />
                      <span>Admin Panel</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <div>© {new Date().getFullYear()} Trendy Baba. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
