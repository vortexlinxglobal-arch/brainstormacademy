'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react'

export default function SigninPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}
    
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    try {
      // TODO: Implement Supabase auth here
      console.log('Sign in attempt:', { email, password, rememberMe })
      // Simulate auth delay
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 sm:p-6">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Back to home */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        {/* Card */}
        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-white to-slate-50 p-8 sm:p-10 shadow-2xl backdrop-blur-sm">
          {/* Header */}
          <div className="mb-8 space-y-3 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">Welcome Back</p>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
              Sign In
            </h1>
            <p className="text-slate-600">Enter your credentials to access your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600/50 pointer-events-none" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors({ ...errors, email: undefined })
                  }}
                  placeholder="Enter your email"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 bg-white text-slate-900 placeholder-slate-400 transition-all focus:outline-none ${
                    errors.email 
                      ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                      : 'border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm font-medium text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600/50 pointer-events-none" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors({ ...errors, password: undefined })
                  }}
                  placeholder="Enter your password"
                  className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 bg-white text-slate-900 placeholder-slate-400 transition-all focus:outline-none ${
                    errors.password 
                      ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                      : 'border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-emerald-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm font-medium text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-2 border-slate-300 accent-emerald-600 cursor-pointer transition-colors hover:border-emerald-600"
                />
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign in button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 mt-8 rounded-xl font-bold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 hover:shadow-lg hover:shadow-emerald-500/50 active:scale-95"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-sm text-slate-500 font-medium">OR</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            {/* Sign up link */}
            <p className="text-center text-slate-700">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Sign Up
              </Link>
            </p>

            {/* Support contact */}
            <p className="text-center text-sm text-slate-600 pt-4 border-t border-slate-200">
              Need help?{' '}
              <a
                href="mailto:support@brainstormacademy.ng"
                className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Contact support
              </a>
            </p>
          </form>
        </div>
      </div>
    </main>
  )
}
