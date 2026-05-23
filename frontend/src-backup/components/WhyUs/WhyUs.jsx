import { useState, useEffect } from 'react';
import styles from './WhyUs.module.css';

const WhyUs = () => {
  const [isVisible, setIsVisible] = useState(false);

  const whyUsItems = [
    {
      id: 'expert-instructors',
      icon: '👨‍🏫',
      title: 'Expert Instructors',
      description:
        'Learn from industry professionals with years of experience in skills training and real-world expertise.',
      highlight: '10+ Years Experience',
      stats: '25+ Expert Trainers',
    },
    {
      id: 'nbte-approved',
      icon: '🎓',
      title: 'NBTE-Approved Certifications',
      description:
        'Our programs are nationally recognized for quality, ensuring maximum employability and career advancement.',
      highlight: '100% Certified',
      stats: 'Government Recognized',
    },
    {
      id: 'hands-on-learning',
      icon: '🛠️',
      title: 'Hands-On Learning',
      description:
        'Practical, project-based training designed for real-world skills development and entrepreneurship.',
      highlight: 'Project-Based',
      stats: '80% Practical Training',
    },
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);


  const handleStartJourney = () => {
    console.log('Navigate to enrollment');
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Left Column - Content */}
        <div className={styles.content}>
          <header
            className={`${styles.header} ${isVisible ? styles.visible : ''}`}
          >
            <span className={styles.label}>Why Choose Us</span>
            <h2 className={styles.title}>
              Experience Excellence in Skills Training
            </h2>
            <p className={styles.subtitle}>
              We combine expert instruction, recognized certifications, and
              practical learning to deliver results that matter.
            </p>
          </header>

          {/* Feature List */}
          <div className={styles.features}>
            {whyUsItems.map((item, index) => (
              <article
                key={item.id}
                className={styles.feature}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.featureIcon}>
                  <span>{item.icon}</span>
                </div>
                <div className={styles.featureContent}>
                  <div className={styles.featureHeader}>
                    <h3 className={styles.featureTitle}>{item.title}</h3>
                    <span className={styles.featureBadge}>
                      {item.highlight}
                    </span>
                  </div>
                  <p className={styles.featureDescription}>
                    {item.description}
                  </p>
                  <span className={styles.featureStats}>{item.stats}</span>
                </div>
              </article>
            ))}
          </div>

          {/* CTA Button */}
          <button className={styles.ctaBtn} onClick={handleStartJourney}>
            <span>Start Your Journey</span>
            <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
              <path
                d='M10 2L18 10L10 18M18 10H2'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>
        </div>

        {/* Right Column - Stats */}
        <div className={styles.statsColumn}>
          <div className={styles.statsCard}>
            <div className={styles.statsHeader}>
              <h3 className={styles.statsTitle}>Our Impact</h3>
              <p className={styles.statsSubtitle}>
                Numbers that speak for themselves
              </p>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>600+</span>
                <span className={styles.statLabel}>Trainees</span>
                <div className={styles.statBar}>
                  <div
                    className={styles.statProgress}
                    style={{ width: '85%' }}
                  ></div>
                </div>
              </div>

              <div className={styles.statItem}>
                <span className={styles.statNumber}>95%</span>
                <span className={styles.statLabel}>Success Rate</span>
                <div className={styles.statBar}>
                  <div
                    className={styles.statProgress}
                    style={{ width: '95%' }}
                  ></div>
                </div>
              </div>

              <div className={styles.statItem}>
                <span className={styles.statNumber}>17+</span>
                <span className={styles.statLabel}>Programs</span>
                <div className={styles.statBar}>
                  <div
                    className={styles.statProgress}
                    style={{ width: '70%' }}
                  ></div>
                </div>
              </div>

              <div className={styles.statItem}>
                <span className={styles.statNumber}>4+</span>
                <span className={styles.statLabel}>Accreditations</span>
                <div className={styles.statBar}>
                  <div
                    className={styles.statProgress}
                    style={{ width: '100%' }}
                  ></div>
                </div>
              </div>
            </div>

            <div className={styles.testimonial}>
              <svg
                className={styles.quoteIcon}
                width='24'
                height='24'
                viewBox='0 0 24 24'
              >
                <path
                  d='M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z'
                  fill='currentColor'
                />
              </svg>
              <p className={styles.testimonialText}>
                The hands-on training and expert guidance transformed my career
                path completely.
              </p>
              <div className={styles.testimonialAuthor}>
                <span className={styles.authorName}>Success Story</span>
                <span className={styles.authorRole}>Graduate 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
