import { useState, useEffect } from "react";
import styles from "./Faqs.module.css";

const FAQs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      id: 1,
      category: "Admission",
      question: "What are the admission requirements for your programs?",
      answer:
        "Admission requirements vary by program. Generally, you need a minimum of SSCE (O'Level) with at least 5 credits including English and Mathematics. Some advanced programs may require additional qualifications. We also accept candidates with passion and willingness to learn, regardless of their educational background for certain skill-based programs.",
    },
    {
      id: 2,
      category: "Admission",
      question:
        "How do I apply for a course at Brainstorm Skills Training Center?",
      answer:
        "You can apply online through our website, visit our center in Kaduna, or call our admission office. The application process is simple: fill out the application form, submit required documents, pay the application fee, and attend an interview or orientation session. Our admission team will guide you through each step.",
    },
    {
      id: 3,
      category: "Programs",
      question: "Are your certificates recognized nationally?",
      answer:
        "Yes! All our programs are NBTE (National Board for Technical Education) approved and nationally recognized. We also partner with professional bodies like CPN (Computer Professionals of Nigeria) and ITPN (Institute of Tourism Professionals of Nigeria). Our certificates are accepted by employers across Nigeria and can help you advance your career or start your own business.",
    },
    {
      id: 4,
      category: "Programs",
      question: "What is the duration of your training programs?",
      answer:
        "Program duration varies depending on the course. Short courses run for 8-10 weeks, intermediate programs last 12-14 weeks, and comprehensive programs can extend to 16-20 weeks. We offer both full-time and part-time schedules to accommodate working professionals and students. Weekend and evening classes are also available.",
    },
    {
      id: 5,
      category: "Fees",
      question: "How much do your programs cost?",
      answer:
        "Tuition fees vary by program type and duration. Short courses start from ₦12,000, while comprehensive professional programs range from ₦15,000 to ₦25,000. We offer flexible payment plans, installment options, and scholarship opportunities for deserving students. Contact our admission office for detailed fee structure for your chosen program.",
    },
    {
      id: 6,
      category: "Fees",
      question: "Do you offer payment plans or scholarships?",
      answer:
        "Yes! We understand financial constraints and offer flexible payment options. You can pay in installments (2-3 payments throughout the program duration). We also provide merit-based scholarships covering 20-50% of tuition fees for exceptional students. Additionally, we have special discounts for early registration and group enrollments.",
    },
    {
      id: 7,
      category: "Training",
      question: "What teaching methods do you use?",
      answer:
        "We use a hands-on, practical approach to learning. Our training combines classroom theory (20%) with practical workshops and projects (80%). Students work on real-world projects, use industry-standard tools and equipment, and learn from experienced instructors with active industry experience. We also provide one-on-one mentoring and career guidance.",
    },
    {
      id: 8,
      category: "Training",
      question: "Do you provide job placement assistance?",
      answer:
        "Absolutely! We have a dedicated career services department that assists graduates with job placement. Our services include resume building, interview preparation, internship opportunities, and direct connections with employers. We maintain a 95% job placement rate, and many of our graduates have started successful businesses or secured employment in reputable organizations.",
    },
    {
      id: 9,
      category: "Facilities",
      question: "What facilities and equipment are available for training?",
      answer:
        "Our center is equipped with modern facilities including fully-equipped computer labs, woodworking workshops, fabrication studios, sewing and fashion design studios, and specialized equipment for each program. We provide all necessary tools and materials for practical training. Our facilities meet NBTE standards and are regularly updated with current industry equipment.",
    },
    {
      id: 10,
      category: "General",
      question: "Can I visit the center before enrolling?",
      answer:
        "Yes, we encourage prospective students to visit! Our center is open Monday to Friday, 8:00 AM - 5:00 PM, and Saturday 9:00 AM - 2:00 PM. You can tour our facilities, meet instructors, speak with current students, and get all your questions answered. We also conduct open house events quarterly. Contact us to schedule your visit or book a free consultation.",
    },
  ];

  const categories = [
    "All",
    "Admission",
    "Programs",
    "Fees",
    "Training",
    "Facilities",
    "General",
  ];
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFAQs =
    selectedCategory === "All"
      ? faqs
      : faqs.filter((faq) => faq.category === selectedCategory);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <header
          className={`${styles.header} ${isVisible ? styles.visible : ""}`}
        >
          <span className={styles.label}>Support</span>
          <h2 className={styles.title}>Frequently Asked Questions</h2>
          <p className={styles.subtitle}>
            Everything you need to know about our programs, admission, and
            facilities
          </p>
        </header>

        {/* Category Filter */}
        <div className={styles.categories}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.categoryBtn} ${
                selectedCategory === category ? styles.active : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className={styles.faqList}>
          {filteredFAQs.map((faq, index) => (
            <article
              key={faq.id}
              className={`${styles.faqItem} ${
                openIndex === index ? styles.open : ""
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <button
                className={styles.faqQuestion}
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <span className={styles.questionText}>{faq.question}</span>
                <svg
                  className={styles.icon}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div className={styles.faqAnswer}>
                <p className={styles.answerText}>{faq.answer}</p>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Section */}
        <div className={styles.cta}>
          <h3 className={styles.ctaTitle}>Still have questions?</h3>
          <p className={styles.ctaText}>
            Our team is here to help. Contact us for personalized assistance.
          </p>
          <div className={styles.ctaButtons}>
            <button className={styles.primaryBtn}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M2.5 6.66667L10 11.6667L17.5 6.66667M2.5 6.66667V13.3333C2.5 13.7754 2.67559 14.1993 2.98816 14.5118C3.30072 14.8244 3.72464 15 4.16667 15H15.8333C16.2754 15 16.6993 14.8244 17.0118 14.5118C17.3244 14.1993 17.5 13.7754 17.5 13.3333V6.66667M2.5 6.66667C2.5 6.22464 2.67559 5.80072 2.98816 5.48816C3.30072 5.17559 3.72464 5 4.16667 5H15.8333C16.2754 5 16.6993 5.17559 17.0118 5.48816C17.3244 5.80072 17.5 6.22464 17.5 6.66667"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Contact Us
            </button>
            <button className={styles.secondaryBtn}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M2.5 3.33334H6.66667L8.75 10.8333L6.25 12.5C7.36339 14.7256 9.27442 16.6366 11.5 17.75L13.1667 15.25L17.5 17.5V17.5C17.5 18.163 16.9632 18.75 16.25 18.75H15.8333C8.46691 18.75 2.5 12.783 2.5 5.41667V5C2.5 4.33696 3.03696 3.80001 3.7 3.77084L2.5 3.33334Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Call Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
