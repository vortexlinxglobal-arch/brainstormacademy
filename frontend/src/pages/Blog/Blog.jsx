// src/pages/Blog/Blog.jsx
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { blogPosts, categories, getFeaturedPosts } from '../../data/blogData';
import styles from './Blog.module.css';

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isVisible, setIsVisible] = useState({});
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState('');

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

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [searchParams]);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    if (categoryId === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: categoryId });
    }
  };

  const featuredPosts = getFeaturedPosts();
  const regularPosts = blogPosts.filter(post => !post.featured);

  const filteredPosts = regularPosts.filter((post) => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
                         post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className={styles.blogPage}>
      {/* Hero Section */}
      <section className={styles.hero} id="hero">
        <div className={styles.heroPattern}></div>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <span className={styles.badge}>
              <span className={styles.badgeIcon}>📝</span>
              <span>Blog & Insights</span>
            </span>
            <h1 className={styles.heroTitle}>
              Stories, Insights<br />& Knowledge
            </h1>
            <p className={styles.heroSubtitle}>
              Explore articles about education, skills development, career tips, and the latest news from Brainstorm Academy.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className={`${styles.section} ${styles.filterSection}`} id="filter">
        <div className={styles.container}>
          <div className={`${styles.searchBar} ${isVisible.filter ? styles.animate : ''}`}>
            <div className={styles.searchIcon}>🔍</div>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={`${styles.categories} ${isVisible.filter ? styles.animate : ''}`}>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`${styles.categoryButton} ${
                  activeCategory === category.id ? styles.active : ''
                }`}
              >
                <span className={styles.categoryIcon}>{category.icon}</span>
                <span className={styles.categoryName}>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {activeCategory === 'all' && !searchQuery && (
        <section className={`${styles.section} ${styles.featured}`} id="featured">
          <div className={styles.container}>
            <header className={`${styles.sectionHeader} ${isVisible.featured ? styles.animate : ''}`}>
              <div className={styles.badge}>
                <span className={styles.badgeIcon}>⭐</span>
                <span>Featured</span>
              </div>
              <h2 className={styles.sectionTitle}>Top Stories</h2>
            </header>

            <div className={`${styles.featuredGrid} ${isVisible.featured ? styles.animate : ''}`}>
              {featuredPosts.map((post, index) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className={`${styles.featuredCard} ${index === 0 ? styles.large : ''}`}
                >
                  <div className={styles.featuredImage}>
                    <div className={styles.featuredEmoji}>{post.image}</div>
                    <div className={styles.featuredOverlay}>
                      <span className={styles.featuredBadge}>Featured</span>
                    </div>
                  </div>
                  <div className={styles.featuredContent}>
                    <div className={styles.featuredMeta}>
                      <span className={styles.featuredCategory}>
                        {categories.find(c => c.id === post.category)?.name}
                      </span>
                      <span className={styles.featuredDate}>
                        {new Date(post.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <h3 className={styles.featuredTitle}>{post.title}</h3>
                    <p className={styles.featuredExcerpt}>{post.excerpt}</p>
                    <div className={styles.featuredFooter}>
                      <span className={styles.featuredAuthor}>By {post.author.name}</span>
                      <span className={styles.featuredRead}>{post.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className={`${styles.section} ${styles.posts}`} id="posts">
        <div className={styles.container}>
          <header className={`${styles.sectionHeader} ${isVisible.posts ? styles.animate : ''}`}>
            <h2 className={styles.sectionTitle}>
              {activeCategory === 'all' ? 'Latest Articles' : categories.find(c => c.id === activeCategory)?.name}
            </h2>
            <p className={styles.sectionSubtitle}>
              {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'} found
            </p>
          </header>

          {filteredPosts.length > 0 ? (
            <div className={`${styles.postsGrid} ${isVisible.posts ? styles.animate : ''}`}>
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className={styles.postCard}
                >
                  <div className={styles.postImage}>
                    <div className={styles.postEmoji}>{post.image}</div>
                  </div>
                  <div className={styles.postContent}>
                    <div className={styles.postMeta}>
                      <span className={styles.postCategory}>
                        {categories.find(c => c.id === post.category)?.icon}{' '}
                        {categories.find(c => c.id === post.category)?.name}
                      </span>
                      <span className={styles.postRead}>{post.readTime}</span>
                    </div>
                    <h3 className={styles.postTitle}>{post.title}</h3>
                    <p className={styles.postExcerpt}>{post.excerpt}</p>
                    <div className={styles.postFooter}>
                      <div className={styles.postAuthorInfo}>
                        <span className={styles.postAuthor}>By {post.author.name}</span>
                        <span className={styles.postDate}>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <span className={styles.postArrow}>→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>🔍</div>
              <h3 className={styles.noResultsTitle}>No Articles Found</h3>
              <p className={styles.noResultsText}>
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className={styles.resetButton}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className={styles.newsletter}>
        <div className={styles.container}>
          <div className={styles.newsletterContent}>
            <div className={styles.newsletterText}>
              <span className={styles.newsletterIcon}>📬</span>
              <div>
                <h2 className={styles.newsletterTitle}>Stay Updated</h2>
                <p className={styles.newsletterSubtitle}>
                  Subscribe to our newsletter for the latest articles, tips, and academy news.
                </p>
              </div>
            </div>
            <div className={styles.newsletterForm}>
              <input
                type="email"
                placeholder="Enter your email"
                className={styles.newsletterInput}
              />
              <button className={styles.newsletterButton}>
                <span>Subscribe</span>
                <span className={styles.newsletterArrow}>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.ctaBanner}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <div className={styles.ctaIcon}>💬</div>
            <h2 className={styles.ctaTitle}>Have a Story to Share?</h2>
            <p className={styles.ctaText}>
              We'd love to hear from you. Contact us to contribute or share your success story.
            </p>
            <Link to="/contact" className={styles.ctaButton}>
              <span>Get in Touch</span>
              <span className={styles.ctaArrow}>→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Blog;