import { injectable, inject } from "tsyringe";
import axios, { AxiosError } from "axios";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import { ERROR_MSG } from "../../../shared/constants/error-msg";
import {
  IGoogleOAuthService,
  IGoogleOAuthUser,
} from "../../../domain/interfaces/serviceInterface/auth/google-oauth.service.interface";
import { IUserRepository } from "../../../domain/interfaces/repositoryInterface/user/user.repository.interface";
import { BaseError } from "../../../domain/errors/base.error";
import { IUserEntity } from "../../../domain/entities/models/user.entity";

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

@injectable()
export class GoogleOAuthService implements IGoogleOAuthService {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository
  ) {}

  async exchangeGoogleCodeForToken(code: string): Promise<string> {
    try {
      const response = await axios.post<GoogleTokenResponse>(
        "https://oauth2.googleapis.com/token",
        new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID || "",
          client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
          code,
          redirect_uri: process.env.GOOGLE_REDIRECT_URI || "",
          grant_type: "authorization_code",
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const accessToken = response.data.access_token;
      if (!accessToken) {
        throw new BaseError(
          ERROR_MSG.TOKEN_EXCHANGE_FAILED,
          HTTP_STATUS.BAD_REQUEST,
          true
        );
      }
      return accessToken;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error("Google token exchange error:", error.response.data);
        throw new BaseError(
          `Failed to exchange OAuth code for token: ${error.response.data.error_description || error.response.data.error}`,
          HTTP_STATUS.BAD_REQUEST,
          true
        );
      }
      console.error("Google token exchange error:", error);
      throw new BaseError(
        ERROR_MSG.TOKEN_EXCHANGE_FAILED,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }

  async validateGoogleToken(token: string): Promise<IGoogleOAuthUser> {
    try {
      const response = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { sub, email, name, picture } = response.data;

      if (!email) {
        throw new BaseError(
          ERROR_MSG.INVALID_CODE,
          HTTP_STATUS.BAD_REQUEST,
          true
        );
      }

      return {
        provider: "google",
        providerId: sub,
        picture,
        email,
        name,
      };
    } catch {
      throw new BaseError(
        ERROR_MSG.INVALID_CODE,
        HTTP_STATUS.UNAUTHORIZED,
        true
      );
    }
  }

  async findOrCreateGoogleUser(
    oauthUser: IGoogleOAuthUser
  ): Promise<IUserEntity> {
    const { provider, providerId, email, name, picture } = oauthUser;

    let user = await this.userRepository.findByProviderId(provider, providerId);

    if (!user) {
      user = await this.userRepository.findByEmail(email);

      if (user) {
        const updateData: Partial<IUserEntity> = {
          lastLogin: new Date(),
          googleId: providerId,
        };
        user = await this.userRepository.update(
          user._id!.toString(),
          updateData
        );
        if (!user) {
          throw new BaseError(
            "Failed to update user with Google ID",
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            true
          );
        }
      } else {
        const newUser: IUserEntity = {
          name,
          email,
          avatar: picture,
          isBlogger: false,
          isSubscribed: false,
          subType: "trial",
          subEndDate: null,
          trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          followedTopics: [],
          techInterests: [],
          searchHistory: [],
          lastLogin: new Date(),
          isBanned: false,
          googleId: providerId,
        };
        user = await this.userRepository.save(newUser);
      }
    } else {
      user = await this.userRepository.update(user._id!.toString(), {
        lastLogin: new Date(),
      });
      if (!user) {
        throw new BaseError(
          "Failed to update user last login",
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          true
        );
      }
    }

    return user;
  }
}
