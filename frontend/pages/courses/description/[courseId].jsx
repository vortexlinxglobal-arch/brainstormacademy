import { useRouter } from "next/router";
import CourseDescription from "../../../src/pages/course/CourseDescription";

export default function CourseDescriptionPage() {
  const router = useRouter();
  const { courseId } = router.query;

  if (!courseId) return null;

  return (
    <CourseDescription courseId={Array.isArray(courseId) ? courseId[0] : courseId} />
  );
}
