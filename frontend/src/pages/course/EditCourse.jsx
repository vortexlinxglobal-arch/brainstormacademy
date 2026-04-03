import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import HomeLayout from "../../layouts/HomeLayout";

const EditCourse = () => {
  const { courseId } = useParams();

  const courses = {
    "networking-system-security": {
      title: "Networking and System Security Installation",
      thumbnail: "/assets/course-thumbnails/networking_result.webp",
      numberOfLectures: 20,
      createdBy: "Lukman Lukman",
      description:
        "Learn to design, install, and maintain secure network systems. This course covers network configuration, cybersecurity protocols, and system maintenance, preparing you for roles in IT infrastructure and security.",
      curriculum:
        "Topics include network architecture, firewall setup, intrusion detection, and secure system administration. Practical sessions involve hands-on network setup and troubleshooting.",
      outcomes:
        "Prepare for roles as network administrators or cybersecurity technicians with NSQ certification.",
    },
    // ... (other courses from CourseDescription.jsx)
  };

  const initialCourse = courses[courseId] || {
    title: "",
    description: "",
    curriculum: "",
    outcomes: "",
    numberOfLectures: "",
    createdBy: "",
  };

  const [formData, setFormData] = useState(initialCourse);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on page load
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
    setSubmitted(false);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (
      !formData.numberOfLectures ||
      isNaN(formData.numberOfLectures) ||
      formData.numberOfLectures <= 0
    )
      newErrors.numberOfLectures = "Valid number of lectures is required";
    if (!formData.createdBy.trim())
      newErrors.createdBy = "Instructor name is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      console.log("Course updated:", formData);
      setSubmitted(true);
      setErrors({});
    } else {
      setErrors(formErrors);
      setSubmitted(false);
    }
  };

  return (
    <HomeLayout>
      <main className="edit-course-page">
        <section className="hero">
          <div className="hero-content">
            <h1>Edit Course</h1>
            <p>Update details for the {formData.title} course.</p>
          </div>
        </section>

        <section className="section course-form">
          <div className="container">
            <h2>Edit Course Details</h2>
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="title">Course Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  aria-invalid={!!errors.title}
                  aria-describedby={errors.title ? "title-error" : undefined}
                  placeholder="Enter course title"
                />
                {errors.title && (
                  <span id="title-error" className="error-message">
                    {errors.title}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  aria-invalid={!!errors.description}
                  aria-describedby={
                    errors.description ? "description-error" : undefined
                  }
                  placeholder="Enter course description"
                  rows="5"
                ></textarea>
                {errors.description && (
                  <span id="description-error" className="error-message">
                    {errors.description}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="curriculum">Curriculum</label>
                <textarea
                  id="curriculum"
                  name="curriculum"
                  value={formData.curriculum}
                  onChange={handleChange}
                  placeholder="Enter course curriculum"
                  rows="5"
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="outcomes">Learning Outcomes</label>
                <textarea
                  id="outcomes"
                  name="outcomes"
                  value={formData.outcomes}
                  onChange={handleChange}
                  placeholder="Enter learning outcomes"
                  rows="5"
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="numberOfLectures">Number of Lectures</label>
                <input
                  type="number"
                  id="numberOfLectures"
                  name="numberOfLectures"
                  value={formData.numberOfLectures}
                  onChange={handleChange}
                  aria-invalid={!!errors.numberOfLectures}
                  aria-describedby={
                    errors.numberOfLectures
                      ? "numberOfLectures-error"
                      : undefined
                  }
                  placeholder="Enter number of lectures"
                />
                {errors.numberOfLectures && (
                  <span id="numberOfLectures-error" className="error-message">
                    {errors.numberOfLectures}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="createdBy">Instructor</label>
                <input
                  type="text"
                  id="createdBy"
                  name="createdBy"
                  value={formData.createdBy}
                  onChange={handleChange}
                  aria-invalid={!!errors.createdBy}
                  aria-describedby={
                    errors.createdBy ? "createdBy-error" : undefined
                  }
                  placeholder="Enter instructor name"
                />
                {errors.createdBy && (
                  <span id="createdBy-error" className="error-message">
                    {errors.createdBy}
                  </span>
                )}
              </div>
              {submitted && (
                <div className="success-message">
                  Course updated successfully (logged to console).
                </div>
              )}
              <button type="submit" className="cta-button">
                Update Course
              </button>
              <Link to="/courses" className="cta-button secondary">
                Cancel
              </Link>
            </form>
          </div>
        </section>
      </main>
    </HomeLayout>
  );
};

export default EditCourse;
