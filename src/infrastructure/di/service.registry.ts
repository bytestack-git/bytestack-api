import { container } from "tsyringe";
import { HashService } from "../../application/services/security/hash.service";
import { IHashService } from "../../domain/interfaces/serviceInterface/security/hash.service.interface";

container.register<IHashService>("IHashService", { useClass: HashService });
