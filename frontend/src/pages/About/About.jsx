import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './About.module.css';

const About = () => {
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on page load

    // Set up intersection observer for animations
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

    // Observe all sections
    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const nsqCourses = [
    {
      id: 'networking-system-security',
      title: 'Networking and System Security Installation',
      category: 'Technology',
      duration: '6 months',
      level: 'Intermediate',
    },
    {
      id: 'website-design-development',
      title: 'Website Design & Development',
      category: 'Technology',
      duration: '4 months',
      level: 'Beginner',
    },
    {
      id: 'mobile-phone-repair',
      title: 'Mobile Phone Repair',
      category: 'Technology',
      duration: '3 months',
      level: 'Beginner',
    },
    {
      id: 'electrical-installations',
      title: 'Electrical Installations',
      category: 'Engineering',
      duration: '6 months',
      level: 'Intermediate',
    },
    {
      id: 'furniture-making',
      title: 'Furniture Making',
      category: 'Craftsmanship',
      duration: '5 months',
      level: 'Intermediate',
    },
    {
      id: 'painting-decoration',
      title: 'Painting, Decoration & Finishes (Interior Design)',
      category: 'Arts & Design',
      duration: '4 months',
      level: 'Beginner',
    },
    {
      id: 'wood-work',
      title: 'Wood Work',
      category: 'Craftsmanship',
      duration: '4 months',
      level: 'Beginner',
    },
    {
      id: 'upholstery',
      title: 'Upholstery',
      category: 'Craftsmanship',
      duration: '3 months',
      level: 'Beginner',
    },
    {
      id: 'bricklaying-concreting',
      title: 'Bricklaying, Block laying, Concreting And Interlocking',
      category: 'Construction',
      duration: '6 months',
      level: 'Intermediate',
    },
    {
      id: 'plumbing-pipe-fitting',
      title: 'Plumbing & Pipe Fitting',
      category: 'Engineering',
      duration: '5 months',
      level: 'Intermediate',
    },
    {
      id: 'hospitality-catering',
      title: 'Hospitality & Catering',
      category: 'Service',
      duration: '4 months',
      level: 'Beginner',
    },
    {
      id: 'cosmetology-beauty',
      title: 'Cosmetology & Beauty Therapy',
      category: 'Beauty & Wellness',
      duration: '4 months',
      level: 'Beginner',
    },
    {
      id: 'fashion-design',
      title: 'Fashion Design & Garment Making',
      category: 'Arts & Design',
      duration: '5 months',
      level: 'Beginner',
    },
    {
      id: 'hardware-maintenance',
      title: 'Hardware Maintenance',
      category: 'Technology',
      duration: '3 months',
      level: 'Beginner',
    },
    {
      id: 'welding-fabrication',
      title: 'Welding And Fabrication',
      category: 'Engineering',
      duration: '5 months',
      level: 'Intermediate',
    },
    {
      id: 'home-electrical-appliances',
      title: 'Home Electrical Appliances',
      category: 'Engineering',
      duration: '3 months',
      level: 'Beginner',
    },
    {
      id: 'aluminium-fabrication',
      title: 'Aluminium Fabrication',
      category: 'Engineering',
      duration: '4 months',
      level: 'Intermediate',
    },
  ];

  const stats = [
    { number: '17+', label: 'NSQ Courses' },
    { number: '10+', label: 'Years Experience' },
    { number: '100%', label: 'NBTE Certified' },
    { number: '3Es', label: 'Guaranteed' },
  ];

  const features = [
    {
      icon: '🔬',
      title: 'Modern Laboratories',
      description: 'State-of-the-art lab equipment for hands-on learning',
    },
    {
      icon: '💻',
      title: 'Computer Lab',
      description: 'Fully equipped computer laboratory with internet access',
    },
    {
      icon: '🏗️',
      title: 'Workshop Facilities',
      description: 'Daily practical workshops and training sessions',
    },
    {
      icon: '🏢',
      title: 'Industry Visits',
      description: 'Regular industrial visits and excursions',
    },
  ];

  return (
    <main className={styles.aboutPage}>
      {/* Hero Section */}
      <section className={styles.hero} id='hero'>
        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>
              <span className={styles.badgeIcon}>🎓</span>
              <span>NBTE Approved</span>
            </div>
            <h1 className={styles.heroTitle}>
              About Brainstorm Academy Skills Learning Center
            </h1>
            <p className={styles.heroSubtitle}>
              Empowering youth with practical skills and NBTE-certified training
              for a brighter future
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

      {/* Profile Section */}
      <section className={`${styles.section} ${styles.profile}`} id='profile'>
        <div className={styles.container}>
          <header
            className={`${styles.sectionHeader} ${
              isVisible.profile ? styles.animate : ''
            }`}
          >
            <div className={styles.badge}>
              <span className={styles.badgeIcon}>🏛️</span>
              <span>Institution</span>
            </div>
            <h2 className={styles.sectionTitle}>Academy Profile</h2>
          </header>

          <div
            className={`${styles.content} ${
              isVisible.profile ? styles.animate : ''
            }`}
          >
            <div className={styles.textBlock}>
              <p className={styles.leadText}>
                Brainstorm Academy is a private training institution approved by
                the Kaduna State Government under the regulation of the Quality
                Assurance Board.
              </p>
              <p>
                It provides educational services in Nursery, Primary, and
                Secondary education, but is also approved by the National Board
                for Technical Education (NBTE) as a skills development center
                for National Skills Qualification (NSQ) Certification.
              </p>
            </div>

            <div className={styles.locationCard}>
              <div className={styles.locationHeader}>
                <span className={styles.locationIcon}>📍</span>
                <h3>Our Location</h3>
              </div>
              <p>No. 22 Ni'ma Road, Hayin Danmani, Kaduna-Nigeria</p>
              <p className={styles.locationNote}>
                The Academy focuses on providing knowledge and skills for youth,
                enabling them to proceed to Senior Secondary Schools, tertiary
                institutions, or enter the workforce as master craftsmen with
                NSQ certification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className={`${styles.section} ${styles.mission}`} id='mission'>
        <div className={styles.container}>
          <header
            className={`${styles.sectionHeader} ${
              isVisible.mission ? styles.animate : ''
            }`}
          >
            <div className={styles.badge}>
              <span className={styles.badgeIcon}>🎯</span>
              <span>Purpose</span>
            </div>
            <h2 className={styles.sectionTitle}>Mission and Vision</h2>
          </header>

          <div
            className={`${styles.missionContent} ${
              isVisible.mission ? styles.animate : ''
            }`}
          >
            <div className={styles.missionCard}>
              <div className={styles.cardIcon}>🚀</div>
              <h3>Our Mission</h3>
              <p>
                To be a focal basic and Senior Secondary Education Training
                Institution that will prepare children in both knowledge and
                skills ready for admission into tertiary institutions in all
                spheres of knowledge as well as empower the youth with skills in
                those skill gap areas for self-employment.
              </p>
            </div>

            <div className={styles.visionCard}>
              <div className={styles.cardIcon}>👁️</div>
              <h3>Our Vision</h3>
              <p>
                To provide both technical vocational competence and ethical
                integrity in order to ensure quality basic, secondary, and life
                skills training that guarantee achievement of the 3Es –
                Education, Employment, and Economic Independence.
              </p>
            </div>
          </div>

          <div
            className={`${styles.achievement} ${
              isVisible.mission ? styles.animate : ''
            }`}
          >
            <div className={styles.achievementIcon}>🏆</div>
            <div className={styles.achievementText}>
              <h4>First in Class</h4>
              <p>
                Brainstorm Academy is one of the foremost private basic
                education institutions in Hayin Danmani, Kaduna, and the first
                to secure NBTE approval as a skill development center.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NSQ Courses */}
      <section className={`${styles.section} ${styles.courses}`} id='courses'>
        <div className={styles.container}>
          <header
            className={`${styles.sectionHeader} ${
              isVisible.courses ? styles.animate : ''
            }`}
          >
            <div className={styles.badge}>
              <span className={styles.badgeIcon}>📚</span>
              <span>Curriculum</span>
            </div>
            <h2 className={styles.sectionTitle}>NSQ Courses Offered</h2>
            <p className={styles.sectionSubtitle}>
              Brainstorm Academy offers a range of NSQ courses combining theory,
              practical, and hands-on experience.
            </p>
          </header>

          <div
            className={`${styles.coursesGrid} ${
              isVisible.courses ? styles.animate : ''
            }`}
          >
            {nsqCourses.map((course, index) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className={`${styles.courseCard} ${
                  styles[`card${(index % 4) + 1}`]
                }`}
                aria-label={`Learn more about ${course.title}`}
              >
                <div className={styles.courseHeader}>
                  <span className={styles.courseCategory}>
                    {course.category}
                  </span>
                  <span className={styles.courseDuration}>
                    {course.duration}
                  </span>
                </div>
                <h3 className={styles.courseTitle}>{course.title}</h3>
                <div className={styles.courseFooter}>
                  <span className={styles.courseLevel}>{course.level}</span>
                  <span className={styles.courseArrow}>→</span>
                </div>
              </Link>
            ))}
          </div>

          <div
            className={`${styles.guarantee} ${
              isVisible.courses ? styles.animate : ''
            }`}
          >
            <div className={styles.guaranteeIcon}>✅</div>
            <div className={styles.guaranteeText}>
              <h4>Graduate Guarantee</h4>
              <p>
                Trainees are guaranteed the 3Es: <strong>Education</strong>,{' '}
                <strong>Employment</strong>, and{' '}
                <strong>Economic Independence</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Goal */}
      <section
        className={`${styles.section} ${styles.curriculum}`}
        id='curriculum'
      >
        <div className={styles.container}>
          <header
            className={`${styles.sectionHeader} ${
              isVisible.curriculum ? styles.animate : ''
            }`}
          >
            <div className={styles.badge}>
              <span className={styles.badgeIcon}>🎯</span>
              <span>Goals</span>
            </div>
            <h2 className={styles.sectionTitle}>Curriculum Goal</h2>
          </header>

          <div
            className={`${styles.curriculumContent} ${
              isVisible.curriculum ? styles.animate : ''
            }`}
          >
            <div className={styles.goalCard}>
              <div className={styles.goalIcon}>🎓</div>
              <h3>Academic Excellence</h3>
              <p>
                Our curricula are geared towards developing the abilities and
                skills of pupils, preparing them for Senior Secondary Education
                and tertiary institutions.
              </p>
            </div>

            <div className={styles.goalCard}>
              <div className={styles.goalIcon}>🛠️</div>
              <h3>Technical Competence</h3>
              <p>
                For skill-oriented courses, the curriculum focuses on developing
                technical competence and a positive work ethic.
              </p>
            </div>

            <div className={styles.goalCard}>
              <div className={styles.goalIcon}>💼</div>
              <h3>Career Readiness</h3>
              <p>
                Graduates are prepared for operative and supervisory jobs or to
                become small business owners.
              </p>
            </div>
          </div>

          <div
            className={`${styles.partnership} ${
              isVisible.curriculum ? styles.animate : ''
            }`}
          >
            <div className={styles.partnershipIcon}>🤝</div>
            <div className={styles.partnershipText}>
              <h4>Industry Partnerships</h4>
              <p>
                We have entered MoUs with industry practitioners to meet
                certification standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section
        className={`${styles.section} ${styles.facilities}`}
        id='facilities'
      >
        <div className={styles.container}>
          <header
            className={`${styles.sectionHeader} ${
              isVisible.facilities ? styles.animate : ''
            }`}
          >
            <div className={styles.badge}>
              <span className={styles.badgeIcon}>🏢</span>
              <span>Infrastructure</span>
            </div>
            <h2 className={styles.sectionTitle}>
              Facilities and Learning Features
            </h2>
          </header>

          <div
            className={`${styles.facilitiesGrid} ${
              isVisible.facilities ? styles.animate : ''
            }`}
          >
            {features.map((feature, index) => (
              <div key={index} className={styles.facilityCard}>
                <div className={styles.facilityIcon}>{feature.icon}</div>
                <h3 className={styles.facilityTitle}>{feature.title}</h3>
                <p className={styles.facilityDescription}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gender Policy */}
      <section
        className={`${styles.section} ${styles.genderPolicy}`}
        id='gender-policy'
      >
        <div className={styles.container}>
          <header
            className={`${styles.sectionHeader} ${
              isVisible['gender-policy'] ? styles.animate : ''
            }`}
          >
            <div className={styles.badge}>
              <span className={styles.badgeIcon}>⚖️</span>
              <span>Equality</span>
            </div>
            <h2 className={styles.sectionTitle}>Gender Policy</h2>
          </header>

          <div
            className={`${styles.policyContent} ${
              isVisible['gender-policy'] ? styles.animate : ''
            }`}
          >
            <div className={styles.policyCard}>
              <div className={styles.policyIcon}>🌟</div>
              <h3>Commitment to Equality</h3>
              <p>
                Brainstorm Academy is committed to gender equality, fostering an
                inclusive environment for all students, staff, and trainees. Our
                policy ensures equal opportunities, eliminates discrimination,
                and empowers women and girls through scholarships, mentorship
                programs, and gender-inclusive curriculum.
              </p>
            </div>

            <div className={styles.alignmentCard}>
              <div className={styles.alignmentIcon}>🎯</div>
              <h3>Policy Alignment</h3>
              <p>
                We promote gender-sensitive practices in recruitment, training,
                and partnerships, aligning with Nigeria's National Gender Policy
                and SDG 5.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.ctaBanner}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <div className={styles.ctaIcon}>💫</div>
            <h2 className={styles.ctaTitle}>Discover More About Us</h2>
            <p className={styles.ctaText}>
              Contact us to learn how Brainstorm Academy can empower you or your
              child.
            </p>
            <Link to='/contact' className={styles.ctaButton}>
              <span>Get in Touch</span>
              <span className={styles.ctaArrow}>→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
