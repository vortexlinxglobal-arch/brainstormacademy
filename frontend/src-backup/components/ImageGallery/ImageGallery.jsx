import { useState, useEffect, useCallback, useMemo } from "react";
import styles from "./ImageGallery.module.css";

const ImageGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [failedImages, setFailedImages] = useState({});
  const [imageCounts, setImageCounts] = useState({});
  const [visibleCategories, setVisibleCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [allCategories, setAllCategories] = useState([
    { id: "workshop", label: "Workshops", name: "workshop" },
    { id: "craftsmanship", label: "Craftsmanship", name: "craftsmanship" },
    { id: "facility", label: "Facilities", name: "facility" },
    { id: "hospitality", label: "Hospitality", name: "hospitality" },
    { id: "cosmetology", label: "Cosmetology", name: "cosmetology" },
    { id: "fashion", label: "Fashion", name: "fashion" },
    { id: "electrical", label: "Electrical", name: "electrical" },
    { id: "plumbing", label: "Plumbing", name: "plumbing" },
    { id: "welding", label: "Welding", name: "welding" },
    { id: "painting", label: "Painting", name: "painting" },
  ]);

  const categories = useMemo(() => allCategories, [allCategories]);

  // Function to add new categories dynamically
  // (Removed unused `addCategory` helper to satisfy ESLint)
  const detectImageCounts = useCallback(async () => {
    const counts = {};
    const visible = [];

    for (const category of categories) {
      let count = 0;

      // Check up to 50 images per category
      for (let i = 1; i <= 50; i++) {
        const imageUrl = `/assets/images/gallery/${category.name}-${i}.jpg`;

        try {
          // Create an image element to test if it loads
          const img = new Image();
          img.src = imageUrl;

          // Use a promise to test image loading with timeout
          const imageLoads = await new Promise((resolve) => {
            const timeout = setTimeout(() => {
              resolve(false);
            }, 2000); // 2 second timeout per image

            img.onload = () => {
              clearTimeout(timeout);
              resolve(true);
            };

            img.onerror = () => {
              clearTimeout(timeout);
              resolve(false);
            };
          });

          if (imageLoads) {
            count = i;
          } else {
            // Stop if image doesn't load
            break;
          }
        } catch (err) {
          break;
        }
      }

      // Only include category if it has at least 1 image
      if (count > 0) {
        counts[category.name] = count;
        visible.push(category);
      }
    }

    setImageCounts(counts);
    setVisibleCategories(visible);
    setIsLoading(false);
  }, [categories]);

  // Initial detection on mount and periodic refresh
  useEffect(() => {
    setIsVisible(true);
    setIsLoading(true);
    detectImageCounts();

    // Poll for new images every 4 seconds
    const pollInterval = setInterval(() => {
      detectImageCounts();
    }, 4000);

    return () => clearInterval(pollInterval);
  }, [detectImageCounts]);

  const generateImagesForCategory = useCallback(
    (categoryName) => {
      const images = [];
      const emojis = {
        workshop: "🖥️",
        craftsmanship: "🪑",
        facility: "🏢",
        hospitality: "🍽️",
        cosmetology: "💅",
        fashion: "👗",
        electrical: "⚡",
        plumbing: "🔧",
        welding: "🔥",
        painting: "🎨",
      };

      const count = imageCounts[categoryName];

      if (!count || count === 0) {
        return [];
      }

      for (let i = 1; i <= count; i++) {
        images.push({
          id: `${categoryName}-${i}`,
          title: `${
            categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
          } Training ${i}`,
          category: categoryName,
          image: `/assets/images/gallery/${categoryName}-${i}.jpg`,
          fallbackEmoji: emojis[categoryName] || "📸",
          date: `${Math.floor(Math.random() * 28) + 1} Dec, 2024`,
          description: `Professional ${categoryName} training session and practical demonstration showcasing our learners' skills and dedication.`,
        });
      }
      return images;
    },
    [imageCounts]
  );

  const galleryImages = useMemo(() => {
    let allImages = [];
    visibleCategories.forEach((category) => {
      allImages = [...allImages, ...generateImagesForCategory(category.name)];
    });
    return allImages;
  }, [visibleCategories, generateImagesForCategory]);

  const getCategoryImages = useCallback(
    (categoryName) => {
      return galleryImages.filter((img) => img.category === categoryName);
    },
    [galleryImages]
  );

  const getCategoryPreview = useCallback(
    (categoryName) => {
      const images = getCategoryImages(categoryName);
      return images.slice(0, 3);
    },
    [getCategoryImages]
  );

  const openCategory = (categoryName) => {
    setSelectedCategory(categoryName);
    setSelectedImage(getCategoryImages(categoryName)[0]);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedImage(null);
    setSelectedCategory(null);
    document.body.style.overflow = "unset";
  };

  const handlePrevious = useCallback(() => {
    if (!selectedImage || !selectedCategory) return;
    const categoryImages = getCategoryImages(selectedCategory);
    const currentIndex = categoryImages.findIndex(
      (img) => img.id === selectedImage.id
    );
    const previousIndex =
      currentIndex === 0 ? categoryImages.length - 1 : currentIndex - 1;
    setSelectedImage(categoryImages[previousIndex]);
  }, [selectedImage, selectedCategory, getCategoryImages]);

  const handleNext = useCallback(() => {
    if (!selectedImage || !selectedCategory) return;
    const categoryImages = getCategoryImages(selectedCategory);
    const currentIndex = categoryImages.findIndex(
      (img) => img.id === selectedImage.id
    );
    const nextIndex =
      currentIndex === categoryImages.length - 1 ? 0 : currentIndex + 1;
    setSelectedImage(categoryImages[nextIndex]);
  }, [selectedImage, selectedCategory, getCategoryImages]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, handlePrevious, handleNext]);

  const categoryImages = selectedCategory
    ? getCategoryImages(selectedCategory)
    : [];

  if (isLoading) {
    return (
      <section className={styles.gallery}>
        <div className={styles.container}>
          <div className={`${styles.header} ${styles.visible}`}>
            <div className={styles.headerContent}>
              <div className={styles.badge}>
                <span className={styles.badgeIcon}>📸</span>
                <span>Photo Gallery</span>
              </div>
              <h2 className={styles.title}>Latest Happenings</h2>
              <p className={styles.subtitle}>Loading gallery...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.gallery}>
      <div className={styles.container}>
        {/* Header */}
        <div className={`${styles.header} ${isVisible ? styles.visible : ""}`}>
          <div className={styles.headerContent}>
            <div className={styles.badge}>
              <span className={styles.badgeIcon}>📸</span>
              <span>Photo Gallery</span>
            </div>
            <h2 className={styles.title}>Latest Happenings</h2>
            <p className={styles.subtitle}>
              Explore memorable moments from our academy's training programs,
              events, and facilities showcasing our learners in action
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div
          className={`${styles.categoriesGrid} ${
            isVisible ? styles.visible : ""
          }`}
        >
          {visibleCategories.map((category, index) => {
            const previewImages = getCategoryPreview(category.name);
            const totalCount = getCategoryImages(category.name).length;

            return (
              <div
                key={category.id}
                className={styles.categoryCard}
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => openCategory(category.name)}
              >
                <div className={styles.categoryPreview}>
                  {previewImages.length > 0 ? (
                    <div className={styles.previewGrid}>
                      {previewImages.map((img) => (
                        <div key={img.id} className={styles.previewThumbnail}>
                          {!failedImages[img.id] ? (
                            <img
                              src={img.image}
                              alt={img.title}
                              onError={() =>
                                setFailedImages((prev) => ({
                                  ...prev,
                                  [img.id]: true,
                                }))
                              }
                            />
                          ) : (
                            <div className={styles.previewFallback}>
                              <span>{img.fallbackEmoji}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className={styles.categoryOverlay}>
                  <div className={styles.categoryInfo}>
                    <h3 className={styles.categoryTitle}>{category.label}</h3>
                    <p className={styles.categoryCount}>{totalCount} photos</p>
                    <div className={styles.viewButton}>
                      <span>View Gallery</span>
                      <span className={styles.arrow}>→</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {visibleCategories.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📭</div>
            <h3 className={styles.emptyTitle}>No images yet</h3>
            <p className={styles.emptyText}>
              Add images to categories to get started
            </p>
          </div>
        )}
      </div>

      {/* Modal - Carousel View */}
      {selectedImage && selectedCategory && (
        <div className={styles.modal} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button className={styles.closeBtn} onClick={closeModal}>
              ✕
            </button>

            {/* Navigation Buttons */}
            {categoryImages.length > 1 && (
              <>
                <button
                  className={styles.navBtn}
                  style={{ left: 0 }}
                  onClick={handlePrevious}
                  title="Previous (← or Arrow Left)"
                >
                  ←
                </button>
                <button
                  className={styles.navBtn}
                  style={{ right: 0 }}
                  onClick={handleNext}
                  title="Next (→ or Arrow Right)"
                >
                  →
                </button>
              </>
            )}

            {/* Image Display */}
            <div className={styles.modalImageWrapper}>
              <div className={styles.modalImage}>
                {!failedImages[selectedImage.id] ? (
                  <img
                    src={selectedImage.image}
                    alt={selectedImage.title}
                    className={styles.modalImageTag}
                    onError={() =>
                      setFailedImages((prev) => ({
                        ...prev,
                        [selectedImage.id]: true,
                      }))
                    }
                  />
                ) : (
                  <div className={styles.modalImageFallback}>
                    <span className={styles.largeEmoji}>
                      {selectedImage.fallbackEmoji}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Image Details */}
            <div className={styles.modalInfo}>
              <span className={styles.modalCategory}>
                {selectedImage.category.toUpperCase()}
              </span>
              <h2 className={styles.modalTitle}>{selectedImage.title}</h2>
              <p className={styles.modalDate}>{selectedImage.date}</p>
              <p className={styles.modalDescription}>
                {selectedImage.description}
              </p>

              {/* Image Counter - Only show if multiple images */}
              {categoryImages.length > 1 && (
                <div className={styles.imageCounter}>
                  {categoryImages.findIndex(
                    (img) => img.id === selectedImage.id
                  ) + 1}{" "}
                  of {categoryImages.length}
                </div>
              )}
            </div>

            {/* Keyboard Hint - Only show if multiple images */}
            {categoryImages.length > 1 && (
              <div className={styles.keyboardHint}>
                <span className={styles.hintKey}>← →</span> Navigate
                <span className={styles.hintKey}>ESC</span> Close
              </div>
            )}
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div
        className={`${styles.ctaSection} ${isVisible ? styles.visible : ""}`}
      >
        <div className={styles.ctaContent}>
          <div className={styles.ctaIcon}>🎬</div>
          <h3 className={styles.ctaTitle}>Want to Be Featured?</h3>
          <p className={styles.ctaText}>
            Join our academy and create memorable moments with us during your
            practical training sessions
          </p>
          <button className={styles.ctaButton}>
            <span>Enroll Now</span>
            <span className={styles.ctaArrow}>→</span>
          </button>
        </div>
      </div>

      {/* Debug Helper - Remove in production */}
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          fontSize: "12px",
          color: "#666",
          marginTop: "20px",
        }}
      >
        <p>
          Total Categories: {categories.length} | Visible:{" "}
          {visibleCategories.length}
        </p>
        <p>
          To add a new category: edit the allCategories state or use
          addCategory()
        </p>
      </div>
    </section>
  );
};

export default ImageGallery;
