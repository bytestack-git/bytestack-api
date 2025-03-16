import { UserDTO } from "../../../../shared/dtos/user.dto";

export interface ISignupUseCase {
  execute(userdata: UserDTO): Promise<{
    status: number;
    message: string;
    success: boolean;
  }>;
}
