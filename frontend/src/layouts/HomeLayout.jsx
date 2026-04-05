'use client'

import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'

const HomeLayout = ({ children }) => {
  const [isClient, setIsClient] = useState(false)
  const { user, profile, signOut } = useAuth()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      <Navbar />
      {/* Authenticated User Bar - only show on client side */}
      {isClient && user && (
        <div className="bg-green-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-2">
              <div className="flex items-center space-x-4">
                <span className="text-sm">
                  Welcome back, {profile?.first_name} {profile?.last_name}!
                </span>
                <span className="text-xs bg-green-700 px-2 py-1 rounded-full capitalize">
                  {profile?.role}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="text-sm font-medium hover:text-green-200 transition-colors"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-sm font-medium hover:text-green-200 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default HomeLayout
