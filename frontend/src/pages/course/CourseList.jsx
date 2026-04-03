import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./CourseList.module.css";

const CourseList = () => {
  const [isVisible, setIsVisible] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Check if mobile on mount and resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);

    // Set up intersection observer for animations (desktop only)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all sections - but immediately show on mobile
    document.querySelectorAll("section[id]").forEach((section) => {
      if (isMobile) {
        // On mobile, show everything immediately
        setIsVisible((prev) => ({
          ...prev,
          [section.id]: true,
        }));
      } else {
        // On desktop, use intersection observer
        observer.observe(section);
      }
    });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  const courses = [
    {
      id: "networking-system-security",
      title: "Networking and System Security Installation",
      thumbnail: "/assets/course-thumbnails/networking_result.webp",
      description:
        "Learn to design, install, and maintain secure network systems. This course covers network configuration, cybersecurity protocols, and system maintenance.",
      category: "Information Technology",
      createdBy: "Lukman Lukman",
      duration: "6 months",
      level: "Intermediate",
      price: "Contact for pricing",
    },
    {
      id: "website-design-development",
      title: "Website Design & Development",
      thumbnail: "/assets/course-thumbnails/web-design_result.webp",
      description:
        "Master the art of creating responsive, user-friendly websites. This course covers HTML, CSS, JavaScript, and modern frameworks.",
      category: "Web Development",
      createdBy: "Lukman Lukman",
      duration: "4 months",
      level: "Beginner",
      price: "Contact for pricing",
    },
    {
      id: "mobile-phone-repair",
      title: "Mobile Phone Repair",
      thumbnail: "/assets/course-thumbnails/mobile-repair_result.webp",
      description:
        "Gain expertise in diagnosing and repairing mobile devices. This course covers hardware troubleshooting and software updates.",
      category: "Electronics",
      createdBy: "Ashiru Ahamd Rufai",
      duration: "3 months",
      level: "Beginner",
      price: "Contact for pricing",
    },
    {
      id: "electrical-installations",
      title: "Electrical Installations",
      thumbnail: "/assets/course-thumbnails/electrical_result.webp",
      description:
        "Learn to install and maintain electrical systems safely and efficiently. This course covers wiring and safety standards.",
      category: "Engineering",
      createdBy: "Idris Shuaibu",
      duration: "6 months",
      level: "Intermediate",
      price: "Contact for pricing",
    },
    {
      id: "furniture-making",
      title: "Furniture Making",
      thumbnail: "/assets/course-thumbnails/furniture_result.webp",
      description:
        "Develop skills in crafting high-quality furniture. This course teaches woodworking and design techniques.",
      category: "Craftsmanship",
      createdBy: "Fatima Bello",
      duration: "5 months",
      level: "Intermediate",
      price: "Contact for pricing",
    },
    {
      id: "painting-decoration",
      title: "Painting, Decoration & Finishes (Interior Design)",
      thumbnail: "/assets/course-thumbnails/painting_result.webp",
      description:
        "Master the art of interior painting and decoration. This course covers color theory and finishing techniques.",
      category: "Arts & Design",
      createdBy: "Abdullahi Muhammad",
      duration: "4 months",
      level: "Beginner",
      price: "Contact for pricing",
    },
    {
      id: "wood-work",
      title: "Wood Work",
      thumbnail: "/assets/course-thumbnails/woodwork_result.webp",
      description:
        "Learn advanced woodworking techniques for creating functional and aesthetic wooden structures.",
      category: "Craftsmanship",
      createdBy: "Ibrahim Yusuf",
      duration: "4 months",
      level: "Beginner",
      price: "Contact for pricing",
    },
    {
      id: "upholstery",
      title: "Upholstery",
      thumbnail: "/assets/course-thumbnails/upholstery_result.webp",
      description:
        "Gain skills in upholstering furniture, from fabric selection to final assembly.",
      category: "Craftsmanship",
      createdBy: "Maryam Suleiman",
      duration: "3 months",
      level: "Beginner",
      price: "Contact for pricing",
    },
    {
      id: "bricklaying-concreting",
      title: "Bricklaying, Block laying, Concreting And Interlocking",
      thumbnail: "/assets/course-thumbnails/bricklaying_result.webp",
      description:
        "Learn construction techniques for bricklaying, concreting, and interlocking paving.",
      category: "Construction",
      createdBy: "Abdullahi Musa",
      duration: "6 months",
      level: "Intermediate",
      price: "Contact for pricing",
    },
    {
      id: "plumbing-pipe-fitting",
      title: "Plumbing & Pipe Fitting",
      thumbnail: "/assets/course-thumbnails/plumbing_result.webp",
      description:
        "Master plumbing systems and pipe fitting for residential and commercial buildings.",
      category: "Engineering",
      createdBy: "Salisu Lawal",
      duration: "5 months",
      level: "Intermediate",
      price: "Contact for pricing",
    },
    {
      id: "hospitality-catering",
      title: "Hospitality & Catering",
      thumbnail: "/assets/course-thumbnails/hospitality_result.webp",
      description:
        "Develop skills in food preparation, service, and hospitality management.",
      category: "Service",
      createdBy: "Fateema Garba Suleiman",
      duration: "4 months",
      level: "Beginner",
      price: "Contact for pricing",
    },
    {
      id: "cosmetology-beauty",
      title: "Cosmetology & Beauty Therapy",
      thumbnail: "/assets/course-thumbnails/cosmetology_result.webp",
      description:
        "Learn professional beauty techniques, including makeup, haircare, and skincare.",
      category: "Beauty & Wellness",
      createdBy: "Sa'adatu Muhammad",
      duration: "4 months",
      level: "Beginner",
      price: "Contact for pricing",
    },
    {
      id: "fashion-design",
      title: "Fashion Design & Garment Making",
      thumbnail: "/assets/course-thumbnails/fashion_result.webp",
      description:
        "Create stylish garments through design and sewing techniques.",
      category: "Arts & Design",
      createdBy: "Hauwakulu Muhammad",
      duration: "5 months",
      level: "Beginner",
      price: "Contact for pricing",
    },
    {
      id: "hardware-maintenance",
      title: "Hardware Maintenance",
      thumbnail: "/assets/course-thumbnails/hardware_result.webp",
      description: "Learn to maintain and repair computer hardware systems.",
      category: "Information Technology",
      createdBy: "Ashiru Ahmad",
      duration: "3 months",
      level: "Beginner",
      price: "Contact for pricing",
    },
    {
      id: "welding-fabrication",
      title: "Welding And Fabrication",
      thumbnail: "/assets/course-thumbnails/welding_result.webp",
      description:
        "Master welding techniques for metal fabrication in construction and manufacturing.",
      category: "Engineering",
      createdBy: "Damilola John",
      duration: "5 months",
      level: "Intermediate",
      price: "Contact for pricing",
    },
    {
      id: "home-electrical-appliances",
      title: "Home Electrical Appliances",
      thumbnail: "/assets/course-thumbnails/appliances_result.webp",
      description:
        "Learn to repair and maintain household electrical appliances.",
      category: "Electronics",
      createdBy: "Idris Shuaibu",
      duration: "3 months",
      level: "Beginner",
      price: "Contact for pricing",
    },
    {
      id: "aluminium-fabrication",
      title: "Aluminium Fabrication",
      thumbnail: "/assets/course-thumbnails/aluminium_result.webp",
      description:
        "Develop skills in fabricating aluminium structures for windows, doors, and more.",
      category: "Engineering",
      createdBy: "Umar Farouk",
      duration: "4 months",
      level: "Intermediate",
      price: "Contact for pricing",
    },
  ];

  const categories = [
    "All",
    ...new Set(courses.map((course) => course.category)),
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = [
    { number: "17+", label: "NSQ Courses" },
    { number: "100%", label: "NBTE Certified" },
    { number: "6-Month", label: "Average Duration" },
    { number: "Industry", label: "Recognized" },
  ];

  return (
    <main className={styles.courseListPage}>
      {/* Hero Section */}
      <section className={styles.hero} id="hero">
        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>
              <span className={styles.badgeText}>NSQ Certified Programs</span>
            </div>
            <h1 className={styles.heroTitle}>Our NSQ Courses</h1>
            <p className={styles.heroSubtitle}>
              Explore our National Skills Qualification (NSQ) certified programs
              designed to empower your future with practical skills
            </p>

            <div className={styles.heroStats}>
              {stats.map((stat, index) => (
                <div key={index} className={styles.statItem}>
                  <span className={styles.statNumber}>{stat.number}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className={styles.filtersSection} id="filters">
        <div className={styles.container}>
          <div
            className={`${styles.filtersContent} ${
              isVisible.filters ? styles.animate : ""
            }`}
          >
            {/* Search Bar */}
            <div className={styles.searchWrapper}>
              <div className={styles.searchBox}>
                <svg
                  className={styles.searchIcon}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M21 21L16.514 16.506M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>

            {/* Category Filters */}
            <div className={styles.categoryFilters}>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`${styles.categoryBtn} ${
                    selectedCategory === category ? styles.active : ""
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div
            className={`${styles.resultsInfo} ${
              isVisible.filters ? styles.animate : ""
            }`}
          >
            <p className={styles.resultsText}>
              Showing {filteredCourses.length} of {courses.length} courses
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
        </div>
      </section>

      {/* Course List */}
      <section
        className={`${styles.section} ${styles.courseList}`}
        id="courses"
      >
        <div className={styles.container}>
          <header
            className={`${styles.sectionHeader} ${
              isVisible.courses ? styles.animate : ""
            }`}
          >
            <h2 className={styles.sectionTitle}>All Courses</h2>
            <p className={styles.sectionSubtitle}>
              Choose a course to empower your future with practical skills and
              industry-recognized certifications
            </p>
          </header>

          <div
            className={`${styles.coursesGrid} ${
              isVisible.courses ? styles.animate : ""
            }`}
          >
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, index) => (
                <article
                  key={course.id}
                  className={`${styles.courseCard} ${
                    styles[`card${(index % 4) + 1}`]
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Link
                    to={`/courses/description/${course.id}`}
                    className={styles.courseLink}
                  >
                    <div className={styles.courseImageWrapper}>
                      <img
                        src={course.thumbnail}
                        alt={`${course.title} course thumbnail`}
                        className={styles.courseImage}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <div
                        className={styles.imagePlaceholder}
                        style={{ display: "none" }}
                      >
                        <span className={styles.placeholderText}>Course</span>
                      </div>
                      <div className={styles.courseOverlay}>
                        <span className={styles.viewCourse}>View Course</span>
                      </div>
                    </div>

                    <div className={styles.courseContent}>
                      <div className={styles.courseHeader}>
                        <span className={styles.courseCategory}>
                          {course.category}
                        </span>
                        <span className={styles.courseLevel}>
                          {course.level}
                        </span>
                      </div>

                      <h3 className={styles.courseTitle}>{course.title}</h3>

                      <p className={styles.courseDescription}>
                        {course.description}
                      </p>

                      <div className={styles.courseFooter}>
                        <div className={styles.courseInstructor}>
                          <div className={styles.instructorAvatar}>
                            {course.createdBy
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <span className={styles.instructorName}>
                            {course.createdBy}
                          </span>
                        </div>

                        <div className={styles.courseMeta}>
                          <div className={styles.metaItem}>
                            <svg
                              className={styles.metaIcon}
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H11.5v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.65c.1 1.6 1.18 2.68 2.87 2.95V19h1.71v-2.05c1.51-.32 2.72-1.35 2.72-2.91-.01-2.03-1.74-2.73-3.64-3.9z" />
                            </svg>
                            <span className={styles.metaText}>
                              {course.price}
                            </span>
                          </div>

                          <div className={styles.metaItem}>
                            <svg
                              className={styles.metaIcon}
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                                fill="currentColor"
                              />
                              <path
                                d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"
                                fill="currentColor"
                              />
                            </svg>
                            <span className={styles.metaText}>
                              {course.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))
            ) : (
              <div className={styles.noResults}>
                <div className={styles.noResultsIcon}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 21L16.514 16.506M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className={styles.noResultsTitle}>No courses found</h3>
                <p className={styles.noResultsText}>
                  Try adjusting your search terms or category filters
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                  }}
                  className={styles.clearFiltersBtn}
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.ctaBanner}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Start Learning?</h2>
            <p className={styles.ctaText}>
              Contact us to enroll in our NSQ programs and begin your journey to
              professional certification
            </p>
            <div className={styles.ctaButtons}>
              <Link to="/contact" className={styles.primaryBtn}>
                <span>Get in Touch</span>
                <span className={styles.btnArrow}>→</span>
              </Link>
              <Link to="/about" className={styles.secondaryBtn}>
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CourseList;
