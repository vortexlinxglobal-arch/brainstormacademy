'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { apiClient, db } from '../../api'
import { Link, useNavigate } from 'react-router-dom'

const StaffDashboard = () => {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [remunerationData, setRemunerationData] = useState(null)
  const [financeData, setFinanceData] = useState(null)
  const [idCardData, setIdCardData] = useState(null)
  const [activeSection, setActiveSection] = useState('overview')
  const [loading, setLoading] = useState(true)

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      const [dashboard, notificationsData] = await Promise.all([
        apiClient.getStaffDashboard(),
        db.getNotifications(user.id)
      ])

      setDashboardData(dashboard)
      setNotifications(notificationsData.data || [])

      const [idCardResult, remunerationResult, financeResult] = await Promise.allSettled([
        apiClient.getStaffIdCard(),
        apiClient.getStaffRemuneration(),
        apiClient.getStaffFinanceSummary(),
      ])

      if (idCardResult.status === 'fulfilled') {
        setIdCardData(idCardResult.value)
      }

      if (remunerationResult.status === 'fulfilled') {
        setRemunerationData(remunerationResult.value)
      }

      if (financeResult.status === 'fulfilled') {
        setFinanceData(financeResult.value)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }, [user.id])

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  const sectionLabels = [
    { key: 'overview', label: 'Overview' },
    { key: 'idCard', label: 'Staff ID Card' },
    { key: 'remuneration', label: 'Remuneration' },
    { key: 'finance', label: 'Finance' },
  ]

  const printStaffIdCard = () => {
    window.print()
  }

  const getRemuneration = () => {
    return remunerationData || {
      salary_base: dashboardData?.salary || 180000,
      allowances: dashboardData?.allowances || 24000,
      annual_bonus: dashboardData?.annual_bonus || 32000,
      benefits: dashboardData?.benefits || [
        'Pension & Life Insurance',
        'Health Maintenance',
        'Transport Allowance',
      ],
      next_pay_date: dashboardData?.next_pay_date || '2026-05-05',
      currency: 'NGN',
    }
  }

  const getFinanceSummary = () => {
    return financeData || {
      payroll_budget: dashboardData?.payroll_budget || 125000000,
      available_cash: dashboardData?.available_cash || 18200000,
      vendor_payables: dashboardData?.vendor_payables || 3250000,
      monthly_revenue: dashboardData?.monthly_revenue || 11800000,
      gross_margin: dashboardData?.gross_margin || 0.42,
      cost_centers: dashboardData?.cost_centers || [
        { name: 'Payroll', value: 55 },
        { name: 'Facilities', value: 18 },
        { name: 'Learning Tech', value: 14 },
        { name: 'Nigerian Operations', value: 13 },
      ],
      currency: 'NGN',
    }
  }

  const getStaffIdCard = () => {
    return idCardData || {
      staff_number: dashboardData?.staff_number || 'STF-00923',
      full_name: profile?.full_name || 'Staff Member',
      department: dashboardData?.department_name || 'Business Operations',
      role: dashboardData?.category_name || 'Technical Staff',
      location: dashboardData?.location || 'Lagos, Nigeria',
      issue_date: dashboardData?.issue_date || new Date().toLocaleDateString(),
      expires_on: dashboardData?.expires_on || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString(),
      verification_code: dashboardData?.verification_code || 'NG-STAFF-2026-51',
    }
  }

  const renderIdCard = () => {
    const card = getStaffIdCard()
    return (
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-500">Staff ID Card</p>
            <h2 className="text-xl font-semibold text-gray-900">Professional Badge</h2>
          </div>
          <button
            onClick={printStaffIdCard}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
          >
            Print ID Card
          </button>
        </div>

        <div id="staff-id-card" className="rounded-[28px] border border-gray-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm">
          <div className="grid gap-6 md:grid-cols-[120px_1fr] items-center">
            <div className="h-32 w-32 rounded-3xl bg-emerald-600 text-white shadow-lg flex items-center justify-center text-4xl font-semibold">
              {card.full_name?.split(' ').map((part) => part.charAt(0)).join('').slice(0, 2)}
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{card.role}</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900">{card.full_name}</h3>
              <p className="mt-2 text-sm text-slate-600">{card.department} · {card.location}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Staff number</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{card.staff_number}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Valid until</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{card.expires_on}</p>
            </div>
          </div>

          <div className="mt-6 rounded-3xl bg-slate-900 p-5 text-white">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Verification code</p>
                <p className="mt-2 text-lg font-semibold">{card.verification_code}</p>
              </div>
              <div className="rounded-3xl bg-slate-800 px-3 py-2 text-right text-xs uppercase text-slate-300">
                Nigerian Operations
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderRemuneration = () => {
    const pay = getRemuneration()
    const totalCompensation = pay.salary_base + pay.allowances + pay.annual_bonus

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">Remuneration & Benefits</p>
              <h2 className="text-xl font-semibold text-gray-900">Payroll summary</h2>
            </div>
            <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
              Next payroll: {pay.next_pay_date}
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Base salary</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">₦{pay.salary_base.toLocaleString()}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Allowances</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">₦{pay.allowances.toLocaleString()}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Annual bonus</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">₦{pay.annual_bonus.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total compensation</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">₦{totalCompensation.toLocaleString()}</p>
              </div>
              <div className="rounded-full bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">Net pay estimate</div>
            </div>

            <div className="mt-6 space-y-4">
              {pay.benefits.map((benefit, index) => (
                <div key={index} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-900">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Benefits cadence</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl bg-green-50 p-4">
                <p className="text-sm text-slate-700">Tax planning and payroll compliance for Lagos operations</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-700">Health insurance premium scheduled each quarter</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-700">Transport & hazard allowance review in June</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderFinanceOverview = () => {
    const finance = getFinanceSummary()
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">Company finance</p>
              <h2 className="text-xl font-semibold text-gray-900">Operational finance dashboard</h2>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
              Currency: {finance.currency}
            </div>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Available cash</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">₦{finance.available_cash.toLocaleString()}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Payroll budget</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">₦{finance.payroll_budget.toLocaleString()}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Vendor payables</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">₦{finance.vendor_payables.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Monthly revenue</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">₦{finance.monthly_revenue.toLocaleString()}</p>
            <p className="mt-2 text-sm text-slate-500">Gross margin: {(finance.gross_margin * 100).toFixed(0)}%</p>

            <div className="mt-6 space-y-4">
              {finance.cost_centers.map((center) => (
                <div key={center.name}>
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>{center.name}</span>
                    <span>{center.value}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${center.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Financial highlights</p>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-700">Focus on cost efficiency for venue rentals across Lagos hubs.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-700">Optimizing payroll cycles for local salary disbursements.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-700">Priority onboarding for vendor payments due this quarter.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'idCard':
        return renderIdCard()
      case 'remuneration':
        return renderRemuneration()
      case 'finance':
        return renderFinanceOverview()
      default:
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Performance Rating</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {dashboardData?.performance_rating || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Tasks Completed</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {dashboardData?.tasks_completed || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Days Employed</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {dashboardData?.days_employed || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {dashboardData?.department_staff && (
              <div className="bg-white rounded-lg shadow mb-8">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    {dashboardData.department_name} Department Staff
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dashboardData.department_staff.map((staff) => (
                      <div key={staff.id} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {staff.full_name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{staff.full_name}</p>
                          <p className="text-sm text-gray-500">{staff.category_name}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
              </div>
              <div className="p-6">
                {dashboardData?.recent_activities?.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No recent activities.</p>
                ) : (
                  <div className="space-y-4">
                    {dashboardData?.recent_activities?.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{activity.description}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
              <span className="text-sm text-gray-500">
                Welcome, {profile?.full_name}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="px-6 py-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-500">Staff operations</p>
                  <h2 className="text-xl font-semibold text-gray-900">Manage your ID, payroll, and finance insight</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sectionLabels.map((section) => (
                    <button
                      key={section.key}
                      onClick={() => setActiveSection(section.key)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        activeSection === section.key
                          ? 'bg-green-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {section.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {renderSectionContent()}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
              </div>
              <div className="p-6">
                {notifications.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No new notifications.</p>
                ) : (
                  <div className="space-y-3">
                    {notifications.slice(0, 5).map((notification) => (
                      <div key={notification.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{notification.message}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(notification.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <Link
                    to="/dashboard/staff/profile"
                    className="block w-full px-4 py-2 text-sm font-medium text-center text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
                  >
                    Update Profile
                  </Link>
                  <Link
                    to="/dashboard/staff/performance"
                    className="block w-full px-4 py-2 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    View Performance
                  </Link>
                  <Link
                    to="/dashboard/staff/department"
                    className="block w-full px-4 py-2 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Department Info
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Staff Information</h3>
              </div>
              <div className="p-6">
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Category</dt>
                    <dd className="text-sm text-gray-900">{dashboardData?.category_name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Department</dt>
                    <dd className="text-sm text-gray-900">{dashboardData?.department_name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Employment Date</dt>
                    <dd className="text-sm text-gray-900">
                      {dashboardData?.employment_date ? new Date(dashboardData.employment_date).toLocaleDateString() : 'N/A'}
                    </dd>
                  </div>
                  {dashboardData?.specialty && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Specialty</dt>
                      <dd className="text-sm text-gray-900">{dashboardData.specialty}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaffDashboard