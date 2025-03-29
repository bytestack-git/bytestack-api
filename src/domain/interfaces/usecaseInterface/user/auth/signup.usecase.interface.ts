import { UserSignupDTO } from "../../../../../shared/validation/schemas";

export interface ISignupUseCase {
  execute(data: UserSignupDTO): Promise<{
    status: number;
    message: string;
    success: boolean;
  }>;
}
