import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || ''

const getBackendUrl = () => {
  if (!backendUrl) {
    throw new Error('NEXT_PUBLIC_BACKEND_URL is not configured.')
  }
  if (backendUrl.includes('.supabase.co')) {
    throw new Error('NEXT_PUBLIC_BACKEND_URL must point to the backend API, not the Supabase project URL.')
  }
  return backendUrl
}

const buildBackendHeaders = (headers: Record<string, string> = {}) => ({
  'Content-Type': 'application/json',
  ...headers,
})

async function fetchBackend(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${getBackendUrl()}${endpoint}`, {
    credentials: 'include',
    headers: buildBackendHeaders(options.headers as Record<string, string>),
    ...options,
  })

  const data = await response.json().catch(() => ({ error: 'Invalid JSON response' }))
  if (!response.ok) {
    throw new Error(data.error || `Backend request failed: ${response.status}`)
  }

  return data
}

let supabaseClient: SupabaseClient | null = null

function getSupabaseClient() {
  if (!supabaseClient) {
    if (!supabaseUrl || !supabaseAnonKey) {
      if (typeof window === 'undefined') {
        return null
      }
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')
    }
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseClient
}

export const supabase = getSupabaseClient()

// API Client class for backend functions
class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const client = getSupabaseClient()
    if (!client) {
      throw new Error('Supabase client is unavailable')
    }

    const token = (await client.auth.getSession()).data.session?.access_token

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
    return this.request('/admin/students', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateAdminStudent(data: {
    student_id: number
    enrollment_status?: string
    contact?: string
    guardian_contact?: string
    address?: any
    academic_background?: any
  }) {
    return this.request('/admin/students', {
      method: 'PUT',
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

  async getStaffIdCard() {
    return this.request('/staff/id-card')
  }

  async getStaffRemuneration() {
    return this.request('/staff/remuneration')
  }

  async getStaffFinanceSummary() {
    return this.request('/staff/finance')
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

  async getPerformanceOverview() {
    return this.request('/admin/performance/overview')
  }

  async getPerformanceReviews() {
    return this.request('/admin/performance/reviews')
  }

  async getAdminStudents() {
    return this.request('/admin/students')
  }

  async getAdminPrograms() {
    return this.request('/admin/programs')
  }

  async createProgram(data: {
    title: string
    category: string
    image_url: string
    description?: string
    display_order?: number
    is_active?: boolean
  }) {
    return this.request('/admin/programs', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateProgram(data: {
    program_id: number
    title?: string
    category?: string
    image_url?: string
    description?: string
    display_order?: number
    is_active?: boolean
  }) {
    return this.request('/admin/programs', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async getTradeCategories() {
    return this.request('/trades/categories')
  }

  async getTradeCourses(tradeCode: string) {
    return this.request(`/trades/courses?trade_code=${tradeCode}`)
  }

  async getInventoryBranches() {
    return this.request('/admin/business-center/branches')
  }

  async createInventoryBranch(data: {
    name: string
    address?: string
    phone?: string
    email?: string
    manager_id?: string
  }) {
    return this.request('/admin/business-center/branches', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getInventoryItems() {
    return this.request('/admin/business-center/items')
  }

  async createInventoryItem(data: {
    item_name: string
    sku?: string
    description?: string
    quantity: number
    reorder_level?: number
    unit_cost: number
    branch_id?: string
  }) {
    return this.request('/admin/business-center/items', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateInventoryItem(id: string, data: {
    item_name?: string
    sku?: string
    description?: string
    quantity?: number
    reorder_level?: number
    unit_cost?: number
    branch_id?: string
  }) {
    return this.request(`/admin/business-center/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteInventoryItem(id: string) {
    return this.request(`/admin/business-center/items/${id}`, {
      method: 'DELETE',
    })
  }

  async getInventoryTransactions() {
    return this.request('/admin/business-center/transactions')
  }

  async createInventoryTransaction(data: {
    inventory_item_id: string
    branch_id?: string
    transaction_type: 'purchase' | 'sale' | 'adjustment' | 'transfer'
    quantity: number
    unit_cost: number
    notes?: string
  }) {
    return this.request('/admin/business-center/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getAdminMeetings() {
    return this.request('/admin/meetings')
  }

  async createMeeting(data: {
    topic: string
    agenda?: string
    scheduled_date: string
    scheduled_time: string
    location: string
    participants: string
    minutes?: string
    status?: string
  }) {
    return this.request('/admin/meetings', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateMeeting(id: string, data: {
    topic?: string
    agenda?: string
    scheduled_date?: string
    scheduled_time?: string
    location?: string
    participants?: string
    minutes?: string
    status?: string
  }) {
    return this.request(`/admin/meetings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteMeeting(id: string) {
    return this.request(`/admin/meetings/${id}`, {
      method: 'DELETE',
    })
  }

  async getAdminPayments() {
    return this.request('/admin/payments')
  }

  async createPayment(data: {
    student_id?: number
    student_email?: string
    enrollment_id?: number
    amount: number
    payment_method: string
    status?: string
    notes?: string
    transaction_id?: string
  }) {
    return this.request('/admin/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updatePayment(id: number, data: {
    amount?: number
    payment_method?: string
    status?: string
    notes?: string
    transaction_id?: string
  }) {
    return this.request(`/admin/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
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
    const response = await fetch(`${backendUrl}/v1/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, ...userData }),
    })

    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.error || 'Signup failed')
    }

    return result
  },

  async signIn(email: string, password: string) {
    const result = await fetchBackend('/v1/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    const session = result.data?.session
    if (!session || !session.access_token) {
      throw new Error('Failed to establish session')
    }

    const client = getSupabaseClient()
    if (!client) throw new Error('Supabase client is unavailable')

    const { error } = await client.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    })

    if (error) {
      throw error
    }

    return result
  },

  async signOut() {
    await fetchBackend('/v1/auth/signout', {
      method: 'POST',
    })

    const client = getSupabaseClient()
    if (!client) throw new Error('Supabase client is unavailable')
    return client.auth.signOut()
  },

  async getCurrentUser() {
    const sessionResult = await this.getSession()
    return { data: { user: sessionResult.data.session?.user } }
  },

  async getSession() {
    const result = await fetchBackend('/v1/auth/verify')
    return {
      data: {
        session: {
          user: result.data.user,
        },
      },
    }
  },

  async resetPassword(email: string, redirectTo: string) {
    const client = getSupabaseClient()
    if (!client) throw new Error('Supabase client is unavailable')
    return client.auth.resetPasswordForEmail(email, { redirectTo })
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    const client = getSupabaseClient()
    if (!client) throw new Error('Supabase client is unavailable')
    return client.auth.onAuthStateChange(callback)
  },
}

// Database helpers
export const db = {
  // Get user profile
  async getProfile(userId: string) {
    return fetchBackend('/v1/profile')
  },

  // Get announcements
  async getAnnouncements(limit = 10) {
    const client = getSupabaseClient()
    if (!client) throw new Error('Supabase client is unavailable')
    return client
      .from('announcements')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit)
  },

  // Get notifications for user
  async getNotifications(userId: string, limit = 20) {
    return fetchBackend(`/v1/notifications?limit=${limit}`)
  },

  // Mark notifications as read
  async markNotificationsRead(userId: string, notificationIds?: number[]) {
    const client = getSupabaseClient()
    if (!client) throw new Error('Supabase client is unavailable')

    const query = client
      .from('notifications')
      .update({ is_read: true })
      .eq('recipient_id', userId)

    if (notificationIds) {
      query.in('id', notificationIds)
    }

    return query.neq('is_read', true)
  },
}