import { useState, useEffect } from 'react';
import styles from './Contact.module.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isVisible, setIsVisible] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

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

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  const contactMethods = [
    {
      icon: '📍',
      title: 'Visit Us',
      detail: 'No. 22 Ni\'ma Road, Hayin Danmani',
      subDetail: 'Kaduna, Nigeria',
      action: 'Get Directions',
      link: 'https://maps.google.com',
    },
    {
      icon: '📞',
      title: 'Call Us',
      detail: '+234 901 883 7909',
      subDetail: 'Mon-Fri 8AM-5PM',
      action: 'Call Now',
      link: 'tel:+2349018837909',
    },
    {
      icon: '📧',
      title: 'Email Us',
      detail: 'info@brainstormskills.com.ng',
      subDetail: 'We reply within 24 hours',
      action: 'Send Email',
      link: 'mailto:info@brainstormskills.com.ng',
    },
  ];

  const quickLinks = [
    { icon: '🎓', title: 'Course Inquiry', description: 'Learn about our NSQ courses' },
    { icon: '📝', title: 'Admission', description: 'Start your application' },
    { icon: '💼', title: 'Partnership', description: 'Collaborate with us' },
    { icon: '🤝', title: 'Support', description: 'Get help and assistance' },
  ];

  return (
    <main className={styles.contactPage}>
      {/* Hero Section */}
      <section className={styles.hero} id="hero">
        <div className={styles.heroPattern}></div>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <span className={styles.badge}>
              <span className={styles.badgeIcon}>💬</span>
              <span>Get In Touch</span>
            </span>
            <h1 className={styles.heroTitle}>
              Let's Start a<br />Conversation
            </h1>
            <p className={styles.heroSubtitle}>
              Have questions about our programs? Want to enroll? We're here to help you take the next step.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className={`${styles.section} ${styles.methods}`} id="methods">
        <div className={styles.container}>
          <div className={`${styles.methodsGrid} ${isVisible.methods ? styles.animate : ''}`}>
            {contactMethods.map((method, index) => (
              <a
                key={index}
                href={method.link}
                className={styles.methodCard}
                target={method.link.startsWith('http') ? '_blank' : '_self'}
                rel={method.link.startsWith('http') ? 'noopener noreferrer' : ''}
              >
                <div className={styles.methodIcon}>{method.icon}</div>
                <h3 className={styles.methodTitle}>{method.title}</h3>
                <p className={styles.methodDetail}>{method.detail}</p>
                <p className={styles.methodSub}>{method.subDetail}</p>
                <div className={styles.methodAction}>
                  <span>{method.action}</span>
                  <span className={styles.methodArrow}>→</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className={`${styles.section} ${styles.mainContact}`} id="contact">
        <div className={styles.container}>
          <div className={styles.contactGrid}>
            {/* Form Section */}
            <div className={`${styles.formSection} ${isVisible.contact ? styles.animate : ''}`}>
              <div className={styles.formHeader}>
                <h2 className={styles.formTitle}>Send us a Message</h2>
                <p className={styles.formSubtitle}>
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              <form onSubmit={handleSubmit} className={styles.contactForm}>
                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${focusedField === 'name' || formData.name ? styles.focused : ''}`}>
                    <label htmlFor="name" className={styles.formLabel}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      className={styles.formInput}
                      required
                    />
                  </div>

                  <div className={`${styles.formGroup} ${focusedField === 'email' || formData.email ? styles.focused : ''}`}>
                    <label htmlFor="email" className={styles.formLabel}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className={styles.formInput}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${focusedField === 'phone' || formData.phone ? styles.focused : ''}`}>
                    <label htmlFor="phone" className={styles.formLabel}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                      className={styles.formInput}
                    />
                  </div>

                  <div className={`${styles.formGroup} ${focusedField === 'subject' || formData.subject ? styles.focused : ''}`}>
                    <label htmlFor="subject" className={styles.formLabel}>
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('subject')}
                      onBlur={() => setFocusedField(null)}
                      className={styles.formInput}
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="course-inquiry">Course Inquiry</option>
                      <option value="admission">Admission</option>
                      <option value="partnership">Partnership</option>
                      <option value="general">General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth} ${focusedField === 'message' || formData.message ? styles.focused : ''}`}>
                  <label htmlFor="message" className={styles.formLabel}>
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    className={styles.formTextarea}
                    rows="6"
                    required
                  ></textarea>
                </div>

                <button type="submit" className={styles.submitButton}>
                  <span>Send Message</span>
                  <span className={styles.buttonArrow}>→</span>
                </button>
              </form>
            </div>

            {/* Info Section */}
            <div className={`${styles.infoSection} ${isVisible.contact ? styles.animate : ''}`}>
              <div className={styles.infoCard}>
                <div className={styles.infoHeader}>
                  <h3 className={styles.infoTitle}>Quick Links</h3>
                  <p className={styles.infoSubtitle}>What are you interested in?</p>
                </div>
                
                <div className={styles.quickLinks}>
                  {quickLinks.map((link, index) => (
                    <div key={index} className={styles.quickLink}>
                      <div className={styles.quickLinkIcon}>{link.icon}</div>
                      <div className={styles.quickLinkText}>
                        <h4 className={styles.quickLinkTitle}>{link.title}</h4>
                        <p className={styles.quickLinkDesc}>{link.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoHeader}>
                  <h3 className={styles.infoTitle}>Office Hours</h3>
                  <p className={styles.infoSubtitle}>When we're available</p>
                </div>
                
                <div className={styles.scheduleList}>
                  <div className={styles.scheduleItem}>
                    <span className={styles.scheduleDay}>Monday - Friday</span>
                    <span className={styles.scheduleTime}>8:00 AM - 5:00 PM</span>
                  </div>
                  <div className={styles.scheduleItem}>
                    <span className={styles.scheduleDay}>Saturday</span>
                    <span className={styles.scheduleTime}>9:00 AM - 2:00 PM</span>
                  </div>
                  <div className={`${styles.scheduleItem} ${styles.closed}`}>
                    <span className={styles.scheduleDay}>Sunday</span>
                    <span className={styles.scheduleTime}>Closed</span>
                  </div>
                </div>
              </div>

              <div className={`${styles.infoCard} ${styles.highlight}`}>
                <div className={styles.highlightIcon}>🎓</div>
                <h3 className={styles.highlightTitle}>Ready to Enroll?</h3>
                <p className={styles.highlightText}>
                  Start your journey with Brainstorm Academy today. Transform your future with our NBTE-certified programs.
                </p>
                <a href="/courses" className={styles.highlightButton}>
                  <span>Explore Courses</span>
                  <span className={styles.highlightArrow}>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className={styles.mapSection} id="map">
        <div className={styles.mapContainer}>
          <div className={styles.mapOverlay}>
            <div className={styles.mapCard}>
              <h3 className={styles.mapTitle}>Find Us on the Map</h3>
              <p className={styles.mapAddress}>
                No. 22 Ni'ma Road, Hayin Danmani<br />
                Kaduna, Nigeria
              </p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapButton}
              >
                <span>Open in Maps</span>
                <span className={styles.mapArrow}>→</span>
              </a>
            </div>
          </div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.0!2d7.4391!3d10.5105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDMwJzM3LjgiTiA3wrAyNicyMC44IkU!5e0!3m2!1sen!2sng!4v1234567890"
            className={styles.map}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Brainstorm Academy Location"
          ></iframe>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className={styles.faqTeaser}>
        <div className={styles.container}>
          <div className={styles.faqContent}>
            <h2 className={styles.faqTitle}>Have Questions?</h2>
            <p className={styles.faqText}>
              Check out our frequently asked questions or get in touch with our support team.
            </p>
            <div className={styles.faqButtons}>
              <a href="/faq" className={styles.faqButton}>
                <span>View FAQ</span>
              </a>
              <a href="#contact" className={styles.faqButtonSecondary}>
                <span>Contact Support</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;