"use client";

import { useEffect, useState, useRef } from "react";

export default function TrainingLandingPage() {
  const [showPasswordBox, setShowPasswordBox] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showPasswordBox && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showPasswordBox]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "godaddysucks") {
      window.location.href = "/training/slidesure";
    } else {
      setError(true);
      setPassword("");
      setTimeout(() => setError(false), 2000);
    }
  };

  useEffect(() => {
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
            <li><a href="/training" className="active">Training</a></li>
            <li><a href="/contact">Contact</a></li>
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

      {/* Mobile Menu Overlay */}
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

      <main>
        {/* Page Hero */}
        <section className="page-hero" style={{ textAlign: "center" }}>
          <div className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span className="eyebrow reveal">Professional Development</span>
            <h1 className="reveal reveal-delay-1">Training &amp; Certification</h1>
            <p className="reveal reveal-delay-2">Standards-aligned training programs built by industry specialists for the Recreation, Entertainment, Sport and Tourism sector.</p>
          </div>
        </section>

        {/* Coming Soon Section */}
        <section className="section">
          <div className="container">
            <div className="reveal" style={{ textAlign: "center", marginBottom: "4rem" }}>
              <span className="eyebrow">Coming Soon</span>
              <h2 style={{ marginTop: "1.5rem", marginBottom: "1rem" }}>We&apos;re building something great</h2>
              <p style={{ maxWidth: "55ch", margin: "0 auto" }}>Our comprehensive training and certification platform is currently under development. Stay tuned for industry-leading courses designed to elevate your team&apos;s capabilities.</p>
            </div>

            <div className="bento-grid bento-grid--3">
              {/* SlideSure - Coming Soon */}
              <div className="card-shell reveal reveal-delay-1" style={{ opacity: 0.6 }}>
                <div className="card-core" style={{ display: "flex", flexDirection: "column", minHeight: "340px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <div className="icon-circle icon-circle--teal" style={{ marginBottom: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <span style={{ display: "inline-flex", alignItems: "center", padding: "0.2rem 0.6rem", borderRadius: "100px", background: "rgba(107, 114, 128, 0.08)", border: "1px solid rgba(107, 114, 128, 0.12)", fontSize: "0.6rem", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.15em", color: "#6B7280" }}>Coming Soon</span>
                  </div>
                  <h3 style={{ marginBottom: "0.75rem" }}>SlideSure - Waterslide Safety &amp; Competency</h3>
                  <p style={{ flex: 1 }}>Comprehensive waterslide operator training covering system understanding, inspections, surface management, water quality, incident prevention and emergency response.</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1.5rem" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.35rem 0.75rem", borderRadius: "100px", background: "rgba(107, 114, 128, 0.04)", border: "1px solid rgba(107, 114, 128, 0.08)", fontSize: "0.75rem", color: "var(--mid-grey)" }}>In Development</span>
                  </div>
                </div>
              </div>

              {/* Coming Soon - Emergency Planning & Response */}
              <div className="card-shell reveal reveal-delay-2" style={{ opacity: 0.6 }}>
                <div className="card-core" style={{ display: "flex", flexDirection: "column", minHeight: "340px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <div className="icon-circle icon-circle--orange" style={{ marginBottom: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    </div>
                    <span style={{ display: "inline-flex", alignItems: "center", padding: "0.2rem 0.6rem", borderRadius: "100px", background: "rgba(107, 114, 128, 0.08)", border: "1px solid rgba(107, 114, 128, 0.12)", fontSize: "0.6rem", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.15em", color: "#6B7280" }}>Coming Soon</span>
                  </div>
                  <h3 style={{ marginBottom: "0.75rem" }}>Emergency Planning &amp; Response</h3>
                  <p style={{ flex: 1 }}>Structured emergency planning training aligned to AS 3745 with a leisure industry focus. Covers emergency procedures, evacuation planning and incident response for aquatics, stadiums, parks, attractions and tourism sites.</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1.5rem" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.35rem 0.75rem", borderRadius: "100px", background: "rgba(107, 114, 128, 0.04)", border: "1px solid rgba(107, 114, 128, 0.08)", fontSize: "0.75rem", color: "var(--mid-grey)" }}>AS 3745 Aligned</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.35rem 0.75rem", borderRadius: "100px", background: "rgba(107, 114, 128, 0.04)", border: "1px solid rgba(107, 114, 128, 0.08)", fontSize: "0.75rem", color: "var(--mid-grey)" }}>In Development</span>
                  </div>
                </div>
              </div>

              {/* Coming Soon - Entertainment Staging & Rigging */}
              <div className="card-shell reveal reveal-delay-3" style={{ opacity: 0.6 }}>
                <div className="card-core" style={{ display: "flex", flexDirection: "column", minHeight: "340px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <div className="icon-circle icon-circle--navy" style={{ marginBottom: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                    </div>
                    <span style={{ display: "inline-flex", alignItems: "center", padding: "0.2rem 0.6rem", borderRadius: "100px", background: "rgba(107, 114, 128, 0.08)", border: "1px solid rgba(107, 114, 128, 0.12)", fontSize: "0.6rem", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.15em", color: "#6B7280" }}>Coming Soon</span>
                  </div>
                  <h3 style={{ marginBottom: "0.75rem" }}>Entertainment Staging &amp; Rigging</h3>
                  <p style={{ flex: 1 }}>Arena operations and technical rigging fundamentals for arena crew, riggers and event technicians. Covers CAD map interpretation, thrust calculations, SR/SR ratings, staging safety and interfacing with touring production teams.</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1.5rem" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.35rem 0.75rem", borderRadius: "100px", background: "rgba(107, 114, 128, 0.04)", border: "1px solid rgba(107, 114, 128, 0.08)", fontSize: "0.75rem", color: "var(--mid-grey)" }}>In Development</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notify CTA */}
            <div className="reveal reveal-delay-2" style={{ textAlign: "center", marginTop: "3rem" }}>
              <p style={{ color: "var(--mid-grey)", fontSize: "0.95rem" }}>Want to be notified when our training programs launch?</p>
              <a href="/contact" className="btn-primary" style={{ marginTop: "1rem", display: "inline-flex" }}>
                Register Your Interest
                <span className="btn-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* Why REST Training */}
        <section className="section section--cream">
          <div className="container">
            <div className="reveal" style={{ textAlign: "center", marginBottom: "3rem" }}>
              <span className="eyebrow">Why Choose Us</span>
              <h2 style={{ marginTop: "1.5rem", marginBottom: "1rem" }}>Training built by practitioners</h2>
              <p style={{ maxWidth: "55ch", margin: "0 auto" }}>Our courses are developed by industry specialists with decades of hands-on experience in the REST sector.</p>
            </div>
            <div className="bento-grid bento-grid--3">
              <div className="card-shell reveal reveal-delay-1">
                <div className="card-core">
                  <div className="icon-circle icon-circle--teal">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                  </div>
                  <h3 style={{ marginBottom: "0.75rem" }}>Standards-Aligned</h3>
                  <p>All content references current Australian Standards, WHS legislation and industry best practice.</p>
                </div>
              </div>
              <div className="card-shell reveal reveal-delay-2">
                <div className="card-core">
                  <div className="icon-circle icon-circle--orange">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </div>
                  <h3 style={{ marginBottom: "0.75rem" }}>Verified Competency</h3>
                  <p>Rigorous assessments with 80% pass thresholds ensure genuine understanding, not just completion.</p>
                </div>
              </div>
              <div className="card-shell reveal reveal-delay-3">
                <div className="card-core">
                  <div className="icon-circle icon-circle--navy">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <h3 style={{ marginBottom: "0.75rem" }}>Team Management</h3>
                  <p>Purchase team licenses and track your staff completion progress through the admin dashboard.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="section section--navy section--lg">
          <div className="container reveal" style={{ textAlign: "center" }}>
            <span className="eyebrow eyebrow--light">Questions?</span>
            <h2 style={{ color: "var(--white)", marginTop: "1rem", marginBottom: "1rem" }}>Need a custom training program?</h2>
            <p style={{ color: "rgba(255,255,255,0.65)", margin: "0 auto 2.5rem", maxWidth: "55ch" }}>We develop bespoke training and capability programs tailored to your organisation&apos;s specific needs and assets.</p>
            <a href="/contact" className="btn-primary">
              Get in Touch
              <span className="btn-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </span>
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="/" className="footer-logo">
              <img src="/rest-assets/logo.png" alt="REST Group logo" />
              <span>REST Group</span>
            </a>
            <p>Specialist assurance, risk advisory and asset performance services for the Recreation, Entertainment, Sport and Tourism sector across Asia Pacific.</p>
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

      {/* Dev Tools Button - bottom right corner */}
      <a
        href="/train"
        style={{
          position: "fixed",
          bottom: "1rem",
          right: "5.5rem",
          padding: "0.4rem 0.8rem",
          fontSize: "0.65rem",
          fontWeight: 500,
          color: "rgba(107, 114, 128, 0.4)",
          background: "transparent",
          border: "1px solid rgba(107, 114, 128, 0.15)",
          borderRadius: "6px",
          cursor: "pointer",
          letterSpacing: "0.05em",
          transition: "all 0.3s ease",
          zIndex: 50,
          textDecoration: "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "rgba(107, 114, 128, 0.7)";
          e.currentTarget.style.borderColor = "rgba(107, 114, 128, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "rgba(107, 114, 128, 0.4)";
          e.currentTarget.style.borderColor = "rgba(107, 114, 128, 0.15)";
        }}
      >
        Dev
      </a>

      {/* Admin Button - bottom right corner */}
      <button
        onClick={() => setShowPasswordBox(true)}
        style={{
          position: "fixed",
          bottom: "1rem",
          right: "1rem",
          padding: "0.4rem 0.8rem",
          fontSize: "0.65rem",
          fontWeight: 500,
          color: "rgba(107, 114, 128, 0.4)",
          background: "transparent",
          border: "1px solid rgba(107, 114, 128, 0.15)",
          borderRadius: "6px",
          cursor: "pointer",
          letterSpacing: "0.05em",
          transition: "all 0.3s ease",
          zIndex: 50,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "rgba(107, 114, 128, 0.7)";
          e.currentTarget.style.borderColor = "rgba(107, 114, 128, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "rgba(107, 114, 128, 0.4)";
          e.currentTarget.style.borderColor = "rgba(107, 114, 128, 0.15)";
        }}
      >
        Admin
      </button>

      {/* Password Dialog */}
      {showPasswordBox && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            backdropFilter: "blur(4px)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowPasswordBox(false);
              setPassword("");
              setError(false);
            }
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              background: "var(--white, #fff)",
              borderRadius: "16px",
              padding: "2rem",
              width: "100%",
              maxWidth: "360px",
              margin: "0 1rem",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--charcoal, #1A1A1A)", margin: 0, fontFamily: "var(--font-body)" }}>Admin Access</h3>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordBox(false);
                  setPassword("");
                  setError(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                  color: "var(--mid-grey, #6B7280)",
                  fontSize: "1.2rem",
                  lineHeight: 1,
                }}
              >
                &times;
              </button>
            </div>
            <input
              ref={inputRef}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: `1.5px solid ${error ? "#ef4444" : "rgba(107, 114, 128, 0.2)"}`,
                borderRadius: "10px",
                fontSize: "0.875rem",
                outline: "none",
                fontFamily: "var(--font-body)",
                boxSizing: "border-box",
                transition: "border-color 0.2s ease",
                background: error ? "rgba(239, 68, 68, 0.04)" : "transparent",
              }}
            />
            {error && (
              <p style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.5rem", marginBottom: 0 }}>
                Incorrect password
              </p>
            )}
            <button
              type="submit"
              style={{
                width: "100%",
                marginTop: "1rem",
                padding: "0.75rem",
                background: "var(--navy, #0B3A66)",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                transition: "background 0.2s ease",
              }}
            >
              Continue
            </button>
          </form>
        </div>
      )}
    </>
  );
}
