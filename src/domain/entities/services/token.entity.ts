export interface ITokenPayload {
  id: string;
  iat: number;
  exp: number;
  purpose?: "access" | "refresh" | "reset";
  role?: "admin" | "user";
}
