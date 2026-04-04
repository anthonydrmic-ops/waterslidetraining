"use client";

import { useEffect } from "react";

export default function AboutPage() {
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
            <li><a href="/about" className="active">About</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/training">Training</a></li>
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

      {/* Page Hero */}
      <section className="page-hero" style={{ textAlign: "center" }}>
        <div className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span className="eyebrow reveal">About Us</span>
          <h1 className="reveal reveal-delay-1">Built for the REST sector</h1>
          <p className="reveal reveal-delay-2">We are a specialist consultancy focused exclusively on assurance, risk advisory and asset performance for Recreation, Entertainment, Sport and Tourism.</p>
        </div>
      </section>

      {/* Section 1: Who We Are */}
      <section className="section">
        <div className="container">
          <div className="reveal" style={{ maxWidth: "750px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span className="eyebrow" style={{ marginBottom: "1.5rem" }}>Who We Are</span>
            <h2 style={{ marginTop: "1.5rem", marginBottom: "1.5rem", textAlign: "center" }}>We advise it, audit it, and get our hands dirty fixing it</h2>
            <p style={{ marginBottom: "1.25rem", textAlign: "justify", alignSelf: "stretch" }}>We are practitioners with deep sector experience, not generalists learning your industry on the job. Our team has spent decades working within and alongside REST sector organisations, giving us an understanding that cannot be replicated by broad-spectrum consultancies.</p>
            <p style={{ textAlign: "justify", alignSelf: "stretch" }}>We understand the unique demands of aquatic centres, theme parks, ski resorts, sports venues and the complex environments in which they operate. That is why organisations trust us to provide advice that is relevant, realistic and actionable.</p>
          </div>
        </div>
      </section>

      {/* Section 2: What REST Means */}
      <section className="section section--cream">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "4rem" }} className="reveal">
            <span className="eyebrow">Our Focus</span>
            <h2 style={{ marginTop: "1.5rem", marginBottom: "1.5rem", fontSize: "clamp(2.5rem, 5vw, 3.5rem)", letterSpacing: "0.15em" }}>R.E.S.T.</h2>
          </div>
          <div className="bento-grid bento-grid--2">
            <div className="card-shell reveal reveal-delay-1">
              <div className="card-core">
                <h3 style={{ marginBottom: "0.75rem" }}>Recreation</h3>
                <p>Aquatic and leisure facilities, adventure parks, gyms, climbing centres, water parks and community recreation facilities.</p>
              </div>
            </div>
            <div className="card-shell reveal reveal-delay-2">
              <div className="card-core">
                <h3 style={{ marginBottom: "0.75rem" }}>Entertainment</h3>
                <p>Attractions, rides, arenas, theatres, restaurants, casinos, cinemas, venues.</p>
              </div>
            </div>
            <div className="card-shell reveal reveal-delay-3">
              <div className="card-core">
                <h3 style={{ marginBottom: "0.75rem" }}>Sport</h3>
                <p>Stadiums, training facilities, golf courses, racecourses, sports infrastructure.</p>
              </div>
            </div>
            <div className="card-shell reveal reveal-delay-4">
              <div className="card-core">
                <h3 style={{ marginBottom: "0.75rem" }}>Tourism</h3>
                <p>Theme parks, hotels, resorts, ski fields, holiday parks, marinas, zoos and wildlife parks, alpine facilities, coastal infrastructure.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section section--navy section--lg">
        <div className="container" style={{ textAlign: "center" }}>
          <div className="reveal">
            <h2 style={{ color: "var(--white)", marginBottom: "1.5rem" }}>Ready to work with specialists?</h2>
            <p style={{ color: "rgba(255, 255, 255, 0.65)", margin: "0 auto 2.5rem", maxWidth: "50ch" }}>Talk to us about how REST Group can support your organisation with independent assurance, risk advisory and asset performance.</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
              <a href="/contact" className="btn-primary">
                Get in Touch
                <span className="btn-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </span>
              </a>
              <a href="/services" className="btn-secondary btn-secondary--light">View Our Services</a>
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
