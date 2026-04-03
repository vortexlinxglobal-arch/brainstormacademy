export type StaffCategory = "STAFF" | "QAA" | "IQAM";

export interface CreateStaffDTO {
  user_id: string;
  staff_category: StaffCategory;
  department_code?: string; // required for STAFF, QAA
  bio?: Record<string, unknown>;
  employment_date?: string; // YYYY-MM-DD
  specialty?: string;
}
