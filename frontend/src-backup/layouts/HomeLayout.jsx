'use client'

import React from 'react'
import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'

const HomeLayout = ({ children }) => {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default HomeLayout
