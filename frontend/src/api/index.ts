import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// API Client class for backend functions
class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const token = (await supabase.auth.getSession()).data.session?.access_token

    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Student APIs
  async getStudentDashboard() {
    return this.request('/students')
  }

  async registerStudent(data: {
    email: string
    password: string
    first_name: string
    last_name: string
    date_of_birth: string
    gender?: string
    contact?: string
    guardian_contact?: string
    address?: any
    academic_background?: any
    trade_code: string
  }) {
    return this.request('/students', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateStudentProfile(data: {
    contact?: string
    guardian_contact?: string
    address?: any
    academic_background?: any
  }) {
    return this.request('/students', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async getStudentCourses() {
    return this.request('/students/courses')
  }

  async getStudentCourseModules(courseId: number) {
    return this.request(`/students/modules?course_id=${courseId}`)
  }

  async updateStudentProgress(data: {
    course_enrollment_id: number
    module_id: number
    progress_percentage: number
    status?: string
    time_spent?: number
  }) {
    return this.request('/students/progress', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Staff APIs
  async getStaffDashboard() {
    return this.request('/staff')
  }

  async registerStaff(data: {
    email: string
    password: string
    full_name: string
    category_code: string
    department_code?: string
    bio?: string
    employment_date?: string
    specialty?: string
    qualifications?: any[]
  }) {
    return this.request('/staff', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateStaffProfile(data: {
    bio?: string
    specialty?: string
    qualifications?: any[]
  }) {
    return this.request('/staff', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async getStaffByDepartment(departmentCode: string) {
    return this.request(`/staff/department?code=${departmentCode}`)
  }

  async updateStaffPerformance(staffId: number, rating: number) {
    return this.request('/staff/performance', {
      method: 'POST',
      body: JSON.stringify({ staff_id: staffId, rating }),
    })
  }

  // Admissions APIs
  async submitAdmissionsApplication(data: {
    applicant_name: string
    applicant_email: string
    phone?: string
    date_of_birth?: string
    address?: any
    education_background?: any
    trade_interest: string
    previous_experience?: string
    motivation_statement?: string
    special_needs?: string
    emergency_contact?: any
  }) {
    return this.request('/admissions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async reviewAdmissionsApplication(data: {
    application_id: number
    status: string
    decision_notes?: string
  }) {
    return this.request('/admissions/review', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async generateAdmissionLetter(data: {
    application_id: number
    letter_type: string
  }) {
    return this.request('/admissions/letter', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getAdmissionsStats(dateFrom?: string, dateTo?: string) {
    const params = new URLSearchParams()
    if (dateFrom) params.append('from', dateFrom)
    if (dateTo) params.append('to', dateTo)
    return this.request(`/admissions/stats?${params}`)
  }

  async getApplicationsByTrade() {
    return this.request('/admissions/by-trade')
  }

  async getMyApplications() {
    return this.request('/admissions/my-applications')
  }

  // Trades APIs
  async getTrades() {
    return this.request('/trades')
  }

  async getTradeCategories() {
    return this.request('/trades/categories')
  }

  async getTradeCourses(tradeCode: string) {
    return this.request(`/trades/courses?trade_code=${tradeCode}`)
  }

  async createTrade(data: {
    category_code: string
    code: string
    name: string
    description?: string
    duration_months: number
    tuition_fee?: number
    prerequisites?: any[]
    curriculum?: any
  }) {
    return this.request('/trades', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateTrade(data: {
    trade_id: number
    name?: string
    description?: string
    duration_months?: number
    tuition_fee?: number
    prerequisites?: any[]
    curriculum?: any
    is_active?: boolean
  }) {
    return this.request('/trades', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async createCourse(data: {
    trade_code: string
    code: string
    title: string
    description?: string
    instructor_id?: number
    duration_hours?: number
    credit_hours?: number
    course_fee?: number
    materials?: any[]
    prerequisites?: any[]
  }) {
    return this.request('/trades/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async addCourseModule(data: {
    course_code: string
    title: string
    description?: string
    order_index: number
    content?: any
    duration_hours?: number
  }) {
    return this.request('/trades/modules', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}

export const apiClient = new ApiClient(backendUrl)

// Authentication helpers
export const auth = {
  async signUp(email: string, password: string, userData?: any) {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    })
  },

  async signIn(email: string, password: string) {
    return supabase.auth.signInWithPassword({
      email,
      password,
    })
  },

  async signOut() {
    return supabase.auth.signOut()
  },

  async getCurrentUser() {
    return supabase.auth.getUser()
  },

  async getSession() {
    return supabase.auth.getSession()
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  },
}

// Database helpers
export const db = {
  // Get user profile
  async getProfile(userId: string) {
    return supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
  },

  // Get announcements
  async getAnnouncements(limit = 10) {
    return supabase
      .from('announcements')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit)
  },

  // Get notifications for user
  async getNotifications(userId: string, limit = 20) {
    return supabase
      .from('notifications')
      .select('*')
      .eq('recipient_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
  },

  // Mark notifications as read
  async markNotificationsRead(userId: string, notificationIds?: number[]) {
    const query = supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('recipient_id', userId)

    if (notificationIds) {
      query.in('id', notificationIds)
    }

    return query.neq('is_read', true)
  },
}