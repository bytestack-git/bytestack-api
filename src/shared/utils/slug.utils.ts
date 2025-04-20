import { IUserRepository } from "../../domain/interfaces/repositoryInterface/profile/user.repository.interface";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 4);

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

export const generateBlogSlug = (title: string): string => {
  const baseSlug: string = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  const uniqueId: string = nanoid();

  return `${baseSlug}-${uniqueId}`;
};
