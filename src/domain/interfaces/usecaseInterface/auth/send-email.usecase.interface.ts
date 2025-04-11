import { SendEmailDTO } from "../../../../../shared/validation/schemas";

export interface ISendEmailUseCase {
  execute(
    data: SendEmailDTO
  ): Promise<{ status: number; message: string; success: boolean }>;
}
