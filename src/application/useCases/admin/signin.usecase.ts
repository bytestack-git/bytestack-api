import { injectable, inject } from "tsyringe";
import { IAdminRepository } from "../../../domain/interfaces/repositoryInterface/admin/admin.repository.interface";
import { ITokenService } from "../../../domain/interfaces/serviceInterface/security/token.service.interface";
import { IHashService } from "../../../domain/interfaces/serviceInterface/security/hash.service.interface";
import { BaseError } from "../../../domain/errors/base.error";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import { ERROR_MSG } from "../../../shared/constants/error-msg";
import { SUCCESS_MSG } from "../../../shared/constants/success-msg";
import { LoginDTO, loginSchema } from "../../../shared/validation/schemas";
import { IAdminSigninUseCase } from "../../../domain/interfaces/usecaseInterface/admin/signin.usecase.interface";
import { ZodError } from "zod";

@injectable()
export class AdminSigninUseCase implements IAdminSigninUseCase {
  constructor(
    @inject("IAdminRepository") private adminRepository: IAdminRepository,
    @inject("ITokenService") private tokenService: ITokenService,
    @inject("IHashService") private hashService: IHashService
  ) {}

  async execute(data: LoginDTO): Promise<{
    status: number;
    message: string;
    success: boolean;
    admin: { id: string; email: string };
    accessToken: string;
    refreshToken: string;
  }> {
    let validatedData: LoginDTO;
    try {
      validatedData = loginSchema.parse(data);
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

    const { email, password } = validatedData;

    // Find admin
    const admin = await this.adminRepository.findByEmail(email);
    if (!admin) {
      throw new BaseError(
        ERROR_MSG.INVALID_CREDENTIALS,
        HTTP_STATUS.UNAUTHORIZED,
        true
      );
    }

    // Verify password
    const isPasswordValid = await this.hashService.compare(
      password,
      admin.password || ""
    );
    if (!isPasswordValid) {
      throw new BaseError(
        ERROR_MSG.INVALID_CREDENTIALS,
        HTTP_STATUS.UNAUTHORIZED,
        true
      );
    }

    // Generate tokens with role
    if (!admin._id) {
      throw new BaseError(
        ERROR_MSG.INVALID_CREDENTIALS,
        HTTP_STATUS.UNAUTHORIZED,
        true
      );
    }

    const accessToken = this.tokenService.generateAccessToken(
      admin._id.toString(),
      "access",
      "admin"
    );
    const refreshToken = this.tokenService.generateRefreshToken(
      admin._id.toString(),
      "admin"
    );

    return {
      status: 200,
      message: SUCCESS_MSG.LOGIN_SUCCESSFUL,
      success: true,
      admin: { id: admin._id.toString(), email: admin.email ?? "" },
      accessToken,
      refreshToken,
    };
  }
}
