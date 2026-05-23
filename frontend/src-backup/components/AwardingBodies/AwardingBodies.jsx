import { useState, useEffect } from "react";
import styles from "./AwardingBodies.module.css";

const AwardingBodies = () => {
  const [isVisible, setIsVisible] = useState(false);

  const awardingBodies = [
    {
      id: "nbte",
      name: "National Board for Technical Education",
      abbreviation: "NBTE",
      logo: "../assets/award-logos/nbte_result.webp",
      description: "Nigeria's leading technical education authority",
      type: "Government Agency",
    },
    {
      id: "kaduna-qab",
      name: "Kaduna State Quality Assurance Board",
      abbreviation: "KSQAB",
      logo: "../assets/award-logos/kaduna-qab_result.webp",
      description: "Quality assurance for educational institutions",
      type: "State Authority",
    },
    {
      id: "cpn",
      name: "Computer Professionals of Nigeria",
      abbreviation: "CPN",
      logo: "../assets/award-logos/CPNLogo_result.webp",
      description: "Premier body for computing professionals",
      type: "Professional Body",
    },
    {
      id: "itpn",
      name: "Institute of Tourism Professionals of Nigeria",
      abbreviation: "ITPN",
      logo: "../assets/award-logos/ITPN-logo_result.webp",
      description: "Leading tourism and hospitality institute",
      type: "Professional Institute",
    },
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <header
          className={`${styles.header} ${isVisible ? styles.visible : ""}`}
        >
          <span className={styles.label}>Accreditation & Recognition</span>
          <h2 className={styles.title}>Trusted by Leading Authorities</h2>
          <p className={styles.subtitle}>
            Our programs are recognized and accredited by Nigeria's top
            educational and professional bodies
          </p>
        </header>

        {/* Grid */}
        <div className={styles.grid}>
          {awardingBodies.map((body, index) => (
            <article
              key={body.id}
              className={styles.card}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={styles.cardTop}>
                <div className={styles.logoContainer}>
                  <img
                    src={body.logo}
                    alt={`${body.name} logo`}
                    className={styles.logo}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextElementSibling.style.display = "flex";
                    }}
                  />
                  <div className={styles.logoFallback}>
                    <span>{body.abbreviation}</span>
                  </div>
                </div>
                <span className={styles.badge}>{body.type}</span>
              </div>

              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{body.name}</h3>
                <p className={styles.cardDescription}>{body.description}</p>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.verified}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M13.5 4L6 11.5L2.5 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Verified Partner</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>4+</span>
            <span className={styles.statLabel}>Accrediting Bodies</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.stat}>
            <span className={styles.statValue}>100%</span>
            <span className={styles.statLabel}>Compliance Rate</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.stat}>
            <span className={styles.statValue}>National</span>
            <span className={styles.statLabel}>Recognition</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AwardingBodies;
