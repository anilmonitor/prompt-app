"use client";

import { useState, useEffect } from "react";
import { 
  Sun, 
  Moon, 
  Link as LinkIcon, 
  Trash2, 
  Search, 
  Edit2, 
  X, 
  FileText, 
  LayoutDashboard, 
  Tag, 
  Plus, 
  AlertCircle 
} from "lucide-react";
import styles from "./page.module.css";
import { db } from "../lib/firebase";
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy 
} from "firebase/firestore";
import Link from "next/link";

interface PromptItem {
  id: string;
  imageUrl: string;
  title: string;
  category: string;
  promptText: string; 
  createdAt?: any;
}

export default function AdminDashboard() {
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
  const [theme, setTheme] = useState("dark");
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Fetch prompts in real-time
  useEffect(() => {
    const q = query(collection(db, "prompts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPrompts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PromptItem[];
      setPrompts(fetchedPrompts);
    });
    return () => unsubscribe();
  }, []);

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
        // Update existing prompt
        const promptDocRef = doc(db, "prompts", editingId);
        await updateDoc(promptDocRef, {
          imageUrl,
          title,
          category: category.trim(),
          promptText,
        });
      } else {
        // Save new Document directly to Firestore
        await addDoc(collection(db, "prompts"), {
          imageUrl: imageUrl,
          title,
          category: category.trim(),
          promptText,
          createdAt: new Date(),
        });
      }

      handleCloseModal();
      
    } catch (error) {
      console.error("Error saving document: ", error);
      alert("Failed to save prompt.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this prompt?");
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "prompts", id));
      if (isEditing && editingId === id) {
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("Failed to delete prompt.");
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
            <p>Manage prompts & configure privacy settings for your mobile app</p>
          </div>
          
          <div className={styles.headerActions}>
            <Link href="/privacy" className={styles.privacyLink}>
              <FileText size={18} />
              <span className={styles.privacyTextFull}>Privacy Policy</span>
              <span className={styles.privacyTextMobile}>Privacy</span>
            </Link>
            
            <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle Theme">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              <span className={styles.toggleText}>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </button>
          </div>
        </header>

        {/* Dashboard Main Content */}
        <main className={styles.mainLayout}>
          
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
          {filteredPrompts.length === 0 ? (
            <div className={styles.emptyState}>
              <AlertCircle size={40} className={styles.emptyIcon} />
              <h3>No Prompts Found</h3>
              <p>Try adjusting your search keywords or select a different category filter.</p>
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
                  {isSubmitting ? "Processing..." : isEditing ? "Save Changes" : "Create Prompt"}
                </button>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
