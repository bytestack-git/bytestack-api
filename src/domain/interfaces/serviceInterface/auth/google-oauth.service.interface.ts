import { IUserEntity } from "../../../entities/models/user.entity";

export interface IGoogleOAuthUser {
  provider: "google" | "github";
  providerId: string;
  email: string;
  name: string;
  picture: string
}

export interface IGoogleOAuthService {
  exchangeGoogleCodeForToken(code: string): Promise<string>;
  validateGoogleToken(token: string): Promise<IGoogleOAuthUser>;
  findOrCreateGoogleUser(oauthUser: IGoogleOAuthUser): Promise<IUserEntity>;
}
