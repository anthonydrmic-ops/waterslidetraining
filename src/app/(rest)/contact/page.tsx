"use client";

import { useEffect, useRef, useState } from "react";

export default function ContactPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const MAX_SIZE = 10 * 1024 * 1024;

  useEffect(() => {
    // Scroll reveal
    const reveals = document.querySelectorAll(".reveal");
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => revealObserver.observe(el));

    // Navbar scroll
    const navbar = document.querySelector(".navbar");
    if (navbar) {
      const onScroll = () => {
        if (window.scrollY > 60) {
          navbar.classList.add("scrolled");
        } else {
          navbar.classList.remove("scrolled");
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    // Hamburger & mobile menu
    const hamburger = document.querySelector(".hamburger");
    const mobileOverlay = document.querySelector(".mobile-menu-overlay");
    const mobileClose = document.querySelector(".mobile-menu-close");

    function openMobileMenu() {
      hamburger?.classList.add("active");
      mobileOverlay?.classList.add("active");
      document.body.style.overflow = "hidden";
    }

    function closeMobileMenu() {
      hamburger?.classList.remove("active");
      mobileOverlay?.classList.remove("active");
      document.body.style.overflow = "";
    }

    hamburger?.addEventListener("click", openMobileMenu);
    mobileClose?.addEventListener("click", closeMobileMenu);
    mobileOverlay?.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMobileMenu();
    });

    return () => {
      reveals.forEach((el) => revealObserver.unobserve(el));
    };
  }, []);

  function handleFileChange(files: FileList | null) {
    if (!files) return;
    const newFiles = [...selectedFiles];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > MAX_SIZE) {
        alert(`"${file.name}" exceeds 10 MB and was not added.`);
        continue;
      }
      if (!newFiles.some((f) => f.name === file.name && f.size === file.size)) {
        newFiles.push(file);
      }
    }
    setSelectedFiles(newFiles);
    // Sync to input
    if (fileInputRef.current) {
      const dt = new DataTransfer();
      newFiles.forEach((f) => dt.items.add(f));
      fileInputRef.current.files = dt.files;
    }
  }

  function removeFile(index: number) {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    if (fileInputRef.current) {
      const dt = new DataTransfer();
      newFiles.forEach((f) => dt.items.add(f));
      fileInputRef.current.files = dt.files;
    }
  }

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-inner">
          <a href="/" className="navbar-logo">
            <img src="/rest-assets/logo.png" alt="REST Group logo" />
            <span>REST Group</span>
          </a>
          <ul className="navbar-links">
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/training">Training</a></li>
            <li><a href="/contact" className="active">Contact</a></li>
          </ul>
          <a href="/contact" className="btn-primary">
            <span className="btn-text">Get in Touch</span>
            <span className="btn-icon btn-icon-desktop">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
            </span>
            <span className="btn-icon btn-icon-mobile">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </span>
          </a>
          <button className="hamburger" aria-label="Open menu">
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className="mobile-menu-overlay">
        <button className="mobile-menu-close" aria-label="Close menu">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <ul className="mobile-menu-links">
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/services">Services</a></li>
          <li><a href="/training">Training</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>

      {/* Page Hero */}
      <section className="page-hero">
        <div className="container reveal">
          <span className="eyebrow">Contact Us</span>
          <h1>Start a conversation</h1>
          <p>Whether you have a specific project in mind or just want to explore how we can help - we&apos;d like to hear from you.</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section">
        <div className="container" style={{ maxWidth: "700px", margin: "0 auto" }}>

          {/* Contact Form */}
          <div className="card-shell reveal">
            <div className="card-core">
              <form action="https://formsubmit.co/info@restgroup.com.au" method="POST" encType="multipart/form-data">
                <input type="hidden" name="_next" value="https://restgroup.com.au/success" />
                <input type="hidden" name="_subject" value="New enquiry from REST Group website" />
                <input type="text" name="_honey" style={{ display: "none" }} />
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Name</label>
                  <input className="form-input" type="text" id="name" name="name" placeholder="Your name" required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email</label>
                  <input className="form-input" type="email" id="email" name="email" placeholder="your@email.com" required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Phone</label>
                  <input className="form-input" type="tel" id="phone" name="phone" placeholder="Your phone number" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="organisation">Organisation</label>
                  <input className="form-input" type="text" id="organisation" name="organisation" placeholder="Your organisation" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="message">Message</label>
                  <textarea className="form-textarea" id="message" name="message" placeholder="Tell us about your project or enquiry..." required></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="attachments">Attachments</label>
                  <div
                    className="file-upload"
                    onDragEnter={(e) => { e.preventDefault(); e.currentTarget.classList.add("dragover"); }}
                    onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("dragover"); }}
                    onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove("dragover"); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove("dragover");
                      handleFileChange(e.dataTransfer.files);
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="attachments"
                      name="attachments"
                      multiple
                      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                      className="file-upload-input"
                      onChange={(e) => handleFileChange(e.target.files)}
                    />
                    <div className="file-upload-prompt">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                      <span>Drop files here or <strong>browse</strong></span>
                      <span className="file-upload-hint">Images, PDFs, documents up to 10 MB</span>
                    </div>
                    <ul className="file-upload-list">
                      {selectedFiles.map((file, i) => (
                        <li key={`${file.name}-${i}`} className="file-upload-item">
                          <span>{file.name} ({Math.round(file.size / 1024)} KB)</span>
                          <button type="button" className="file-upload-remove" onClick={() => removeFile(i)}>&times;</button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <button type="submit" className="btn-primary">
                  Send Message
                  <span className="btn-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </span>
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="reveal" style={{ textAlign: "center", marginTop: "3rem" }}>
            <h3 style={{ marginBottom: "1.5rem" }}>Other ways to reach us</h3>
            <div style={{ display: "flex", justifyContent: "center", gap: "3rem", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div className="icon-circle icon-circle--teal" style={{ marginBottom: 0, flexShrink: 0 }}>&#9990;</div>
                <p style={{ fontWeight: 600, color: "var(--navy)", fontSize: "0.92rem" }}>0411 566 208</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div className="icon-circle icon-circle--orange" style={{ marginBottom: 0, flexShrink: 0 }}>&#9993;</div>
                <p style={{ fontWeight: 600, color: "var(--navy)", fontSize: "0.92rem" }}>info@restgroup.com.au</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="/" className="footer-logo">
              <img src="/rest-assets/logo.png" alt="REST Group logo" />
              <span>REST Group</span>
            </a>
            <p>Specialist consultancy for the Recreation, Entertainment, Sport and Tourism sector across Asia Pacific.</p>
          </div>
          <div>
            <h5>Company</h5>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/training">Training</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div>
            <h5>Contact</h5>
            <ul className="footer-links">
              <li><a href="tel:0411566208">0411 566 208</a></li>
              <li><a href="mailto:info@restgroup.com.au">info@restgroup.com.au</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 REST Group Asia Pacific Pty Ltd</p>
        </div>
      </footer>
    </>
  );
}
