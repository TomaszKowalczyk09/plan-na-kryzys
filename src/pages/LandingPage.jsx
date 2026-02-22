import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import crisisLogo from "../assets/logo.svg";
// Placeholder partner logos (replace with real logos as needed)
const partners = [
  { src: crisisLogo, alt: "Plan na kryzys" },
  // Dodaj kolejne logo partnerów jeśli chcesz
];

const features = [
  {
    icon: "⚡",
    title: "Liczniki czystości i postępów",
    desc: "Monitoruj swoje postępy i kamienie milowe."
  },
  {
    icon: "🏆",
    title: "Kamienie milowe i gratulacje",
    desc: "Otrzymuj gratulacje za osiągnięcia."
  },
  {
    icon: "🧘",
    title: "Poradnik uziemienia i wiedza",
    desc: "Techniki radzenia sobie i baza wiedzy."
  },
  {
    icon: "📞",
    title: "Lista kontaktów pomocowych",
    desc: "Szybki dostęp do wsparcia."
  },
  {
    icon: "📝",
    title: "Plan bezpieczeństwa",
    desc: "Twórz własny plan na kryzys."
  },
  {
    icon: "🔔",
    title: "Powiadomienia i wsparcie",
    desc: "Przypomnienia i motywacja."
  },
  {
    icon: "🔒",
    title: "Całkowicie offline",
    desc: "Twoje dane są bezpieczne i tylko na urządzeniu."
  }
];
export default function LandingPage() {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      navigate("/onboarding");
    }
    // Obsługa beforeinstallprompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, [navigate]);

  const handleDownload = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else {
      alert("Dodaj aplikację do ekranu głównego przez menu przeglądarki.");
    }
  };

  return (
    <div style={styles.root}>
      <header style={styles.header}>
        <h1 style={styles.heading}>
          <span style={styles.headingGradient}>Plan na kryzys</span>
        </h1>
        <p style={styles.subheading}>
          Twoje wsparcie w trudnych chwilach.<br />
          <span style={styles.bold}>ma znaczenie</span><br />
          – poznaj funkcje, pobierz aplikację i zacznij korzystać!
        </p>
        <button
          style={styles.downloadBtn}
          onClick={handleDownload}
        >
          Pobierz Plan na kryzys
        </button>
      </header>
      <main style={styles.main}>
        <section style={styles.featuresSection}>
          <h2 style={styles.sectionTitle}>Funkcje aplikacji</h2>
          <div style={styles.featuresGrid}>
            {features.map((f, idx) => (
              <div key={idx} style={styles.featureCard}>
                <div style={styles.featureIcon}>{f.icon}</div>
                <div>
                  <div style={styles.featureTitle}>{f.title}</div>
                  <div style={styles.featureDesc}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section style={styles.partnersSection}>
          <h2 style={styles.sectionTitle}>Partnerzy</h2>
          <div style={styles.partnerLogos}>
            {partners.map((p, idx) => (
              <img
                key={idx}
                src={p.src}
                alt={p.alt}
                style={styles.partnerLogo}
              />
            ))}
          </div>
        </section>
      </main>
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          © 2026 Plan na kryzys. Współpraca: Tomasz Kowalczyk.
        </p>
      </footer>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #181a2a 0%, #23244a 100%)",
    color: "#f5f7fa",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Inter, Arial, sans-serif",
    padding: "0",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    marginTop: "48px",
    marginBottom: "32px",
    alignItems: "center",
  },
  logo: {
    width: "64px",
    height: "64px",
    marginBottom: "16px",
    filter: "drop-shadow(0 2px 8px #D7F523)"
  },
  heading: {
    fontSize: "3rem",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "12px",
    letterSpacing: "-2px",
  },
  headingGradient: {
    background: "linear-gradient(90deg, #D7F523 0%, #6a5cff 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    color: "transparent",
    display: "inline-block",
    animation: "gradientMove 3s infinite alternate",
  },
  subheading: {
    fontSize: "1.25rem",
    textAlign: "center",
    marginBottom: "24px",
    color: "#b3b3b3",
  },
  bold: {
    fontWeight: "bold",
    fontSize: "2rem",
    color: "#D7F523",
    display: "block",
    margin: "8px 0",
  },
  downloadBtn: {
    background: "linear-gradient(90deg, #6a5cff 0%, #D7F523 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "999px",
    padding: "16px 40px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    boxShadow: "0 4px 24px -8px #6a5cff",
    cursor: "pointer",
    marginTop: "12px",
    transition: "background 0.3s",
  },
  main: {
    width: "100%",
    maxWidth: "900px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "32px",
  },
  featuresSection: {
    width: "100%",
    marginBottom: "40px",
    background: "rgba(34,36,68,0.7)",
    borderRadius: "18px",
    padding: "24px 0",
    boxShadow: "0 2px 16px -8px #6a5cff",
  },
  sectionTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "24px",
    textAlign: "center",
    background: "linear-gradient(90deg, #D7F523 0%, #192D55 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    color: "transparent",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "24px",
    justifyContent: "center",
    alignItems: "stretch",
  },
  featureCard: {
    background: "rgba(34,36,68,0.85)",
    border: "1px solid #2a2a4a",
    borderRadius: "18px",
    padding: "24px 18px",
    boxShadow: "0 2px 16px -8px #6a5cff",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    minHeight: "120px",
    transition: "box-shadow 0.2s",
  },
  featureIcon: {
    fontSize: "2.2rem",
    color: "#D7F523",
    marginRight: "8px",
    flexShrink: 0,
    filter: "drop-shadow(0 2px 8px #D7F523)"
  },
  featureTitle: {
    fontWeight: "bold",
    fontSize: "1.1rem",
    marginBottom: "4px",
    color: "#fff",
  },
  featureDesc: {
    fontSize: "0.95rem",
    color: "#b3b3b3",
  },
  partnersSection: {
    width: "100%",
    marginBottom: "40px",
    textAlign: "center",
    background: "rgba(34,36,68,0.7)",
    borderRadius: "18px",
    padding: "24px 0",
    boxShadow: "0 2px 16px -8px #D7F523",
  },
  partnerLogos: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "32px",
    marginTop: "24px",
  },
  partnerLogo: {
    width: "80px",
    height: "80px",
    objectFit: "contain",
    filter: "drop-shadow(0 2px 8px #D7F523)",
    opacity: 0.95,
    borderRadius: "12px",
    background: "rgba(34,36,68,0.15)",
    padding: "8px",
  },
  footer: {
    width: "100%",
    textAlign: "center",
    padding: "24px 0 12px 0",
    background: "linear-gradient(90deg, #23244a 0%, #6a5cff 100%)",
    color: "#f5f7fa",
    fontSize: "1rem",
    borderTop: "1px solid #2a2a4a",
  },
  footerText: {
    opacity: 0.85,
    fontWeight: "500",
  },
};
