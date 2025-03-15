import { container } from "tsyringe";
import { UserRepository } from "../repositories/user/user.repository";
import { IUserRepository } from "../../domain/interfaces/repositoryInterface/auth/user.repository.interface";

container.register<IUserRepository>("IUserRepository", {
  useClass: UserRepository,
});
