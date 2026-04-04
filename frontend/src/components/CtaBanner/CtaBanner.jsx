import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './CtaBanner.module.css';

const CtaBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const ctaSection = document.querySelector(`.${styles.ctaBanner}`);
    if (ctaSection) {
      observer.observe(ctaSection);
    }

    return () => observer.disconnect();
  }, []);

  const benefits = [
    {
      icon: '🎯',
      text: 'NBTE Certified Training',
    },
    {
      icon: '👨‍🏫',
      text: 'Expert Instructors',
    },
    {
      icon: '🚀',
      text: 'Career Ready Skills',
    },
    {
      icon: '🏆',
      text: 'Industry Recognition',
    },
  ];

  return (
    <section className={styles.ctaBanner}>
      <div className={styles.backgroundPattern}>
        <div className={styles.patternElement}></div>
        <div className={styles.patternElement}></div>
        <div className={styles.patternElement}></div>
      </div>

      <div className={styles.container}>
        <div
          className={`${styles.ctaContent} ${isVisible ? styles.animate : ''}`}
        >
          {/* Badge */}
          <div className={styles.badge}>
            <span className={styles.badgeIcon}>🌟</span>
            <span>Start Your Journey</span>
          </div>

          {/* Main Content */}
          <div className={styles.mainContent}>
            <h2 className={styles.title}>
              Join Brainstorm Skills Learning Center Today
            </h2>

            <p className={styles.subtitle}>
              Start your journey to mastering in-demand skills with our
              expert-led courses and NBTE certifications.
            </p>

            {/* Benefits */}
            <div className={styles.benefits}>
              {benefits.map((benefit, index) => (
                <div key={index} className={styles.benefitItem}>
                  <span className={styles.benefitIcon}>{benefit.icon}</span>
                  <span className={styles.benefitText}>{benefit.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className={styles.ctaButtons}>
              <Link href='/courses' className={styles.primaryButton}>
                <span>Get Started</span>
                <span className={styles.buttonArrow}>→</span>
              </Link>

              <Link href='/contact' className={styles.secondaryButton}>
                <span>Contact Us</span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className={styles.trustIndicators}>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>✅</span>
                <span className={styles.trustText}>NBTE Approved</span>
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>🏛️</span>
                <span className={styles.trustText}>Government Recognized</span>
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>🎖️</span>
                <span className={styles.trustText}>Quality Assured</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>17+</span>
              <span className={styles.statLabel}>Courses</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>100%</span>
              <span className={styles.statLabel}>Certified</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>600+</span>
              <span className={styles.statLabel}>Trainees</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBanner;
