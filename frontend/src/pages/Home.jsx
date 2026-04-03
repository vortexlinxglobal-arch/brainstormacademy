import { useEffect, useState, useRef } from "react";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";

const heroSlides = [
  {
    title: "Skills for jobs, built for today.",
    subtitle: "Practical training with online support, wherever you are.",
    featureText: "Hands-on courses, real industry outcomes.",
    badges: ["TVET", "Soft Skills", "Career Coaching"],
    image: "/assets/hero_1.jpg",
  },
  {
    title: "Start learning in 30 seconds.",
    subtitle: "Affordable intro programs with job placement guidance.",
    featureText: "Apply what you learn from day one.",
    badges: ["Live Mentors", "Industry Projects", "Certification"],
    image: "/assets/hero_2.JPG",
  },
  {
    title: "Build your future with us.",
    subtitle: "Join a community of learners and achieve real results.",
    featureText: "From basics to advanced skills.",
    badges: ["Community", "Progress Tracking", "Support"],
    image: "/assets/hero_3.jpg",
  },
];

const programTiles = [
  {
    icon: "💄",
    title: "Beauty & Wellness",
    subtitle: "Professional salon training & entrepreneurship",
    mode: "Offline + Online",
  },
  {
    icon: "💡",
    title: "Electrical Installation",
    subtitle: "Industry-ready practical electrical skills",
    mode: "Blended Learning",
  },
  {
    icon: "💻",
    title: "ICT & Networking",
    subtitle: "Computer networking, hardware, and software support",
    mode: "Online & Hybrid",
  },
  {
    icon: "👗",
    title: "Fashion Design",
    subtitle: "Design, tailoring, and style business coaching",
    mode: "In-person Studio",
  },
  {
    icon: "🎨",
    title: "Painting & Interior Design",
    subtitle: "Creative decor, finishing and space styling",
    mode: "Hands-on Practical",
  },
  {
    icon: "🍽️",
    title: "Catering & Hospitality",
    subtitle: "Hospitality service, catering and event skills",
    mode: "Blended Programs",
  },
];

const stats = [
  { label: "Years of Impact", value: "10+" },
  { label: "Graduates", value: "5k+" },
  { label: "Employability Rate", value: "92%" },
  { label: "Industry Partners", value: "30+" },
];

const testimonials = [
  {
    name: "Aisha Musa",
    role: "Beauty Therapy Graduate",
    quote:
      "Brainstorm Academy helped me launch a freelance salon business within 3 months.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Emeka Okafor",
    role: "ICT Apprentice",
    quote:
      "The blended course was practical, affordable, and helped me secure an IT support role.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Zainab Yusuf",
    role: "Fashion Designer",
    quote:
      "I learnt real tailoring and business skills that work in Kaduna market.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
  },
];

const partners = [
  "NBTE",
  "KSQAB",
  "CPN",
  "ITPN",
  "NIGERIA TECH HUB",
  "YOUTH SKILLS FUND",
];

const Home = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);
  const minSwipeDistance = 50;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const handleTouchStart = (event) => {
    touchStartXRef.current = event.touches[0].clientX;
    touchEndXRef.current = event.touches[0].clientX;
  };

  const handleTouchMove = (event) => {
    touchEndXRef.current = event.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchStartXRef.current - touchEndXRef.current;
    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        setActiveSlide((current) => (current + 1) % heroSlides.length);
      } else {
        setActiveSlide((current) => (current - 1 + heroSlides.length) % heroSlides.length);
      }
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.heroSection}>
        <div
          className={styles.heroSlider}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {heroSlides.map((slide, slideIndex) => (
            <article
              key={slide.title}
              className={`${styles.heroSlide} ${slideIndex === activeSlide ? styles.active : ""}`}
            >
              <img
                src={slide.image}
                srcSet={`${slide.image} 1x, ${slide.image} 2x`}
                sizes="(max-width: 768px) 100vw, 100vw"
                alt={slide.title}
                className={styles.heroImage}
                loading="lazy"
              />
              <div className={styles.heroSlideBackdrop} />
              <div className={styles.heroContent}>
                <div className={styles.heroCaptionGroup}>
                  {slide.badges.map((badge) => (
                    <p key={badge} className={styles.heroCaptionPill}>
                      {badge}
                    </p>
                  ))}
                </div>

                <h1 className={styles.heroTitle}>{slide.title}</h1>
                <p className={styles.heroText}>{slide.subtitle}</p>

                <div className={styles.heroActions}>
                  <Link to="/signup" className={styles.primaryCta}>
                    Ask a question
                  </Link>
                  <Link to="/courses" className={styles.secondaryCta}>
                    Explore courses
                  </Link>
                </div>

                <div className={styles.heroFeatureText}>
                  <p>{slide.featureText}</p>
                </div>
              </div>
            </article>
          ))}

          <div className={styles.slideIndicators}>
            {heroSlides.map((_, index) => (
              <button
                key={index}
                className={`${styles.slideDot} ${index === activeSlide ? styles.activeDot : ""}`}
                onClick={() => setActiveSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.programsSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>Programs</span>
          <h2>Courses built for employment, entrepreneurship and practical mastery.</h2>
          <p>Browse our flagship trade categories that combine digital skill and hands-on practice.</p>
        </div>

        <div className={styles.programGrid}>
          {programTiles.map((program) => (
            <article key={program.title} className={styles.programCard}>
              <div className={styles.programIcon}>{program.icon}</div>
              <h3>{program.title}</h3>
              <p>{program.subtitle}</p>
              <span className={styles.programMode}>{program.mode}</span>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.testimonialsSection}>
        <div className={styles.sectionHeader}>          
          <h2>Real stories from skills graduates.</h2>
          <p>Students who trained with us and launched income-generating careers.</p>
        </div>

        <div className={styles.testimonialsGrid}>
          {testimonials.map((item) => (
            <article key={item.name} className={styles.testimonialCard}>
              <div className={styles.testimonialAvatar} style={{ backgroundImage: `url(${item.avatar})` }} />
              <blockquote>“{item.quote}”</blockquote>
              <p className={styles.testimonialName}>{item.name}</p>
              <p className={styles.testimonialRole}>{item.role}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.partnersSection}>
        <div className={styles.partnersInner}>
          <div>
            <span className={styles.sectionBadge}>Accreditations</span>
            <h3>Recognized by trusted Nigerian agencies and employer partners.</h3>
          </div>
          <div className={styles.partnerLogos}>
            {partners.map((name) => (
              <div key={name} className={styles.partnerLogo}>{name}</div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaCard}>
          <div>
            <p className={styles.ctaLabel}>Ready to change your career?</p>
            <h2>Join Brainstorm Academy and start a practical skills program this term.</h2>
          </div>
          <Link to="/signup" className={styles.ctaButton}>
            Start enrollment
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
