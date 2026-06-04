'use client'

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import HomeLayout from "./layouts/HomeLayout";
import Home from "./pages/Home";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Signin from "./pages/auth/Signin/Signin";
import Signup from "./pages/auth/Signup/Signup";
import Blog from "./pages/Blog/Blog";
import BlogPost from "./pages/Blog/BlogPost";
import CourseDescription from "./pages/course/CourseDescription";
import CourseList from "./pages/course/CourseList";
import CreateCourse from "./pages/course/CreateCourse";
import EditCourse from "./pages/course/EditCourse";
import StaffPage from "./pages/StaffPage";
import SignupPage from "./pages/SignupPage";

// Dashboard components
import StudentDashboard from "./pages/dashboards/StudentDashboard";
import StaffDashboard from "./pages/dashboards/StaffDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import InstructorDashboard from "./pages/dashboards/InstructorDashboard";

// Protected Route component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles.length > 0 && profile && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Public Route component (redirects authenticated users)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Dashboard Route component (redirects based on role)
const DashboardRoute = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/signin" replace />;
  }

  switch (profile.role) {
    case 'student':
      return <Navigate to="/dashboard/student" replace />;
    case 'staff':
      return <Navigate to="/dashboard/staff" replace />;
    case 'instructor':
      return <Navigate to="/dashboard/instructor" replace />;
    case 'admin':
      return <Navigate to="/dashboard/admin" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

// Wrapper component to conditionally render layout
function AppContent() {
  const location = useLocation();
  // Check if current page is an auth page or dashboard
  const isAuthPage =
    location.pathname === "/signin" || location.pathname === "/signup";
  const isDashboardPage = location.pathname.startsWith("/dashboard");

  return (
    <>
      <ScrollToTop />
      {isAuthPage ? (
        // Auth pages without header/footer
        <Routes>
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <Signin />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
        </Routes>
      ) : isDashboardPage ? (
        // Dashboard pages with different layout
        <Routes>
          <Route path="/dashboard" element={<DashboardRoute />} />
          <Route
            path="/dashboard/student/*"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/staff/*"
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/instructor/*"
            element={
              <ProtectedRoute allowedRoles={['instructor']}>
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin/*"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
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
            <Route
              path="/courses/create"
              element={
                <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                  <CreateCourse />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/edit/:courseId"
              element={
                <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                  <EditCourse />
                </ProtectedRoute>
              }
            />
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
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
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
          background: "linear-gradient(135deg, #1a6b53, #2a8570)",
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
