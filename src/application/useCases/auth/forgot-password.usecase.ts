import { injectable, inject } from "tsyringe";
import { IForgotPasswordUseCase } from "../../../domain/interfaces/usecaseInterface/auth/forgot-password.usecase.interface";
import { IUserRepository } from "../../../domain/interfaces/repositoryInterface/user/user.repository.interface";
import { ISendEmailUseCase } from "../../../domain/interfaces/usecaseInterface/auth/send-email.usecase.interface";
import {
  sendEmailSchema,
  SendEmailDTO,
} from "../../../shared/validation/schemas";
import { BaseError } from "../../../domain/errors/base.error";
import { ZodError } from "zod";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import { ERROR_MSG } from "../../../shared/constants/error-msg";

@injectable()
export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository,
    @inject("ISendEmailUseCase") private sendEmailUseCase: ISendEmailUseCase
  ) {}

  async execute(
    data: SendEmailDTO
  ): Promise<{ status: number; message: string; success: boolean }> {
    let validatedData: SendEmailDTO;
    try {
      validatedData = sendEmailSchema.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BaseError(
          ERROR_MSG.INVALID_DATA,
          HTTP_STATUS.BAD_REQUEST,
          true
        );
      }

      throw new BaseError(
        "Failed to validate input data",
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        false
      );
    }
    const { email, type } = validatedData;

    if (type !== "forgot-password") {
      throw new BaseError(
        ERROR_MSG.INVALID_EMAIL_TYPE,
        HTTP_STATUS.BAD_REQUEST,
        true
      );
    }

    // Check if user exists
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new BaseError(
        ERROR_MSG.EMAIL_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        true
      );
    }

    // Delegate to SendEmailUseCase
    return await this.sendEmailUseCase.execute({
      email,
      type: "forgot-password",
    });
  }
}
