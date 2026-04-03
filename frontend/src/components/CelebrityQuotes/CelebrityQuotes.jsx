import { useRef, useState, useEffect } from "react";
import styles from "./CelebrityQuotes.module.css";

const CelebrityQuotes = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const celebrities = [
    {
      id: 1,
      name: "Nelson Mandela",
      title: "Former President of South Africa",
      quote:
        "Education is the most powerful weapon which you can use to change the world.",
      image: "../assets/images/nelsonMandela_result.webp",
    },
    {
      id: 2,
      name: "Steve Jobs",
      title: "Co-founder of Apple",
      quote: "Innovation distinguishes between a leader and a follower.",
      image: "../assets/images/steveJobs_result.webp",
    },
    {
      id: 3,
      name: "Maya Angelou",
      title: "Author and Poet",
      quote:
        "If you don't like something, change it. If you can't change it, change your attitude.",
      image: "../assets/images/angelou_result.webp",
    },
    {
      id: 4,
      name: "Albert Einstein",
      title: "Theoretical Physicist",
      quote:
        "Try not to become a person of success, but rather try to become a person of value.",
      image: "../assets/images/einstein_result.webp",
    },
    {
      id: 5,
      name: "Oprah Winfrey",
      title: "Media Executive",
      quote:
        "The biggest adventure you can take is to live the life of your dreams.",
      image: "../assets/images/winfrey_result.webp",
    },
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? celebrities.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === celebrities.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      goToNext();
    }
    if (touchStartX.current - touchEndX.current < -50) {
      goToPrevious();
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <header
          className={`${styles.header} ${isVisible ? styles.visible : ""}`}
        >
          <span className={styles.label}>Inspiration</span>
          <h2 className={styles.title}>Words of Wisdom</h2>
          <p className={styles.subtitle}>
            Insights from visionaries who shaped our world
          </p>
        </header>

        {/* Quote Display */}
        <div
          className={styles.quoteWrapper}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {celebrities.map((celebrity, index) => (
            <div
              key={celebrity.id}
              className={`${styles.quoteSlide} ${
                index === currentIndex ? styles.active : ""
              }`}
            >
              <div className={styles.quoteCard}>
                <svg
                  className={styles.quoteIcon}
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"
                    fill="currentColor"
                  />
                </svg>
                <blockquote className={styles.quote}>
                  <p className={styles.quoteText}>{celebrity.quote}</p>
                </blockquote>
                <div className={styles.author}>
                  <div className={styles.authorImage}>
                    <img
                      src={celebrity.image}
                      alt={celebrity.name}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextElementSibling.style.display = "flex";
                      }}
                    />
                    <div className={styles.imageFallback}>
                      <span>
                        {celebrity.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                  </div>
                  <div className={styles.authorInfo}>
                    <h3 className={styles.authorName}>{celebrity.name}</h3>
                    <p className={styles.authorTitle}>{celebrity.title}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className={styles.navigation}>
          <button
            className={styles.navButton}
            onClick={goToPrevious}
            aria-label="Previous quote"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className={styles.dots}>
            {celebrities.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${
                  index === currentIndex ? styles.active : ""
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to quote ${index + 1}`}
              />
            ))}
          </div>

          <button
            className={styles.navButton}
            onClick={goToNext}
            aria-label="Next quote"
          >
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
        </div>
      </div>
    </section>
  );
};

export default CelebrityQuotes;
