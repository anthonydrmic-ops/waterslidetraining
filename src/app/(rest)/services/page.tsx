"use client";

import { useEffect } from "react";

export default function ServicesPage() {
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
            <li><a href="/about">About</a></li>
            <li><a href="/services" className="active">Services</a></li>
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
        {/* Page Hero */}
        <section className="page-hero">
          <div className="container">
            <span className="eyebrow reveal">Our Services</span>
            <h1 className="reveal reveal-delay-1">What we deliver</h1>
            <p className="reveal reveal-delay-2">Specialist services spanning assurance, risk, asset performance and maintenance - tailored for the unique demands of the REST sector.</p>
          </div>
        </section>

        {/* Services List */}
        <section className="section">
          <div className="container services-stack">

            <div id="assurance" className="card-shell reveal">
              <div className="card-core">
                <div className="icon-circle icon-circle--teal">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                </div>
                <h3>Assurance &amp; Advisory</h3>
                <p>Independent assurance to give boards, executives and regulators confidence.</p>
                <ul className="service-list">
                  <li>Independent assurance reviews</li>
                  <li>Governance framework assessments</li>
                  <li>Regulatory compliance reviews</li>
                  <li>Board and executive advisory</li>
                  <li>Due diligence assessments</li>
                </ul>
              </div>
            </div>

            <div id="risk" className="card-shell reveal">
              <div className="card-core">
                <div className="icon-circle icon-circle--orange">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <h3>Risk &amp; Safety</h3>
                <p>Identifying and managing risk across operations, safety systems and infrastructure.</p>
                <ul className="service-list">
                  <li>Safety audit programs</li>
                  <li>Operational risk assessments</li>
                  <li>Hazard identification studies</li>
                  <li>Incident investigation support</li>
                  <li>Safety management system reviews</li>
                </ul>
              </div>
            </div>

            <div id="asset" className="card-shell reveal">
              <div className="card-core">
                <div className="icon-circle icon-circle--navy">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 3h-8l-2 4h12l-2-4z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
                </div>
                <h3>Asset Performance &amp; Lifecycle</h3>
                <p>Maximising the life, safety and return on your physical assets.</p>
                <ul className="service-list">
                  <li>Asset condition assessments</li>
                  <li>Lifecycle cost modelling</li>
                  <li>Maintenance strategy development</li>
                  <li>Capital works planning</li>
                  <li>Performance benchmarking</li>
                </ul>
              </div>
            </div>

            <div id="maintenance" className="card-shell reveal">
              <div className="card-core">
                <div className="icon-circle icon-circle--teal">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                </div>
                <h3>Maintenance &amp; Remediation</h3>
                <p>Hands-on coordination and delivery of maintenance and remediation works.</p>
                <ul className="service-list">
                  <li>Maintenance coordination</li>
                  <li>Surface restoration and coatings</li>
                  <li>Structural and corrosion remediation</li>
                  <li>Specialist contractor management</li>
                  <li>Defect rectification programs</li>
                </ul>
              </div>
            </div>

            <div id="waterslide" className="card-shell reveal">
              <div className="card-core">
                <div className="icon-circle icon-circle--orange">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>
                </div>
                <h3>Waterslide Protection Plan</h3>
                <p>Australia&apos;s leading specialist waterslide maintenance and protection program.</p>
                <ul className="service-list">
                  <li>Fibreglass inspection and repair</li>
                  <li>Gelcoat restoration</li>
                  <li>Joint and flange assessment</li>
                  <li>Slide surface profiling</li>
                  <li>Ongoing protection plans</li>
                </ul>
              </div>
            </div>

            <div id="design" className="card-shell reveal">
              <div className="card-core">
                <div className="icon-circle icon-circle--navy">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                </div>
                <h3>Design &amp; Operational Advisory</h3>
                <p>Expert input at design stage and during operations to optimise outcomes.</p>
                <ul className="service-list">
                  <li>Design review and advisory</li>
                  <li>Operational readiness assessments</li>
                  <li>Commissioning support</li>
                  <li>Facility planning guidance</li>
                  <li>Operator capability reviews</li>
                </ul>
              </div>
            </div>

            <div id="training" className="card-shell reveal">
              <div className="card-core">
                <div className="icon-circle icon-circle--teal">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <h3>Training &amp; Capability</h3>
                <p>Building the knowledge and competency your teams need.</p>
                <ul className="service-list">
                  <li>Maintenance skills workshops</li>
                  <li>Safety awareness training</li>
                  <li>Asset management fundamentals</li>
                  <li>Customised capability programs</li>
                  <li>Knowledge transfer sessions</li>
                </ul>
              </div>
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
