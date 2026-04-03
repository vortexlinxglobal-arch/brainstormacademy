import { CreateStudentDTO } from "./students";

export interface CreateAdmissionDTO {
  student: Omit<CreateStudentDTO, "trade_code">;
  trade_code: string;
  template_id?: number;
}
