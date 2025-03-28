import { IUserEntity } from "../../../entities/models/user.entity";

export interface IGitHubOAuthUser {
  provider: "google" | "github";
  providerId: string;
  email: string;
  name: string;
  picture: string
}

export interface IGitHubOAuthService {
  exchangeGitHubCodeForToken(code: string): Promise<string>;
  validateGitHubToken(token: string): Promise<IGitHubOAuthUser>;
  findOrCreateGitHubUser(oauthUser: IGitHubOAuthUser): Promise<IUserEntity>;
}
