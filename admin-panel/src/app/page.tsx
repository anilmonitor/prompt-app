"use client";

import { useState, useEffect } from "react";
import { Sun, Moon, Link as LinkIcon, Trash2 } from "lucide-react";
import styles from "./page.module.css";
import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";

interface PromptItem {
  id: string;
  imageUrl: string;
  title: string;
  category: string;
  promptText: string; 
  createdAt?: any;
}


export default function AdminDashboard() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [promptText, setPromptText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [prompts, setPrompts] = useState<PromptItem[]>([]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      alert("Please provide an image link.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Save Document directly to Firestore using the provided Image URL
      await addDoc(collection(db, "prompts"), {
        imageUrl: imageUrl,
        title,
        category,
        promptText,
        createdAt: new Date(),
      });

      // Reset Form
      setTitle("");
      setCategory("");
      setPromptText("");
      setImageUrl("");
      
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to save prompt.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this prompt?");
    if (!confirmed) return;

    try {
      // Delete from Firestore
      await deleteDoc(doc(db, "prompts", id));
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("Failed to delete prompt.");
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.titleGroup}>
            <h1>Prompt Gallery Admin</h1>
            <p>Manage your dynamic app content</p>
          </div>
          <button onClick={toggleTheme} className={styles.themeToggle}>
            {theme === "dark" ? (
              <><Sun size={18} /> Light Mode</>
            ) : (
              <><Moon size={18} /> Dark Mode</>
            )}
          </button>
        </header>

        <div className={styles.mainGrid}>
          {/* Left Column: Form */}
          <section className={styles.card}>
            <h2>Add New Prompt</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Image Link (URL)</label>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-color)', borderRadius: '12px', padding: '0 12px', border: '1px solid var(--border-color)' }}>
                  <LinkIcon size={20} style={{ color: "var(--primary)", marginRight: '8px' }} />
                  <input
                    type="url"
                    placeholder="Paste any image link from Google..."
                    style={{ border: 'none', background: 'transparent', flex: 1, padding: '14px 0', color: 'var(--text-color)', outline: 'none' }}
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    required
                  />
                </div>
                <small style={{ opacity: 0.6, display: 'block', marginTop: '6px' }}>Example: https://images.unsplash.com/photo-123...</small>
              </div>

              <div className={styles.formGroup}>
                <label>Category</label>
                <input
                  type="text"
                  placeholder="e.g., Cyberpunk, Fantasy"
                  className={styles.input}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Title</label>
                <input
                  type="text"
                  placeholder="A catchy title..."
                  className={styles.input}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Prompt Text</label>
                <textarea
                  placeholder="The detailed AI prompt..."
                  className={`${styles.input} ${styles.textarea}`}
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className={styles.button} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Prompt"}
              </button>
            </form>
          </section>

          {/* Right Column: List of Prompts */}
          <section>
            <h2 className={styles.sectionTitle}>Current Prompts ({prompts.length})</h2>
            <div className={styles.promptList}>
              {prompts.length === 0 ? (
                <p style={{ opacity: 0.7 }}>No prompts uploaded yet. Add one to see it here!</p>
              ) : (
                prompts.map((item) => (
                  <div key={item.id} className={styles.promptCard}>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className={styles.imagePreview}
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+Image+Link' }}
                    />
                    <div className={styles.cardContent}>
                      <span className={styles.categoryBadge}>{item.category}</span>
                      <h3 className={styles.cardTitle}>{item.title}</h3>
                      <p className={styles.cardPrompt}>{item.promptText}</p>
                      <button 
                        className={styles.deleteBtn} 
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 size={16} style={{ marginRight: '6px' }} /> Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
