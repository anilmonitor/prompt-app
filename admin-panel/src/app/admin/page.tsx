"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Sun, 
  Moon, 
  Link as LinkIcon, 
  Trash2, 
  Search, 
  Edit2, 
  X, 
  FileText, 
  Tag, 
  Plus, 
  AlertCircle,
  RefreshCw,
  Database,
  Globe
} from "lucide-react";
import styles from "./admin.module.css";
import Link from "next/link";

interface PromptItem {
  id: string;
  imageUrl: string;
  title: string;
  category: string;
  promptText: string; 
  createdAt?: string | Date;
}

export default function AdminDashboard() {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [promptText, setPromptText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState("light");
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const authStatus = sessionStorage.getItem("admin_authenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
    setIsCheckingAuth(false);
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUsername === "admin" && loginPassword === "trendybaba123") {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_authenticated", "true");
      setLoginError("");
    } else {
      setLoginError("Invalid username or password");
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Fetch prompts from MongoDB API
  const fetchPrompts = useCallback(async () => {
    try {
      setFetchError(null);
      const res = await fetch("/api/prompts", { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`Failed to fetch prompts: ${res.statusText}`);
      }
      const data = await res.json();
      setPrompts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Error loading prompts:", err);
      setFetchError(err.message || "Failed to load prompts from MongoDB");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPrompts();
    }
  }, [isAuthenticated, fetchPrompts]);

  const handleAddNewClick = () => {
    setIsEditing(false);
    setEditingId(null);
    setTitle("");
    setCategory("");
    setPromptText("");
    setImageUrl("");
    setIsModalOpen(true);
  };

  const handleEditClick = (item: PromptItem) => {
    setIsEditing(true);
    setEditingId(item.id);
    setTitle(item.title);
    setCategory(item.category);
    setPromptText(item.promptText);
    setImageUrl(item.imageUrl);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditingId(null);
    setTitle("");
    setCategory("");
    setPromptText("");
    setImageUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      alert("Please provide an image link.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && editingId) {
        // Update existing prompt in MongoDB
        const res = await fetch(`/api/prompts/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageUrl,
            title,
            category: category.trim(),
            promptText,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to update prompt");
        }
      } else {
        // Create new prompt in MongoDB
        const res = await fetch("/api/prompts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageUrl,
            title,
            category: category.trim(),
            promptText,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to create prompt");
        }
      }

      handleCloseModal();
      await fetchPrompts();
      
    } catch (error: any) {
      console.error("Error saving document: ", error);
      alert(error.message || "Failed to save prompt.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this prompt from MongoDB?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/prompts/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to delete prompt");
      }

      if (isEditing && editingId === id) {
        handleCloseModal();
      }
      await fetchPrompts();
    } catch (error: any) {
      console.error("Error deleting document: ", error);
      alert(error.message || "Failed to delete prompt.");
    }
  };

  // Get list of unique categories
  const categoriesList = ["All", ...Array.from(new Set(prompts.map(p => p.category).filter(Boolean)))];

  // Filtered prompts computed value
  const filteredPrompts = prompts.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.promptText.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (isCheckingAuth) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.loginWrapper}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <div className={styles.loginLogoRow}>
              <img src="/logo.png" alt="Trendy Baba Logo" className={styles.loginLogoImage} />
              <h1>Trendy Baba Admin</h1>
            </div>
            <p>Please enter your credentials to access the admin panel</p>
          </div>

          <form onSubmit={handleLoginSubmit} className={styles.loginForm}>
            {loginError && (
              <div className={styles.loginErrorMsg}>
                <AlertCircle size={16} />
                <span>{loginError}</span>
              </div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="loginUsername">Username</label>
              <input
                id="loginUsername"
                type="text"
                className={styles.input}
                placeholder="Enter username"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="loginPassword">Password</label>
              <input
                id="loginPassword"
                type="password"
                className={styles.input}
                placeholder="Enter password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className={styles.button}>
              Log In
            </button>
            
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <Link href="/" style={{ fontSize: "0.85rem", opacity: 0.7, textDecoration: "none", color: "inherit" }}>
                ← Back to Public Website
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* Header Section */}
        <header className={styles.header}>
          <div className={styles.titleGroup}>
            <div className={styles.logoRow}>
              <img src="/logo.png" alt="Trendy Baba Logo" className={styles.logoImage} />
              <h1>Trendy Baba Admin</h1>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
              <span style={{ 
                display: "inline-flex", 
                alignItems: "center", 
                gap: "5px", 
                fontSize: "12px", 
                padding: "2px 8px", 
                borderRadius: "12px", 
                backgroundColor: "rgba(16, 185, 129, 0.15)", 
                color: "#10b981",
                fontWeight: 600
              }}>
                <Database size={13} /> MongoDB Atlas Connected
              </span>
            </div>
          </div>
          
          <div className={styles.headerActions}>
            <Link href="/" className={styles.privacyLink} title="View Public Website">
              <Globe size={18} />
              <span className={styles.privacyTextFull}>View Website</span>
              <span className={styles.privacyTextMobile}>Website</span>
            </Link>

            <button onClick={fetchPrompts} className={styles.themeToggle} title="Refresh Data">
              <RefreshCw size={17} />
              <span className={styles.toggleText}>Refresh</span>
            </button>

            <Link href="/privacy" className={styles.privacyLink}>
              <FileText size={18} />
              <span className={styles.privacyTextFull}>Privacy</span>
              <span className={styles.privacyTextMobile}>Privacy</span>
            </Link>
            
            <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle Theme">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              <span className={styles.toggleText}>{theme === "dark" ? "Light" : "Dark"}</span>
            </button>
          </div>
        </header>

        {/* Dashboard Main Content */}
        <main className={styles.mainLayout}>
          
          {fetchError && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 16px",
              marginBottom: "16px",
              borderRadius: "10px",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#ef4444"
            }}>
              <AlertCircle size={20} />
              <span>{fetchError}</span>
              <button 
                onClick={fetchPrompts} 
                style={{ marginLeft: "auto", textDecoration: "underline", background: "none", border: "none", color: "inherit", cursor: "pointer" }}
              >
                Retry
              </button>
            </div>
          )}

          {/* Search, Filter, and Add Prompt Panel */}
          <div className={styles.filterCard}>
            <div className={styles.searchRow}>
              <div className={styles.searchWrapper}>
                <Search size={18} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search prompts by title, category, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className={styles.clearSearchBtn} aria-label="Clear Search">
                    <X size={16} />
                  </button>
                )}
              </div>
              
              <button 
                onClick={async () => {
                  const confirmed = window.confirm("Push 100+ curated AI prompts to MongoDB database?");
                  if (!confirmed) return;
                  try {
                    setIsSubmitting(true);
                    const res = await fetch("/api/seed", { method: "POST" });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.error || "Failed to seed");
                    alert(data.message || "Successfully pushed 100+ prompts!");
                    await fetchPrompts();
                  } catch (err: any) {
                    alert("Seeding error: " + err.message);
                  } finally {
                    setIsSubmitting(false);
                  }
                }} 
                className={styles.addPromptBtn}
                style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}
                title="Populate 100+ curated AI prompts"
                disabled={isSubmitting}
              >
                <Database size={18} />
                <span>Seed 100+ Prompts</span>
              </button>

              <button onClick={handleAddNewClick} className={styles.addPromptBtn}>
                <Plus size={18} />
                <span>Add New Prompt</span>
              </button>
            </div>

            {/* Category Filter Chips */}
            <div className={styles.categoryChips}>
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  className={`${styles.chip} ${selectedCategory === cat ? styles.activeChip : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* List Heading */}
          <div className={styles.listHeader}>
            <h2 className={styles.sectionTitle}>
              {selectedCategory === "All" ? "All Prompts" : `${selectedCategory} Prompts`}
              <span className={styles.countBadge}>{filteredPrompts.length}</span>
            </h2>
          </div>

          {/* Prompt Cards Grid */}
          {isLoading ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-secondary)" }}>
              <RefreshCw size={32} className="animate-spin" style={{ margin: "0 auto 16px" }} />
              <p>Loading prompts from MongoDB...</p>
            </div>
          ) : filteredPrompts.length === 0 ? (
            <div className={styles.emptyState}>
              <AlertCircle size={40} className={styles.emptyIcon} />
              <h3>No Prompts Found</h3>
              <p>Try adjusting your search keywords or select a different category filter, or click &quot;Add New Prompt&quot; above.</p>
            </div>
          ) : (
            <div className={styles.promptGrid}>
              {filteredPrompts.map((item) => (
                <article key={item.id} className={styles.promptCard}>
                  <div className={styles.imageContainer}>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className={styles.imagePreview}
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500' }}
                      loading="lazy"
                    />
                    <span className={styles.categoryBadge}>{item.category}</span>
                  </div>
                  
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <p className={styles.cardPrompt}>{item.promptText}</p>
                    
                    <div className={styles.cardActions}>
                      <button 
                        className={styles.editBtn} 
                        onClick={() => handleEditClick(item)}
                        title="Edit Prompt"
                      >
                        <Edit2 size={15} />
                        <span>Edit</span>
                      </button>
                      
                      <button 
                        className={styles.deleteBtn} 
                        onClick={() => handleDelete(item.id)}
                        title="Delete Prompt"
                      >
                        <Trash2 size={15} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>

        {/* Modal Overlay for Add/Edit Form */}
        {isModalOpen && (
          <div className={styles.modalOverlay} onClick={handleCloseModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              
              {/* Modal Header */}
              <div className={styles.modalHeader}>
                <div className={styles.modalTitleRow}>
                  {isEditing ? <Edit2 className={styles.accentIcon} /> : <Plus className={styles.accentIcon} />}
                  <h2>{isEditing ? "Edit Prompt Details" : "Create New Prompt"}</h2>
                </div>
                <button onClick={handleCloseModal} className={styles.modalCloseBtn} aria-label="Close modal">
                  <X size={20} />
                </button>
              </div>

              {/* Form fields inside Modal */}
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="imageUrl">Image Link (URL)</label>
                  <div className={styles.inputWrapper}>
                    <LinkIcon size={18} className={styles.inputIcon} />
                    <input
                      id="imageUrl"
                      type="url"
                      placeholder="Paste any image link (e.g., Unsplash, Pexels)..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      required
                    />
                  </div>
                  <small className={styles.helpText}>Provide a valid image URL for prompt visualization.</small>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="category">Category</label>
                    <div className={styles.inputWrapper}>
                      <Tag size={18} className={styles.inputIcon} />
                      <input
                        id="category"
                        type="text"
                        placeholder="e.g. Anime, Cyberpunk"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="title">Title</label>
                    <input
                      id="title"
                      type="text"
                      placeholder="Catchy title..."
                      className={styles.input}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="promptText">Prompt Text</label>
                  <textarea
                    id="promptText"
                    placeholder="Describe the detailed prompt keywords, settings, styles..."
                    className={`${styles.input} ${styles.textarea}`}
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className={`${styles.button} ${isEditing ? styles.btnUpdate : ""}`} 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving to MongoDB..." : isEditing ? "Save Changes" : "Create Prompt"}
                </button>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
