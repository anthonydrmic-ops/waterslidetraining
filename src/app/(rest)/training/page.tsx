"use client";

import { useEffect } from "react";

export default function TrainingLandingPage() {
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
              <span className="eyebrow">Our Courses</span>
              <h2 style={{ marginTop: "1.5rem", marginBottom: "1rem" }}>Training programs</h2>
              <p style={{ maxWidth: "55ch", margin: "0 auto" }}>SlideSure, our waterslide safety and competency program, is available now. More industry-leading courses are in development - register your interest to hear the moment they launch.</p>
            </div>

            <style>{`
              .ss-live-card { transition: transform .4s cubic-bezier(0.32,0.72,0,1), box-shadow .4s ease; }
              .ss-live-card:hover { transform: translateY(-5px) scale(1.012); box-shadow: 0 18px 42px rgba(22,163,74,0.22); }
              .ss-live-card .card-core { transition: background .35s ease; }
              .ss-live-card:hover .card-core { background: linear-gradient(180deg, rgba(16,185,129,0.08), rgba(16,185,129,0.015)); }
              .ss-live-card .ss-badge { transition: transform .3s ease; }
              .ss-live-card:hover .ss-badge { transform: scale(1.06); }
              .ss-live-card .ss-cta { color: var(--teal, #1F7A8C); transition: color .3s ease; }
              .ss-live-card:hover .ss-cta { color: #16a34a; }
              .ss-live-card .ss-cta svg { transition: transform .3s ease; }
              .ss-live-card:hover .ss-cta svg { transform: translateX(4px); }
              .ss-live-card .ss-hover-text { display: none; }
              .ss-live-card:hover .ss-default-text { display: none; }
              .ss-live-card:hover .ss-hover-text { display: inline; }
            `}</style>
            <div className="bento-grid bento-grid--3">
              {/* SlideSure - Available Now */}
              <a href="/training/slidesure" className="card-shell reveal reveal-delay-1 ss-live-card" style={{ display: "block", textDecoration: "none", color: "inherit", cursor: "pointer" }}>
                <div className="card-core" style={{ display: "flex", flexDirection: "column", minHeight: "340px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <div className="icon-circle icon-circle--teal" style={{ marginBottom: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <span className="ss-badge" style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.2rem 0.6rem", borderRadius: "100px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.25)", fontSize: "0.6rem", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.15em", color: "#059669" }}>Available Now</span>
                  </div>
                  <h3 style={{ marginBottom: "0.75rem" }}>SlideSure - Waterslide Safety &amp; Competency Program</h3>
                  <p style={{ flex: 1 }}>Comprehensive waterslide operator training covering system understanding, inspections, surface management, water quality, incident prevention and emergency response.</p>
                  <div className="ss-cta" style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "1.5rem", fontWeight: 600, fontSize: "0.85rem" }}>
                    <span className="ss-default-text">View Course</span>
                    <span className="ss-hover-text">Course Available</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </div>
                </div>
              </a>

              {/* Coming Soon - details hidden until launch */}
              <div className="card-shell reveal reveal-delay-2" style={{ opacity: 0.55 }}>
                <div className="card-core" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", minHeight: "340px" }}>
                  <div className="icon-circle" style={{ marginBottom: "1rem", background: "rgba(107, 114, 128, 0.08)", color: "#6B7280" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <span style={{ display: "inline-flex", alignItems: "center", padding: "0.2rem 0.6rem", borderRadius: "100px", background: "rgba(107, 114, 128, 0.08)", border: "1px solid rgba(107, 114, 128, 0.12)", fontSize: "0.6rem", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.15em", color: "#6B7280" }}>Coming Soon</span>
                  <h3 style={{ marginTop: "1rem", marginBottom: "0.4rem", color: "var(--mid-grey)" }}>New Program</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--mid-grey)", maxWidth: "26ch" }}>In development. Details to be announced.</p>
                </div>
              </div>

              {/* Coming Soon - details hidden until launch */}
              <div className="card-shell reveal reveal-delay-3" style={{ opacity: 0.55 }}>
                <div className="card-core" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", minHeight: "340px" }}>
                  <div className="icon-circle" style={{ marginBottom: "1rem", background: "rgba(107, 114, 128, 0.08)", color: "#6B7280" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <span style={{ display: "inline-flex", alignItems: "center", padding: "0.2rem 0.6rem", borderRadius: "100px", background: "rgba(107, 114, 128, 0.08)", border: "1px solid rgba(107, 114, 128, 0.12)", fontSize: "0.6rem", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.15em", color: "#6B7280" }}>Coming Soon</span>
                  <h3 style={{ marginTop: "1rem", marginBottom: "0.4rem", color: "var(--mid-grey)" }}>New Program</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--mid-grey)", maxWidth: "26ch" }}>In development. Details to be announced.</p>
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
            <p style={{ color: "rgba(255,255,255,0.65)", margin: "0 auto 1rem", maxWidth: "55ch" }}>We develop bespoke training and capability programs tailored to your organisation&apos;s specific needs and assets.</p>
            <p style={{ color: "rgba(255,255,255,0.55)", margin: "0 auto 2.5rem", maxWidth: "55ch", fontSize: "0.95rem" }}>Already training with us? If you spot something or have feedback on a course, we&apos;d genuinely love to hear it - your input is valued and helps shape how these programs evolve.</p>
            <a href="/contact" className="btn-primary">
              Get in Touch
              <span className="btn-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </span>
            </a>
          </div>
        </section>

        {/* Currency of content disclaimer */}
        <section className="section" style={{ paddingTop: "2.5rem", paddingBottom: "2.5rem", borderTop: "1px solid rgba(107,114,128,0.14)" }}>
          <div className="container reveal" style={{ maxWidth: "76ch", margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontSize: "0.8rem", lineHeight: 1.75, color: "rgba(107,114,128,0.95)", margin: 0 }}>
              <strong style={{ color: "#4B5563", fontWeight: 600 }}>Currency of content.</strong> Every course on this platform reflects the Australian Standards, work health and safety legislation and regulatory guidance in force at the time of publication. As those standards are revised and the regulatory landscape evolves, our training is subject to ongoing review and may be amended or updated accordingly. Material is provided to support operator competency and should always be read alongside the current instruments and the direction of your relevant regulator.
            </p>
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
              <li><a href="/terms">Terms &amp; Conditions</a></li>
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
