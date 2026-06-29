"use client";

import { useEffect } from "react";

export default function TermsPage() {
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
        if (window.scrollY > 60) navbar.classList.add("scrolled");
        else navbar.classList.remove("scrolled");
      };
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    const hamburger = document.querySelector(".hamburger");
    const mobileOverlay = document.querySelector(".mobile-menu-overlay");
    const mobileClose = document.querySelector(".mobile-menu-close");
    const openMobileMenu = () => {
      hamburger?.classList.add("active");
      mobileOverlay?.classList.add("active");
      document.body.style.overflow = "hidden";
    };
    const closeMobileMenu = () => {
      hamburger?.classList.remove("active");
      mobileOverlay?.classList.remove("active");
      document.body.style.overflow = "";
    };
    hamburger?.addEventListener("click", openMobileMenu);
    mobileClose?.addEventListener("click", closeMobileMenu);
    mobileOverlay?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMobileMenu));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMobileMenu(); });

    return () => reveals.forEach((el) => revealObserver.unobserve(el));
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
            <li><a href="/training">Training</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
          <a href="/contact" className="btn-primary">
            <span className="btn-text">Get in Touch</span>
            <span className="btn-icon btn-icon-desktop">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
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

      {/* Hero */}
      <section className="page-hero">
        <div className="container reveal">
          <span className="eyebrow">Legal</span>
          <h1>Terms, Conditions &amp; Disclaimer</h1>
          <p>The terms that apply to our training, certificates and this website. Please read them before purchasing or enrolling.</p>
        </div>
      </section>

      {/* Body */}
      <section className="section">
        <div className="container reveal" style={{ maxWidth: "780px", margin: "0 auto" }}>
          <div className="card-shell">
            <div className="card-core" style={{ lineHeight: 1.75 }}>
              <p style={{ color: "var(--mid-grey)", fontSize: "0.85rem", marginBottom: "2rem" }}>
                Last updated: 29 June 2026
              </p>

              <Term n="1" title="Agreement to these terms">
                These terms govern your access to and use of the SlideSure training program and any
                related content, certificates and services. The training is provided by Comfy Chaos Pty Ltd
                (&ldquo;Comfy Chaos&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) and is offered for sale via the
                REST Group Asia Pacific Pty Ltd (&ldquo;REST Group&rdquo;) website. By purchasing, enrolling
                in, or using the training you agree to these terms. If you are agreeing on behalf of an
                organisation, you confirm you are authorised to do so.
              </Term>

              <Term n="2" title="What this training is - and is not">
                Our training is educational. It is designed to build awareness and underpinning knowledge
                for people working with or around waterslides and aquatic plant. It <strong>supports, but
                does not replace</strong>, your own site-specific procedures, the manufacturer&apos;s (OEM)
                operating and maintenance manuals, the applicable Australian Standards, work health and
                safety legislation, and the directions of your relevant regulator. It is general in nature
                and is not a substitute for professional, legal, engineering or safety advice, or for your
                own risk assessment.
              </Term>

              <Term n="3" title="Not a nationally accredited qualification">
                The certificate issued on completion is a <strong>statement of completion and
                competency</strong>. It is <strong>not</strong> a nationally recognised qualification or
                unit of competency under the Australian Vocational Education and Training (VET) framework;
                neither Comfy Chaos nor REST Group is a <strong>Registered Training Organisation (RTO)</strong>;
                and the certificate is <strong>not</strong> a statutory licence, ticket or high-risk-work
                licence. It does not, by itself, authorise any person to operate plant where a regulator,
                employer or insurer requires a specific licence, ticket or accreditation. Where such
                requirements apply, they must be met separately.
              </Term>

              <Term n="4" title="Currency of content">
                Course content reflects the Australian Standards, work health and safety legislation and
                regulatory guidance in force at the time of publication. Standards are revised and
                regulations change; content is reviewed and updated periodically and is therefore subject
                to change without notice. You should always confirm current requirements against the live
                instruments and your relevant regulator. We do not warrant that the content is exhaustive,
                error-free, or current at every moment.
              </Term>

              <Term n="5" title="Your responsibilities">
                You remain solely responsible for your own conduct, decisions and compliance. Nothing in
                the training removes or reduces the duties that you, your employer or the person conducting
                a business or undertaking owe under WHS/OHS law. Operational decisions - including whether
                to open, operate, inspect or shut down any device - must be made in accordance with your
                own procedures, the OEM requirements and applicable law, not on the basis of this training
                alone.
              </Term>

              <Term n="6" title="Limitation of liability">
                Nothing in these terms excludes, restricts or modifies any consumer guarantee, right or
                remedy that you have under the Australian Consumer Law (ACL) or other law that cannot
                lawfully be excluded. Subject to that, and to the maximum extent permitted by law: the
                training and content are provided on an &ldquo;as is&rdquo; basis; we exclude all other
                warranties; and we are not liable for any indirect, incidental, special or consequential
                loss, or for any loss, injury, damage or liability arising from operational decisions,
                reliance on the content, or any act or omission of any person. Where our liability cannot
                be excluded but can be limited, our liability is limited (at our option) to re-supplying
                the training or paying the cost of having it re-supplied, or to the amount you paid for the
                training. These exclusions and limitations also apply, to the same extent, for the benefit
                of REST Group and the directors, employees and contractors of each of us.
              </Term>

              <Term n="7" title="Licences, access and acceptable use">
                Access is granted on a per-seat basis for the named user or the number of seats purchased.
                Accounts and access must not be shared beyond your licence. The content is the intellectual
                property of Comfy Chaos and is provided for your internal training use only; you may not
                copy, redistribute, resell, or create derivative works from it without our written consent.
              </Term>

              <Term n="8" title="Payments and refunds">
                Prices are in Australian dollars and payments are processed securely by our payment provider
                (Stripe) on behalf of Comfy Chaos. Your card or bank statement may therefore show
                &ldquo;Comfy Chaos&rdquo; rather than REST Group or SlideSure. Because the training is
                digital content that is accessed immediately, change-of-mind refunds may not be available
                once you have started the course. This does not affect your rights under the Australian
                Consumer Law, including to a remedy where the training is not of acceptable quality or does
                not match its description. For any billing issue, contact us.
              </Term>

              <Term n="9" title="Privacy">
                We collect and handle personal information (such as your name, email and progress) only to
                provide the training, issue certificates and support your account. We do not sell your
                personal information. For any privacy request, contact us at the details below.
              </Term>

              <Term n="10" title="Governing law">
                These terms are governed by the laws of Australia and the State or Territory in which Comfy
                Chaos Pty Ltd has its principal place of business, and you submit to the non-exclusive
                jurisdiction of the courts of that place.
              </Term>

              <Term n="11" title="Contact">
                Questions about these terms can be sent to{" "}
                <a href="mailto:info@restgroup.com.au" style={{ color: "var(--accent)", fontWeight: 600 }}>info@restgroup.com.au</a>{" "}
                or via our <a href="/contact" style={{ color: "var(--accent)", fontWeight: 600 }}>contact page</a>.
              </Term>
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
          <p>&copy; 2026 REST Group Asia Pacific Pty Ltd · SlideSure training provided by Comfy Chaos Pty Ltd</p>
        </div>
      </footer>
    </>
  );
}

function Term({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <h3 style={{ marginBottom: "0.75rem", color: "var(--navy)" }}>
        <span style={{ color: "var(--accent)", marginRight: "0.5rem" }}>{n}.</span>
        {title}
      </h3>
      <p style={{ color: "var(--mid-grey)", fontSize: "0.95rem" }}>{children}</p>
    </div>
  );
}
