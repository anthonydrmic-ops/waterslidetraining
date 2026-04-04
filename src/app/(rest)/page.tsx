"use client";

import { useEffect } from "react";

export default function HomePage() {
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

    // Hero video blur + crash title
    const heroVideo = document.querySelector(".hero-video") as HTMLVideoElement | null;
    const heroVideoWrap = document.querySelector(".hero-video-wrap");
    const crashTitle = document.querySelector(".hero-crash-title");

    if (heroVideo) {
      let blurStarted = false;

      const playPromise = heroVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          if (heroVideoWrap) heroVideoWrap.classList.add("video-failed");
          if (crashTitle) crashTitle.classList.add("crash-in");
        });
      }

      function animateBlur() {
        if (!heroVideo) return;
        const timeLeft = heroVideo.duration - heroVideo.currentTime;
        if (timeLeft <= 0) {
          heroVideo.style.filter = "blur(12px)";
          return;
        }
        const progress = 1 - timeLeft / 1.5;
        heroVideo.style.filter = `blur(${Math.max(0, progress * 12)}px)`;
        requestAnimationFrame(animateBlur);
      }

      heroVideo.addEventListener("timeupdate", () => {
        if (blurStarted) return;
        const timeLeft = heroVideo.duration - heroVideo.currentTime;
        if (timeLeft <= 1.5) {
          blurStarted = true;
          heroVideo.style.willChange = "filter";
          requestAnimationFrame(animateBlur);
          if (crashTitle) crashTitle.classList.add("crash-in");
        }
      });

      heroVideo.addEventListener("ended", () => {
        heroVideo.style.filter = "blur(12px)";
        heroVideo.style.willChange = "auto";
        if (crashTitle && !crashTitle.classList.contains("crash-in")) {
          crashTitle.classList.add("crash-in");
        }
      });

      setTimeout(() => {
        if (crashTitle && !crashTitle.classList.contains("crash-in")) {
          crashTitle.classList.add("crash-in");
        }
      }, 8000);
    } else {
      if (crashTitle) crashTitle.classList.add("crash-in");
    }

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
            <li><a href="/" className="active">Home</a></li>
            <li><a href="/about">About</a></li>
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

      <main>
        {/* Hero */}
        <section className="hero">
          <div className="hero-bg"></div>
          <div className="hero-video-wrap">
            <video className="hero-video" autoPlay muted playsInline preload="auto" disablePictureInPicture>
              <source src="/rest-assets/hero-video.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="hero-content">
            <span className="hero-crash-title">REST GROUP</span>
            <h1>Move beyond compliance.<br />Operate with <em>assurance</em>.</h1>
            <p className="hero-description">REST Group delivers independent assurance, risk advisory and asset performance services for the Recreation, Entertainment, Sport and Tourism sector across Asia Pacific.</p>
            <div className="hero-actions">
              <a href="/services" className="btn-primary">
                Explore Our Services
                <span className="btn-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* What We Do Cards */}
        <section className="section section--cream section--cards-only">
          <div className="container">
            <div className="bento-grid bento-grid--3">
              <a href="/services#assurance" className="card-shell card-shell--link reveal reveal-delay-1">
                <div className="card-core">
                  <div className="icon-circle icon-circle--teal">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                  </div>
                  <h3>Assurance &amp; Advisory</h3>
                  <p>Independent reviews, governance assessments and strategic advisory.</p>
                </div>
              </a>

              <a href="/services#risk" className="card-shell card-shell--link reveal reveal-delay-2">
                <div className="card-core">
                  <div className="icon-circle icon-circle--orange">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </div>
                  <h3>Risk &amp; Safety</h3>
                  <p>Safety audits and operational risk assessments that go beyond tick-the-box.</p>
                </div>
              </a>

              <a href="/services#asset" className="card-shell card-shell--link reveal reveal-delay-3">
                <div className="card-core">
                  <div className="icon-circle icon-circle--navy">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 3h-8l-2 4h12l-2-4z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
                  </div>
                  <h3>Asset Performance</h3>
                  <p>Condition assessments, lifecycle strategy and maintenance planning.</p>
                </div>
              </a>

              <a href="/services#maintenance" className="card-shell card-shell--link reveal reveal-delay-4">
                <div className="card-core">
                  <div className="icon-circle icon-circle--teal">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                  </div>
                  <h3>Maintenance &amp; Remediation</h3>
                  <p>Coordination, surface restoration and structural remediation.</p>
                </div>
              </a>

              <a href="/services#waterslide" className="card-shell card-shell--link reveal reveal-delay-5">
                <div className="card-core">
                  <div className="icon-circle icon-circle--orange">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/><path d="M8 12c0-2 1-4 4-4s4 2 4 4-1 4-4 4"/><path d="M12 16v2"/><path d="M12 6v2"/></svg>
                  </div>
                  <h3>Waterslide Protection</h3>
                  <p>Protection plans, surface assessment and refurbishment coordination.</p>
                </div>
              </a>

              <a href="/services#design" className="card-shell card-shell--link reveal" style={{ transitionDelay: "0.5s" }}>
                <div className="card-core">
                  <div className="icon-circle icon-circle--navy">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                  </div>
                  <h3>Design &amp; Operational Advisory</h3>
                  <p>Expert input at design stage and during operations to optimise outcomes.</p>
                </div>
              </a>

              <a href="/services#training" className="card-shell card-shell--link reveal" style={{ transitionDelay: "0.6s" }}>
                <div className="card-core">
                  <div className="icon-circle icon-circle--teal">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <h3>Training &amp; Capability</h3>
                  <p>Workshops, competency development and knowledge transfer.</p>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* Common Problems */}
        <section className="section section--cream">
          <div className="container">
            <div className="reveal" style={{ marginBottom: "2.5rem" }}>
              <span className="eyebrow">Sound Familiar?</span>
              <h2 style={{ marginTop: "1rem", marginBottom: "1rem" }}>The problems we solve</h2>
              <p>Systemic challenges across the REST sector - driven by fragmented advice, reactive cultures and a lack of specialist capability.</p>
            </div>
            <div className="reveal">
              <ul className="problems-list">
                <li>Ageing infrastructure with no clear lifecycle plan</li>
                <li>Compliance-focused audits that miss real operational risk</li>
                <li>Reactive maintenance driving up costs and downtime</li>
                <li>Lack of independent oversight on safety-critical assets</li>
                <li>Knowledge gaps in specialist ride and attraction systems</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="section section--navy section--lg">
          <div className="container reveal" style={{ textAlign: "center" }}>
            <span className="eyebrow eyebrow--light">Ready to start?</span>
            <h2 style={{ color: "var(--white)", marginTop: "1rem", marginBottom: "1rem" }}>Let&apos;s build confidence in your operations</h2>
            <p style={{ color: "rgba(255,255,255,0.65)", margin: "0 auto 2.5rem", maxWidth: "55ch" }}>Whether you need an independent review, a maintenance plan, or specialist advisory - we&apos;re ready to help.</p>
            <a href="/contact" className="btn-primary">
              Start a Conversation
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
    </>
  );
}
