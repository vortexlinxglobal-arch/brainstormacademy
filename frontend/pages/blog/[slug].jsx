import { useRouter } from "next/router";
import BlogPost from "../../src/pages/Blog/BlogPost";

export default function BlogPostPage() {
  const router = useRouter();
  const { slug } = router.query;

  if (!slug) {
    return null;
  }

  return <BlogPost slug={Array.isArray(slug) ? slug[0] : slug} />;
}
