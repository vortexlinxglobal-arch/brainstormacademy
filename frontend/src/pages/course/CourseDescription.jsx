import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import styles from "./CourseDescription.module.css";

const CourseDescription = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [isFloating, setIsFloating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const buttonRef = useRef(null);

  const courses = {
    "networking-system-security": {
      title: "Networking and System Security Installation",
      thumbnail: "/assets/course-thumbnails/networking_result.webp",
      numberOfLectures: 20,
      createdBy: "Lukman Lukman",
      duration: "12 weeks",
      level: "Intermediate",
      category: "Technology",
      description:
        "Learn to design, install, and maintain secure network systems. This course covers network configuration, cybersecurity protocols, and system maintenance, preparing you for roles in IT infrastructure and security.",
      curriculum:
        "Topics include network architecture, firewall setup, intrusion detection, and secure system administration. Practical sessions involve hands-on network setup and troubleshooting.",
      outcomes:
        "Prepare for roles as network administrators or cybersecurity technicians with NSQ certification.",
      skills: [
        "Network Configuration",
        "Cybersecurity",
        "System Administration",
        "Troubleshooting",
      ],
    },
    "website-design-development": {
      title: "Website Design & Development",
      thumbnail: "/assets/course-thumbnails/web-design_result.webp",
      numberOfLectures: 18,
      createdBy: "Lukman Lukman",
      duration: "10 weeks",
      level: "Beginner",
      category: "Technology",
      description:
        "Master the art of creating responsive, user-friendly websites. This course covers HTML, CSS, JavaScript, and modern frameworks, enabling you to build professional websites.",
      curriculum:
        "Learn web design principles, front-end and back-end development, and content management systems. Practical projects include building a portfolio website.",
      outcomes:
        "Become a web developer or designer, ready to work freelance or in tech companies.",
      skills: ["HTML/CSS", "JavaScript", "Responsive Design", "UI/UX"],
    },
    "mobile-phone-repair": {
      title: "Mobile Phone Repair",
      thumbnail: "/assets/course-thumbnails/mobile-repair_result.webp",
      numberOfLectures: 15,
      createdBy: "Emeka Okonkwo",
      duration: "8 weeks",
      level: "Beginner",
      category: "Technology",
      description:
        "Gain expertise in diagnosing and repairing mobile devices. This course covers hardware troubleshooting, software updates, and component replacement.",
      curriculum:
        "Study mobile device anatomy, repair techniques, and diagnostic tools. Practical workshops include screen replacements and software fixes.",
      outcomes:
        "Work as a mobile repair technician or start your own repair business.",
      skills: [
        "Hardware Repair",
        "Software Troubleshooting",
        "Component Replacement",
        "Diagnostics",
      ],
    },
    "electrical-installations": {
      title: "Electrical Installations",
      thumbnail: "/assets/course-thumbnails/electrical_result.webp",
      numberOfLectures: 22,
      createdBy: "Chinedu Eze",
      duration: "14 weeks",
      level: "Intermediate",
      category: "Engineering",
      description:
        "Learn to install and maintain electrical systems safely and efficiently. This course covers wiring, circuit design, and safety standards.",
      curriculum:
        "Topics include electrical theory, wiring regulations, and installation techniques. Hands-on training in wiring setups and safety inspections.",
      outcomes:
        "Pursue careers as electricians or electrical contractors with NSQ certification.",
      skills: [
        "Electrical Wiring",
        "Circuit Design",
        "Safety Standards",
        "Installation",
      ],
    },
  };

  const course = courses[courseId] || {
    title: "Course Not Found",
    thumbnail: "/assets/course-thumbnails/default_result.webp",
    numberOfLectures: 0,
    createdBy: "Unknown",
    duration: "N/A",
    level: "N/A",
    category: "N/A",
    description: "The requested course could not be found.",
    curriculum: "",
    outcomes: "",
    skills: [],
  };

  // Optimized scroll handler with useCallback
  const handleScroll = useCallback(() => {
    if (buttonRef.current) {
      const buttonTop = buttonRef.current.getBoundingClientRect().top;
      const isButtonOutOfView = buttonTop < 0;
      setIsFloating(isButtonOutOfView);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoaded(true);

    // Add passive event listener for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Optimized navigation handlers
  const handleBackClick = useCallback(() => {
    navigate("/courses");
  }, [navigate]);

  const handleEnrollClick = useCallback(() => {
    navigate("/contact");
  }, [navigate]);

  return (
    <main className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div
            className={`${styles.heroText} ${isLoaded ? styles.loaded : ""}`}
          >
            <div className={styles.breadcrumb}>
              <span>Courses</span>
              <span className={styles.separator}>›</span>
              <span>{course.title}</span>
            </div>

            <h1 className={styles.heroTitle}>{course.title}</h1>

            <p className={styles.heroSubtitle}>
              Explore our National Skills Qualification (NSQ) certified training
              program designed for practical skills and career advancement.
            </p>

            <div className={styles.heroMeta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Category:</span>
                <span className={styles.metaValue}>{course.category}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Level:</span>
                <span className={styles.metaValue}>{course.level}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Duration:</span>
                <span className={styles.metaValue}>{course.duration}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Details */}
      <section className={styles.section}>
        <div className={styles.container}>
          <button
            className={`${styles.backButton} ${
              isFloating ? styles.floating : ""
            }`}
            onClick={handleBackClick}
            ref={buttonRef}
            aria-label="Back to Courses List"
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
            <span>Back to Courses</span>
          </button>

          <div className={styles.courseContent}>
            <header className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Course Overview</h2>
              <p className={styles.sectionSubtitle}>
                Comprehensive training program with industry-standard curriculum
              </p>
            </header>

            <div className={styles.courseGrid}>
              {/* Course Media */}
              <div className={styles.courseMedia}>
                <div className={styles.thumbnailWrapper}>
                  <div className={styles.thumbnailPlaceholder}>
                    <div className={styles.playIcon}>
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 48 48"
                        fill="none"
                      >
                        <path d="M16 14L32 24L16 34V14Z" fill="currentColor" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className={styles.courseStats}>
                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>📚</div>
                    <div className={styles.statContent}>
                      <span className={styles.statNumber}>
                        {course.numberOfLectures}
                      </span>
                      <span className={styles.statLabel}>Lectures</span>
                    </div>
                  </div>

                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>👨‍🏫</div>
                    <div className={styles.statContent}>
                      <span className={styles.statNumber}>
                        {course.createdBy}
                      </span>
                      <span className={styles.statLabel}>Instructor</span>
                    </div>
                  </div>

                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>⏱️</div>
                    <div className={styles.statContent}>
                      <span className={styles.statNumber}>
                        {course.duration}
                      </span>
                      <span className={styles.statLabel}>Duration</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Information */}
              <div className={styles.courseInfo}>
                <div className={styles.infoSection}>
                  <h3 className={styles.infoTitle}>Course Description</h3>
                  <p className={styles.infoText}>{course.description}</p>
                </div>

                {course.skills && course.skills.length > 0 && (
                  <div className={styles.infoSection}>
                    <h3 className={styles.infoTitle}>Skills You'll Learn</h3>
                    <div className={styles.skillsGrid}>
                      {course.skills.map((skill, index) => (
                        <span key={index} className={styles.skillTag}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className={styles.infoSection}>
                  <h3 className={styles.infoTitle}>Curriculum</h3>
                  <p className={styles.infoText}>{course.curriculum}</p>
                </div>

                <div className={styles.infoSection}>
                  <h3 className={styles.infoTitle}>Learning Outcomes</h3>
                  <p className={styles.infoText}>{course.outcomes}</p>
                </div>

                <div className={styles.enrollSection}>
                  <button
                    className={styles.enrollButton}
                    onClick={handleEnrollClick}
                  >
                    <span>Enroll Now</span>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M10 2L18 10L10 18M18 10H2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className={styles.facilitiesSection}>
        <div className={styles.container}>
          <div className={styles.facilitiesContent}>
            <h2 className={styles.facilitiesTitle}>
              World-Class Training Facilities
            </h2>

            <div className={styles.facilitiesGrid}>
              <div className={styles.facilityCard}>
                <div className={styles.facilityIcon}>🏭</div>
                <h3 className={styles.facilityTitle}>Modern Workshops</h3>
                <p className={styles.facilityDescription}>
                  Fully equipped workshops with industry-standard tools and
                  equipment for hands-on learning.
                </p>
              </div>

              <div className={styles.facilityCard}>
                <div className={styles.facilityIcon}>💻</div>
                <h3 className={styles.facilityTitle}>Computer Labs</h3>
                <p className={styles.facilityDescription}>
                  State-of-the-art computer laboratories with latest software
                  and high-speed internet connectivity.
                </p>
              </div>

              <div className={styles.facilityCard}>
                <div className={styles.facilityIcon}>🏢</div>
                <h3 className={styles.facilityTitle}>Industry Partnerships</h3>
                <p className={styles.facilityDescription}>
                  Direct partnerships with leading companies for internships and
                  job placement opportunities.
                </p>
              </div>
            </div>

            <p className={styles.facilitiesNote}>
              Students benefit from daily practical workshops, industrial
              visits, and partnerships with industry practitioners to meet NBTE
              certification standards.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.ctaBanner}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Start Your Journey?</h2>
            <p className={styles.ctaSubtitle}>
              Contact us to learn more about our NSQ programs and how to enroll
              in this course.
            </p>
            <button className={styles.ctaButton} onClick={handleEnrollClick}>
              <span>Get in Touch</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 2L18 10L10 18M18 10H2"
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
    </main>
  );
};

export default CourseDescription;
