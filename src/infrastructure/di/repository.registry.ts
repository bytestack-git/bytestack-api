import { container } from "tsyringe";
import { UserRepository } from "../repositories/profile/user.repository";
import { IUserRepository } from "../../domain/interfaces/repositoryInterface/profile/user.repository.interface";
import { IAdminRepository } from "../../domain/interfaces/repositoryInterface/admin/admin.repository.interface";
import { AdminRepository } from "../repositories/admin/admin.repository";
import { IFollowsRepository } from "../../domain/interfaces/repositoryInterface/profile/follows.repository.interface";
import { FollowsRepository } from "../repositories/profile/follows.repository";

container.register<IUserRepository>("IUserRepository", {
  useClass: UserRepository,
});

container.register<IAdminRepository>("IAdminRepository", {
  useClass: AdminRepository,
});

container.register<IFollowsRepository>("IFollowsRepository", {
  useClass: FollowsRepository,
});
