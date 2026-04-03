export interface CreateStudentDTO {
  first_name: string;
  last_name: string;
  dob?: string;
  gender?: string;
  contact?: Record<string, unknown>;
  guardian?: Record<string, unknown>;
  trade_code: string; // e.g., BTC
}
