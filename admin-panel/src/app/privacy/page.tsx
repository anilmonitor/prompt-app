"use client";

import { Mail, ShieldCheck, Heart, Info, Globe, Eye, Server, Award } from "lucide-react";
import styles from "./privacy.module.css";

export default function PrivacyPolicy() {
  const currentYear = new Date().getFullYear();

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* Navigation / Header */}
        <header className={styles.header}>
          <div className={styles.logoRow}>
            <img src="/logo.png" alt="Trendy Baba Logo" className={styles.logoImage} />
            <span className={styles.logoText}>Trendy Baba Security</span>
          </div>
        </header>

        {/* Content Document */}
        <main className={styles.document}>
          <div className={styles.docHeader}>
            <div className={styles.badgeRow}>
              <span className={styles.badge}>Official Policy</span>
              <span className={styles.badge}>App Store Compliant</span>
            </div>
            <h1>Privacy Policy for Trendy Baba</h1>
            <p className={styles.lastUpdated}>Last updated: June 04, 2026</p>
          </div>

          <div className={styles.divider}></div>

          <section className={styles.section}>
            <p className={styles.introText}>
              Welcome to <strong>Trendy Baba</strong> (referred to as "we", "our", "us", or "the App"), 
              registered under Android package identifier <code>com.anilmonitor.trendybaba.ai.prompt</code>. 
              We operate as an AI Prompt Gallery and helper utility, allowing users to browse, search, 
              favorite, copy, and share high-performance generative prompts for AI image creation systems 
              (such as Midjourney, Stable Diffusion, DALL-E, and ChatGPT).
            </p>
            <p>
              Your privacy is of paramount importance to us. This Privacy Policy is designed to explain 
              in detail how we collect, process, and safeguard your data when you interact with our mobile 
              application. By downloading, installing, or using the Trendy Baba application, you consent to 
              the data collection, usage, and processing protocols described in this document.
            </p>
          </section>

          <section className={styles.section}>
            <h2>1. Information We Collect and How We Use It</h2>
            <p>
              We strive to collect only the absolute minimum amount of information necessary to deliver 
              a premium, functional service. Here is a granular breakdown of the data processed by our App:
            </p>
            
            <div className={styles.featureGrid}>
              <div className={styles.featureCard}>
                <Globe className={styles.featureIcon} />
                <h3>No Account Registration</h3>
                <p>
                  You are not required to create an account, log in, or provide any personal details (such as 
                  name, phone number, physical address, or password) to access the main prompt feed.
                </p>
              </div>

              <div className={styles.featureCard}>
                <Heart className={styles.featureIcon} />
                <h3>Local Favorites Storage</h3>
                <p>
                  When you "Heart" or save a prompt, this choice is saved locally on your device's sandbox 
                  using local storage (Shared Preferences). This list is private and is never uploaded to our cloud.
                </p>
              </div>

              <div className={styles.featureCard}>
                <Eye className={styles.featureIcon} />
                <h3>Anonymous Usage Telemetry</h3>
                <p>
                  To curate the most trending prompts, the App gathers anonymous event counts. This registers 
                  when any prompt is viewed, when a prompt is copied to the clipboard, or when a prompt is shared.
                </p>
              </div>

              <div className={styles.featureCard}>
                <Server className={styles.featureIcon} />
                <h3>Google Firebase Integration</h3>
                <p>
                  We fetch prompts dynamically from Cloud Firestore. Google Services automatically log device 
                  architecture, OS versions, and network status for crash logs and security rules.
                </p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>2. Specific Data Handling Details</h2>
            <ul>
              <li>
                <strong>Clipboard Copy Actions:</strong> When you press the "Copy Prompt" button, the text is copied 
                directly to your system clipboard using standard Flutter platform channels. The App records that a 
                copy event occurred for that prompt ID, but does not read or upload any other content from your clipboard.
              </li>
              <li>
                <strong>Share System Integration:</strong> When you share a prompt, we invoke the device's native sharing 
                sheet using the <code>share_plus</code> library. The App logs the event for that prompt ID anonymously, 
                but does not track who you shared it with or which application was chosen.
              </li>
              <li>
                <strong>Device State permissions:</strong> The App requires an active Network connection to fetch new 
                prompts and image previews.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. Third-Party Services and Analytics</h2>
            <p>
              The App incorporates third-party SDKs provided by Google. These platforms assist us in delivering cloud 
              data and ensuring database security. These companies may collect anonymous information in accordance with 
              their respective privacy charters:
            </p>
            
            <div className={styles.providerBox}>
              <h3>Google Firebase (Cloud Firestore & Analytics)</h3>
              <p>
                Used to sync the prompt list, store likes/views metadata, and run real-time updates. Firebase logs 
                IP addresses, mobile network status, device hardware configurations, and system versions.
              </p>
              <a 
                href="https://policies.google.com/privacy" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.extLink}
              >
                Read Google's Privacy Terms &rarr;
              </a>
            </div>
          </section>

          <section className={styles.section}>
            <h2>4. Children's Privacy Protection</h2>
            <p>
              Trendy Baba does not address and is not structured to attract anyone under the age of 13. We do not 
              knowingly collect or solicit personal identifying information from children under 13. If we discover 
              that a child under 13 has transmitted any personal data, we immediately purge this data from our 
              analytics databases. If you are a parent or guardian and are aware that your child has provided us 
              with data, please notify us immediately so that we can take corrective action.
            </p>
          </section>

          <section className={styles.section}>
            <h2>5. Data Rights (GDPR & CCPA Compliance)</h2>
            <p>
              Depending on your location, you may have specific data protection rights. In alignment with modern privacy 
              laws (GDPR, CCPA, etc.):
            </p>
            <ul>
              <li>
                <strong>Right to Deletion:</strong> Since all favorite prompts and local preferences are stored on your 
                device, you can completely erase this data at any time by clearing the App's cache/data in your Android 
                Settings or by uninstalling the application.
              </li>
              <li>
                <strong>Right to Opt-Out:</strong> You can use the App in offline mode to block all telemetry, though 
                an online connection is required to refresh and display new gallery images.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>6. Security of Your Data</h2>
            <p>
              We implement industry-standard administrative and technical security measures to protect database assets. 
              Our Firestore rules ensure that public users have read-only access, protecting your app's content from 
              unauthorized modifications. However, please be aware that no transmission method over the internet, or 
              method of electronic storage, is 100% secure, and we cannot guarantee absolute data security.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Contact and Support</h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or the security of 
              Trendy Baba, please reach out to us at our official developer contact email:
            </p>
            
            <div className={styles.contactCard}>
              <Mail className={styles.mailIcon} />
              <div className={styles.contactDetails}>
                <span>Support Representative Contact</span>
                <a href="mailto:anilarangi6@gmail.com" className={styles.mailLink}>anilarangi6@gmail.com</a>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>8. Changes to this Charter</h2>
            <p>
              We reserves the right to amend this Privacy Policy periodically. We will notify you of updates by posting 
              the modified terms on this URL. We recommend checking this document occasionally to stay informed.
            </p>
          </section>
        </main>

        {/* Footer */}
        <footer className={styles.footer}>
          <p>&copy; {currentYear} Trendy Baba. All rights reserved.</p>
          <p className={styles.love}>Made with <Heart size={12} className={styles.heartIcon} /> for AI prompt creators.</p>
        </footer>
      </div>
    </div>
  );
}
