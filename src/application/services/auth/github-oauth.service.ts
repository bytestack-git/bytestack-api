import { injectable, inject } from "tsyringe";
import axios from "axios";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import { ERROR_MSG } from "../../../shared/constants/error-msg";
import {
  IGitHubOAuthService,
  IGitHubOAuthUser,
} from "../../../domain/interfaces/serviceInterface/auth/github-oauth.service.interface";
import { IUserRepository } from "../../../domain/interfaces/repositoryInterface/user/user.repository.interface";
import { BaseError } from "../../../domain/errors/base.error";
import { IUserEntity } from "../../../domain/entities/models/user.entity";

interface GitHubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

@injectable()
export class GitHubOAuthService implements IGitHubOAuthService {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository
  ) {}

  async exchangeGitHubCodeForToken(code: string): Promise<string> {
    try {
      const response = await axios.post<GitHubTokenResponse>(
        "https://github.com/login/oauth/access_token",
        {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: process.env.GITHUB_REDIRECT_URI,
        },
        {
          headers: {
            Accept: "application/json",
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
    } catch {
      throw new BaseError(
        ERROR_MSG.TOKEN_EXCHANGE_FAILED,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }

  async validateGitHubToken(token: string): Promise<IGitHubOAuthUser> {
    try {
      const userResponse = await axios.get("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      const { id, login, email, avatar_url } = userResponse.data;

      let userEmail = email;
      if (!userEmail) {
        const emailResponse = await axios.get<
          Array<{ email: string; primary: boolean; verified: boolean }>
        >("https://api.github.com/user/emails", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        });

        const primaryEmail = emailResponse.data.find(
          (e) => e.primary && e.verified
        );

        userEmail = primaryEmail?.email || "";
      }

      if (!userEmail) {
        throw new BaseError(
          "Email not provided by GitHub",
          HTTP_STATUS.BAD_REQUEST,
          true
        );
      }

      return {
        provider: "github",
        providerId: id.toString(),
        email: userEmail,
        name: login,
        picture: avatar_url,
      };
    } catch {
      throw new BaseError(
        ERROR_MSG.INVALID_CODE,
        HTTP_STATUS.UNAUTHORIZED,
        true
      );
    }
  }

  async findOrCreateGitHubUser(
    oauthUser: IGitHubOAuthUser
  ): Promise<IUserEntity> {
    const { provider, providerId, email, name, picture } = oauthUser;

    let user = await this.userRepository.findByProviderId(provider, providerId);

    if (!user) {
      user = await this.userRepository.findByEmail(email);

      if (user) {
        const updateData: Partial<IUserEntity> = {
          lastLogin: new Date(),
          githubId: providerId,
        };
        user = await this.userRepository.update(
          user._id!.toString(),
          updateData
        );
        if (!user) {
          throw new BaseError(
            "Failed to update user with GitHub ID",
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
          githubId: providerId,
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
