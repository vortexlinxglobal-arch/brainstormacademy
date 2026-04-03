import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  return (
    <Link
      to={`/courses/description/${course.id}`}
      className="course-card"
      aria-label={`Learn more about ${course.title}`}
    >
      <div className="course-card-image">
        <img
          src={
            course.thumbnail || "/assets/course-thumbnails/default_result.webp"
          }
          alt={`${course.title} thumbnail`}
          className="thumbnail"
        />
      </div>
      <div className="course-card-content">
        <h3>{course.title}</h3>
        <p className="description">{course.description}</p>
        <p>
          <span>Category: </span>
          {course.category}
        </p>
        <p>
          <span>Instructor: </span>
          {course.createdBy}
        </p>
      </div>
    </Link>
  );
};

export default CourseCard;
