'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, CheckCircle } from 'lucide-react'

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{
    fullName?: string
    email?: string
    password?: string
    confirmPassword?: string
    terms?: string
  }>({})

  const validateForm = () => {
    const newErrors: typeof errors = {}
    
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters'
    }
    
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Password must include uppercase, lowercase, and numbers'
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the terms and conditions'
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
      console.log('Sign up attempt:', { fullName, email, password, agreeTerms })
      // Simulate auth delay
      await new Promise(resolve => setTimeout(resolve, 1500))
    } catch (error) {
      console.error('Sign up error:', error)
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
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">Create Account</p>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
              Join Us
            </h1>
            <p className="text-slate-600">Start your learning journey with our premium training programs</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name field */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600/50 pointer-events-none" size={20} />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value)
                    if (errors.fullName) setErrors({ ...errors, fullName: undefined })
                  }}
                  placeholder="Enter your full name"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 bg-white text-slate-900 placeholder-slate-400 transition-all focus:outline-none ${
                    errors.fullName 
                      ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                      : 'border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100'
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="mt-2 text-sm font-medium text-red-600">{errors.fullName}</p>
              )}
            </div>

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
                  placeholder="Create a strong password"
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
              <p className="mt-2 text-xs text-slate-600">Min 8 chars with uppercase, lowercase & numbers</p>
            </div>

            {/* Confirm Password field */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600/50 pointer-events-none" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined })
                  }}
                  placeholder="Confirm your password"
                  className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 bg-white text-slate-900 placeholder-slate-400 transition-all focus:outline-none ${
                    errors.confirmPassword 
                      ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                      : 'border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-emerald-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm font-medium text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group p-4 rounded-lg hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked)
                  if (errors.terms) setErrors({ ...errors, terms: undefined })
                }}
                className="w-5 h-5 mt-0.5 rounded-lg border-2 border-slate-300 accent-emerald-600 cursor-pointer transition-colors hover:border-emerald-600 flex-shrink-0"
              />
              <div className="text-sm text-slate-700 group-hover:text-slate-900">
                I agree to the{' '}
                <a href="#" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                  Terms of Service
                </a>
                {' '}and{' '}
                <a href="#" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                  Privacy Policy
                </a>
              </div>
            </label>
            {errors.terms && (
              <p className="text-sm font-medium text-red-600">{errors.terms}</p>
            )}

            {/* Sign up button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 mt-8 rounded-xl font-bold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 hover:shadow-lg hover:shadow-emerald-500/50 active:scale-95"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
                </span>
              ) : (
                'Sign Up'
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-sm text-slate-500 font-medium">OR</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            {/* Sign in link */}
            <p className="text-center text-slate-700">
              Already have an account?{' '}
              <Link
                href="/signin"
                className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Sign In
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
