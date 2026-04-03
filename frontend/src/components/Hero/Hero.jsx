import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Hero.module.css";

const Hero = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const slides = [
    {
      id: "web-design",
      title: "Master Web Design & Development",
      subtitle:
        "Build modern, responsive websites with cutting-edge technologies",
      category: "Technology",
      duration: "12 weeks",
      level: "Beginner to Advanced",
      image: "../assets/images/web-design_result.webp",
    },
    {
      id: "hardware-repair",
      title: "Computer Hardware Repairs & Maintenance",
      subtitle: "Master the art of diagnosing and fixing computer systems",
      category: "Technology",
      duration: "10 weeks",
      level: "Intermediate",
      image: "../assets/images/hardware-repair_result.webp",
    },
    {
      id: "furniture-making-kaduna",
      title: "Furniture Making & Upholstery",
      subtitle: "Create beautiful, functional furniture with modern techniques",
      category: "Craftsmanship",
      duration: "16 weeks",
      level: "Beginner",
      image: "../assets/images/furniture-making_result.webp",
    },
    {
      id: "carpentry-joinery",
      title: "Carpentry & Joinery",
      subtitle: "Learn precision woodworking and construction techniques",
      category: "Construction",
      duration: "14 weeks",
      level: "Beginner",
      image: "../assets/images/carpentry_result.webp",
    },
    {
      id: "aluminum-fabrication",
      title: "Aluminum Fabrication",
      subtitle: "Master metalworking skills for modern construction projects",
      category: "Manufacturing",
      duration: "12 weeks",
      level: "Intermediate",
      image: "../assets/images/aluminum-fabrication_result.webp",
    },
    {
      id: "fashion-tailoring",
      title: "Fashion Design & Tailoring",
      subtitle: "Design and create stunning garments with Nigerian flair",
      category: "Fashion",
      duration: "8 weeks",
      level: "Beginner",
      image: "../assets/images/fashion-tailoring_result.webp",
    },
  ];

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  const handleStartLearning = () => {
    navigate("/signup");
  };

  const handleBrowseCourses = () => {
    navigate("/courses");
  };

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        {/* Left Content */}
        <div className={styles.content}>
          <div
            className={`${styles.contentWrapper} ${
              isLoaded ? styles.loaded : ""
            }`}
          >
            <span className={styles.label}>NBTE Approved Programs</span>

            <h1 className={styles.title}>
              Transform Your Career with Professional Skills
            </h1>

            <p className={styles.subtitle}>
              Industry-relevant training programs designed to get you job-ready.
              Join 600+ FME - TVET Initiative Trainees to launch successful
              careers.
            </p>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>600+</span>
                <span className={styles.statLabel}>Trainees</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>95%</span>
                <span className={styles.statLabel}>Success Rate</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>17+</span>
                <span className={styles.statLabel}>Programs</span>
              </div>
            </div>

            <div className={styles.actions}>
              <button
                className={styles.primaryBtn}
                onClick={handleStartLearning}
              >
                <span>Start Learning</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M7.5 15L12.5 10L7.5 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                className={styles.secondaryBtn}
                onClick={handleBrowseCourses}
              >
                Browse Courses
              </button>
            </div>
          </div>
        </div>

        {/* Right Carousel */}
        <div className={styles.carouselWrapper}>
          <div className={styles.carousel}>
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`${styles.slide} ${
                  index === currentSlide ? styles.active : ""
                }`}
                style={{
                  backgroundImage: `url(${slide.image})`,
                }}
              >
                <div className={styles.slideOverlay}></div>
                <div className={styles.slideContent}>
                  <span className={styles.slideCategory}>{slide.category}</span>
                  <h3 className={styles.slideTitle}>{slide.title}</h3>
                  <p className={styles.slideSubtitle}>{slide.subtitle}</p>

                  <div className={styles.slideMeta}>
                    <span className={styles.metaItem}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <circle
                          cx="8"
                          cy="8"
                          r="7"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M8 4V8L11 10"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      {slide.duration}
                    </span>
                    <span className={styles.metaItem}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M8 1L10 5.5L15 6L11 9.5L12 15L8 12L4 15L5 9.5L1 6L6 5.5L8 1Z"
                          fill="currentColor"
                        />
                      </svg>
                      {slide.level}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Controls */}
          <div className={styles.controls}>
            {slides.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${
                  index === currentSlide ? styles.active : ""
                }`}
                onClick={() => handleSlideChange(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
