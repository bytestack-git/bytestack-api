import { ResetPasswordDTO } from "../../../../shared/validation/schemas";

export interface IResetPasswordUseCase {
  execute(data: ResetPasswordDTO): Promise<{ status: number; message: string; success: boolean }>;
}