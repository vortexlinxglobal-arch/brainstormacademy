import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import styles from "./FeaturedCourses.module.css";

const FeaturedCourses = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const buttonRef = useRef(null);

  const courses = [
    {
      id: "web-development",
      title: "Web Development",
      description:
        "Build modern, responsive websites with HTML, CSS, and JavaScript. Master frontend frameworks and backend development.",
      category: "Technology",
      level: "Beginner",
      duration: "12 Weeks",
      rating: 4.8,
      students: 1200,
      price: 50000,
      skills: ["HTML/CSS", "JavaScript", "React"],
      featured: true,
    },
    {
      id: "data-science",
      title: "Data Science",
      description:
        "Master data analysis, machine learning, and AI techniques. Learn Python, statistics, and data visualization.",
      category: "Analytics",
      level: "Intermediate",
      duration: "16 Weeks",
      rating: 4.9,
      students: 850,
      price: 55000,
      skills: ["Python", "Machine Learning", "Analytics"],
      featured: false,
    },
    {
      id: "graphic-design",
      title: "Graphic Design",
      description:
        "Create stunning visuals with industry-standard tools. Master Adobe Creative Suite and design principles.",
      category: "Creative",
      level: "Beginner",
      duration: "10 Weeks",
      rating: 4.7,
      students: 1500,
      price: 40000,
      skills: ["Photoshop", "Illustrator", "Branding"],
      featured: true,
    },
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatStudents = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const handleEnrollClick = (courseId) => {
    console.log(`Enroll in course: ${courseId}`);
  };

  // Optimized navigation handlers
  const handleBackClick = useCallback(() => {
    navigate("/courses");
  }, [navigate]);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={`${styles.header} ${isVisible ? styles.visible : ""}`}>
          <div className={styles.headerTop}>
            <div>
              <span className={styles.label}>Popular Programs</span>
              <h2 className={styles.title}>Featured Courses</h2>
            </div>
          </div>
          <p className={styles.subtitle}>
            Industry-relevant courses designed to get you job-ready in weeks
          </p>
        </div>

        {/* Courses Grid */}
        <div className={styles.grid}>
          {courses.map((course, index) => (
            <article
              key={course.id}
              className={`${styles.card} ${
                course.featured ? styles.featured : ""
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {course.featured && (
                <div className={styles.featuredBadge}>
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="currentColor"
                  >
                    <path d="M5 0l1.09 2.27L8.5 2.9 6.75 4.9 7.18 7.5 5 6.27 2.82 7.5l.43-2.6L1.5 2.9l2.41-.63L5 0z" />
                  </svg>
                  Featured
                </div>
              )}

              {/* Card Header */}
              <div className={styles.cardHeader}>
                <div className={styles.cardMeta}>
                  <span className={styles.category}>{course.category}</span>
                  <span className={styles.level}>{course.level}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className={styles.cardBody}>
                <h3 className={styles.courseTitle}>{course.title}</h3>
                <p className={styles.description}>{course.description}</p>

                {/* Skills */}
                <div className={styles.skills}>
                  {course.skills.map((skill, skillIndex) => (
                    <span key={skillIndex} className={styles.skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className={styles.cardFooter}>
                <div className={styles.stats}>
                  <div className={styles.stat}>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="currentColor"
                    >
                      <path d="M7 0l1.545 3.13L12 3.635 9.5 6.365 10.09 10 7 8.135 3.91 10l.59-3.635L2 3.635l3.455-.505L7 0z" />
                    </svg>
                    <span>{course.rating}</span>
                  </div>
                  <div className={styles.statDivider}></div>
                  <div className={styles.stat}>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="currentColor"
                    >
                      <path d="M7 0C8.1 0 9 .9 9 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 10c2.7 0 5.8 1.29 6 2H1c.23-.72 3.31-2 6-2zm0-2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                    <span>{formatStudents(course.students)}</span>
                  </div>
                  <div className={styles.statDivider}></div>
                  <div className={styles.stat}>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="currentColor"
                    >
                      <path d="M7 0C10.31 0 13 2.69 13 6s-2.69 6-6 6-6-2.69-6-6 2.69-6 6-6zm0 2v4l3 1.5" />
                    </svg>
                    <span>{course.duration}</span>
                  </div>
                </div>

                <div className={styles.pricing}>
                  <div className={styles.price}>
                    <span className={styles.priceLabel}>From</span>
                    <span className={styles.priceValue}>
                      {formatPrice(course.price)}
                    </span>
                  </div>
                  <button
                    className={styles.enrollBtn}
                    onClick={() => handleEnrollClick(course.id)}
                  >
                    Enroll Now
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M5 11L9 7L5 3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Footer Note */}
        <div className={styles.headerTop}>
          <div>
            <button
              className={styles.viewAllBtn}
              onClick={handleBackClick}
              ref={buttonRef}
              aria-label="Back to Courses List"
            >
              View All
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 12L10 8L6 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className={styles.footerNote}>
          <p>17+ courses available across multiple categories</p>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
