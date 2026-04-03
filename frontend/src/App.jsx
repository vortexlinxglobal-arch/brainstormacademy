import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import HomeLayout from "./layouts/HomeLayout";
import Home from "./pages/Home";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Signin from "./pages/auth/Signin/Signin"; // Updated path
import Signup from "./pages/auth/Signup/Signup"; // New import
import Blog from "./pages/Blog/Blog";
import BlogPost from "./pages/Blog/BlogPost";
import CourseDescription from "./pages/course/CourseDescription";
import CourseList from "./pages/course/CourseList";
import CreateCourse from "./pages/course/CreateCourse";
import EditCourse from "./pages/course/EditCourse";
import StaffPage from "./pages/StaffPage";
import SignupPage from "./pages/SignupPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Wrapper component to conditionally render layout
function AppContent() {
  const location = useLocation();
  // Check if current page is an auth page (signin or signup)
  const isAuthPage =
    location.pathname === "/signin" || location.pathname === "/signup";

  return (
    <>
      <ScrollToTop />
      {isAuthPage ? (
        // Auth pages without header/footer
        <Routes>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      ) : (
        // All other pages with header/footer
        <HomeLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/courses" element={<CourseList />} />
            <Route
              path="/courses/description/:courseId"
              element={<CourseDescription />}
            />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/courses/create" element={<CreateCourse />} />
            <Route path="/courses/edit/:courseId" element={<EditCourse />} />
            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HomeLayout>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

// 404 Not Found Component
const NotFound = () => {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <h1 style={{ fontSize: "72px", marginBottom: "16px", color: "#2b373a" }}>
        404
      </h1>
      <h2
        style={{
          fontSize: "32px",
          marginBottom: "16px",
          color: "#2b373a",
          fontWeight: "700",
        }}
      >
        Page Not Found
      </h2>
      <p style={{ fontSize: "16px", color: "#64748b", marginBottom: "32px" }}>
        The page you're looking for doesn't exist.
      </p>
      <a
        href="/"
        style={{
          padding: "14px 28px",
          background: "linear-gradient(135deg, #00856f, #7bd6b2)",
          color: "white",
          textDecoration: "none",
          borderRadius: "8px",
          fontWeight: "700",
          fontSize: "14px",
          boxShadow: "0 4px 12px rgba(0, 133, 111, 0.25)",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => {
          e.target.style.transform = "translateY(-2px)";
          e.target.style.boxShadow = "0 6px 20px rgba(0, 133, 111, 0.35)";
        }}
        onMouseOut={(e) => {
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "0 4px 12px rgba(0, 133, 111, 0.25)";
        }}
      >
        Go Back Home
      </a>
    </div>
  );
};

export default App;
