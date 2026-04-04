import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "./Navbar.module.css";
import logo from "../../assets/images/logo_result.webp";

const Navbar = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setOpenDropdown(null);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const handleDropdownToggle = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const courseCategories = [
    {
      to: "/courses/information-technology",
      label: "Information Technology",
      icon: "💻",
    },
    { to: "/courses/web-development", label: "Web Development", icon: "🌐" },
    { to: "/courses/electronics", label: "Electronics", icon: "⚡" },
    { to: "/courses/engineering", label: "Engineering", icon: "⚙️" },
    { to: "/courses/craftsmanship", label: "Craftsmanship", icon: "🔨" },
    { to: "/courses/arts-design", label: "Arts & Design", icon: "🎨" },
    { to: "/courses/construction", label: "Construction", icon: "🏗️" },
    { to: "/courses/service", label: "Service", icon: "🛎️" },
    { to: "/courses/beauty-wellness", label: "Beauty & Wellness", icon: "💅" },
  ];

  const navStructure = [
    { to: "/", label: "Home", type: "link" },
    {
      label: "Courses",
      type: "dropdown",
      id: "courses",
      items: [
        { to: "/courses", label: "All Courses", featured: true },
        { type: "divider" },
        ...courseCategories,
      ],
    },
    {
      label: "About",
      type: "dropdown",
      id: "about",
      items: [
        { to: "/about", label: "About Us", featured: true },
        { to: "/about/compliance", label: "Compliance" },
        { to: "/about/scholarship", label: "Scholarship" },
      ],
    },
    { to: "/blog", label: "Blog", type: "link" },
    { to: "/contact", label: "Contact", type: "link" },
  ];

  return (
    <>
      <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
        <div className={styles.container}>
          {/* Logo */}
          <Link href="/" className={styles.logo} onClick={closeMobileMenu}>
            <img
              src={logo}
              alt="Brainstorm Skills"
              className={styles.logoImage}
            />
            <span className={styles.logoText}>Brainstorm</span>
          </Link>

          {/* Desktop Navigation */}
          <div className={styles.navMenu} ref={dropdownRef}>
            {navStructure.map((item) => (
              <div key={item.label} className={styles.navItem}>
                {item.type === "link" ? (
                  <Link
                    href={item.to}
                    className={`${styles.navLink} ${router.asPath === item.to ? styles.active : ""}`}
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <div className={styles.dropdownWrapper}>
                    <button
                      className={`${styles.navLink} ${styles.dropdownToggle} ${
                        openDropdown === item.id ? styles.open : ""
                      }`}
                      onClick={() => handleDropdownToggle(item.id)}
                      aria-expanded={openDropdown === item.id}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <svg
                        className={styles.chevron}
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M3 4.5L6 7.5L9 4.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    {openDropdown === item.id && (
                      <div className={styles.dropdown}>
                        {item.items.map((subItem, index) => {
                          if (subItem.type === "divider") {
                            return (
                              <div
                                key={index}
                                className={styles.dropdownDivider}
                              />
                            );
                          }
                          return (
                            <Link
                              key={subItem.to}
                              href={subItem.to}
                              className={`${styles.dropdownItem} ${
                                subItem.featured ? styles.featured : ""
                              } ${router.asPath === subItem.to ? styles.active : ""}`}
                              onClick={() => setOpenDropdown(null)}
                            >
                              {subItem.icon && (
                                <span className={styles.itemIcon}>
                                  {subItem.icon}
                                </span>
                              )}
                              <span>{subItem.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className={styles.navActions}>
            <Link href="/signin" className={styles.signInBtn} onClick={closeMobileMenu}>
              Sign in
            </Link>
            <Link href="/signup" className={styles.getStartedBtn} onClick={closeMobileMenu}>
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`${styles.mobileMenuBtn} ${
              isMobileMenuOpen ? styles.open : ""
            }`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className={styles.hamburger}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`${styles.mobileOverlay} ${
          isMobileMenuOpen ? styles.active : ""
        }`}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      {/* Mobile Menu */}
      <div
        className={`${styles.mobileMenu} ${
          isMobileMenuOpen ? styles.active : ""
        }`}
      >
        <div className={styles.mobileMenuContent}>
          {/* Mobile Header */}
          <div className={styles.mobileHeader}>
            <Link
              href="/"
              className={styles.mobileLogo}
              onClick={closeMobileMenu}
            >
              <img
                src={logo}
                alt="Brainstorm Skills"
                className={styles.mobileLogoImage}
              />
              <span>Brainstorm</span>
            </Link>
            <button
              className={styles.closeBtn}
              onClick={closeMobileMenu}
              aria-label="Close menu"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M18 6L6 18M6 6l12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className={styles.mobileNav}>
            {navStructure.map((item) => (
              <div key={item.label} className={styles.mobileNavItem}>
                {item.type === "link" ? (
                  <Link
                    href={item.to}
                    className={`${styles.mobileNavLink} ${router.asPath === item.to ? styles.active : ""}`}
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <>
                    <button
                      className={`${styles.mobileNavLink} ${
                        styles.mobileDropdownBtn
                      } ${openDropdown === item.id ? styles.open : ""}`}
                      onClick={() => handleDropdownToggle(item.id)}
                    >
                      <span>{item.label}</span>
                      <svg
                        className={styles.mobileChevron}
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M5 7.5L10 12.5L15 7.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    <div
                      className={`${styles.mobileSubmenu} ${
                        openDropdown === item.id ? styles.open : ""
                      }`}
                    >
                      {item.items.map((subItem, index) => {
                        if (subItem.type === "divider") {
                          return (
                            <div
                              key={index}
                              className={styles.mobileSubmenuDivider}
                            />
                          );
                        }
                        return (
                          <Link
                            key={subItem.to}
                            href={subItem.to}
                            className={`${styles.mobileSubmenuItem} ${
                              subItem.featured ? styles.featured : ""
                            } ${router.asPath === subItem.to ? styles.active : ""}`}
                            onClick={closeMobileMenu}
                          >
                            {subItem.icon && (
                              <span className={styles.submenuIcon}>
                                {subItem.icon}
                              </span>
                            )}
                            <span>{subItem.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Actions */}
          <div className={styles.mobileActions}>
            <Link
              href="/signin"
              className={styles.mobileSignInBtn}
              onClick={closeMobileMenu}
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className={styles.mobileGetStartedBtn}
              onClick={closeMobileMenu}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
