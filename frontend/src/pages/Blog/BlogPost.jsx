// src/pages/Blog/BlogPost.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBlogPostBySlug, getRelatedPosts, categories } from '../../data/blogData';
import styles from './BlogPost.module.css';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);

    // Get the blog post
    const blogPost = getBlogPostBySlug(slug);
    
    if (!blogPost) {
      // Redirect to blog page if post not found
      navigate('/blog');
      return;
    }

    console.log('Blog Post Data:', blogPost); // Debug log
    console.log('Content:', blogPost.content); // Debug log

    setPost(blogPost);
    setRelatedPosts(getRelatedPosts(blogPost.id));

    // Intersection observer for animations
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

    setTimeout(() => {
      document.querySelectorAll('section[id]').forEach((section) => {
        observer.observe(section);
      });
    }, 100);

    return () => observer.disconnect();
  }, [slug, navigate]);

  if (!post) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}>⏳</div>
        <p>Loading post...</p>
      </div>
    );
  }

  const categoryInfo = categories.find(c => c.id === post.category);
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <main className={styles.blogPostPage}>
      {/* Breadcrumb */}
      <section className={styles.breadcrumb}>
        <div className={styles.container}>
          <nav className={styles.breadcrumbNav}>
            <Link to="/" className={styles.breadcrumbLink}>Home</Link>
            <span className={styles.breadcrumbSeparator}>→</span>
            <Link to="/blog" className={styles.breadcrumbLink}>Blog</Link>
            <span className={styles.breadcrumbSeparator}>→</span>
            <span className={styles.breadcrumbCurrent}>{post.title}</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroPattern}></div>
        <div className={styles.heroContent}>
          <div className={styles.heroMeta}>
            <Link to={`/blog?category=${post.category}`} className={styles.categoryBadge}>
              <span className={styles.categoryIcon}>{categoryInfo?.icon}</span>
              <span>{categoryInfo?.name}</span>
            </Link>
            <span className={styles.readTime}>{post.readTime}</span>
          </div>
          <h1 className={styles.heroTitle}>{post.title}</h1>
          <div className={styles.heroAuthor}>
            <div className={styles.authorAvatar}>{post.author.avatar}</div>
            <div className={styles.authorInfo}>
              <span className={styles.authorName}>By {post.author.name}</span>
              <span className={styles.authorDate}>{formattedDate}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className={styles.featuredImage} id="image">
        <div className={styles.container}>
          <div className={`${styles.imageWrapper} ${isVisible.image ? styles.animate : ''}`}>
            <div className={styles.imageEmoji}>{post.image}</div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className={styles.article} id="content">
        <div className={styles.container}>
          <div className={styles.articleGrid}>
            {/* Main Content */}
            <div className={`${styles.articleContent} ${isVisible.content ? styles.animate : ''}`}>
              {/* Show debug info */}
              {!post.content && (
                <div style={{ padding: '20px', background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '8px', marginBottom: '20px' }}>
                  <h3 style={{ color: '#856404', marginBottom: '10px' }}>⚠️ Debug Info</h3>
                  <p style={{ color: '#856404', margin: 0 }}>Content field is missing or empty for this post.</p>
                  <p style={{ color: '#856404', margin: '10px 0 0 0' }}>Post ID: {post.id}, Slug: {post.slug}</p>
                </div>
              )}
              
              {/* Render content or fallback */}
              <div className={styles.content}>
                {post.content ? (
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                ) : (
                  <div>
                    <h2>Content Not Available</h2>
                    <p>The content for this blog post is currently unavailable. Please check back later.</p>
                    <p><strong>Post Details:</strong></p>
                    <ul>
                      <li>Title: {post.title}</li>
                      <li>Category: {post.category}</li>
                      <li>Date: {post.date}</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className={styles.tags}>
                  <h4 className={styles.tagsTitle}>Tags:</h4>
                  <div className={styles.tagsList}>
                    {post.tags.map((tag, index) => (
                      <span key={index} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Section */}
              <div className={styles.shareSection}>
                <h4 className={styles.shareTitle}>Share this article</h4>
                <div className={styles.shareButtons}>
                  <button 
                    className={styles.shareButton} 
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}
                    aria-label="Share on Facebook"
                  >
                    📘 Facebook
                  </button>
                  <button 
                    className={styles.shareButton}
                    onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}&text=${post.title}`, '_blank')}
                    aria-label="Share on Twitter"
                  >
                    🐦 Twitter
                  </button>
                  <button 
                    className={styles.shareButton}
                    onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`, '_blank')}
                    aria-label="Share on LinkedIn"
                  >
                    💼 LinkedIn
                  </button>
                  <button 
                    className={styles.shareButton}
                    onClick={() => window.open(`https://wa.me/?text=${post.title} ${window.location.href}`, '_blank')}
                    aria-label="Share on WhatsApp"
                  >
                    💬 WhatsApp
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${isVisible.content ? styles.animate : ''}`}>
              {/* Author Card */}
              <div className={styles.authorCard}>
                <div className={styles.authorCardHeader}>
                  <div className={styles.authorCardAvatar}>{post.author.avatar}</div>
                  <div>
                    <h3 className={styles.authorCardName}>{post.author.name}</h3>
                    <p className={styles.authorCardBio}>{post.author.bio}</p>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className={styles.tocCard}>
                <h3 className={styles.tocTitle}>📋 Quick Info</h3>
                <div className={styles.tocList}>
                  <div className={styles.tocItem}>
                    <span className={styles.tocLabel}>Category:</span>
                    <span className={styles.tocValue}>{categoryInfo?.name}</span>
                  </div>
                  <div className={styles.tocItem}>
                    <span className={styles.tocLabel}>Read Time:</span>
                    <span className={styles.tocValue}>{post.readTime}</span>
                  </div>
                  <div className={styles.tocItem}>
                    <span className={styles.tocLabel}>Published:</span>
                    <span className={styles.tocValue}>{formattedDate}</span>
                  </div>
                </div>
              </div>

              {/* CTA Card */}
              <div className={styles.ctaCard}>
                <div className={styles.ctaIcon}>🎓</div>
                <h3 className={styles.ctaTitle}>Ready to Start Learning?</h3>
                <p className={styles.ctaText}>
                  Explore our NBTE-certified courses and begin your journey today.
                </p>
                <Link to="/courses" className={styles.ctaButton}>
                  <span>View Courses</span>
                  <span className={styles.ctaArrow}>→</span>
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className={`${styles.section} ${styles.related}`} id="related">
          <div className={styles.container}>
            <header className={`${styles.sectionHeader} ${isVisible.related ? styles.animate : ''}`}>
              <h2 className={styles.sectionTitle}>Related Articles</h2>
              <p className={styles.sectionSubtitle}>Continue reading about {categoryInfo?.name}</p>
            </header>

            <div className={`${styles.relatedGrid} ${isVisible.related ? styles.animate : ''}`}>
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className={styles.relatedCard}
                >
                  <div className={styles.relatedImage}>
                    <div className={styles.relatedEmoji}>{relatedPost.image}</div>
                  </div>
                  <div className={styles.relatedContent}>
                    <span className={styles.relatedCategory}>
                      {categories.find(c => c.id === relatedPost.category)?.name}
                    </span>
                    <h3 className={styles.relatedTitle}>{relatedPost.title}</h3>
                    <p className={styles.relatedExcerpt}>{relatedPost.excerpt}</p>
                    <div className={styles.relatedFooter}>
                      <span className={styles.relatedDate}>
                        {new Date(relatedPost.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                      <span className={styles.relatedArrow}>→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className={styles.backToBlogs}>
              <Link to="/blog" className={styles.backButton}>
                <span className={styles.backArrow}>←</span>
                <span>Back to All Articles</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className={styles.newsletter}>
        <div className={styles.container}>
          <div className={styles.newsletterContent}>
            <div className={styles.newsletterText}>
              <span className={styles.newsletterIcon}>📬</span>
              <div>
                <h2 className={styles.newsletterTitle}>Never Miss an Update</h2>
                <p className={styles.newsletterSubtitle}>
                  Subscribe to get the latest articles delivered to your inbox.
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
    </main>
  );
};

export default BlogPost;