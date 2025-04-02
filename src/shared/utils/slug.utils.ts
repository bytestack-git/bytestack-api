import { IUserRepository } from "../../domain/interfaces/repositoryInterface/user/user.repository.interface";

export const generateProfileSlug = async (
  email: string,
  userRepo: IUserRepository
): Promise<string> => {
  let username = email.split("@")[0];

  username = username.replace(/[^a-zA-Z0-9_]/g, "");

  let slug = username;
  const existingUser = await userRepo.findBySlug(slug);

  if (existingUser) {
    const domain = email.split("@")[1].split(".")[0];
    slug = `${username}_${domain}`;
  }

  return slug;
};
