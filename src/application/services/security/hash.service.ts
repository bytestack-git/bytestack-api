import { injectable } from "tsyringe";
import bcrypt from "bcrypt";
import { IHashService } from "../../../domain/interfaces/serviceInterface/security/hash.service.interface";

@injectable()
export class HashService implements IHashService {
  private slatRounds = 10;

  async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, this.slatRounds);
  }

  async compare(plainText: string, hashedText: string): Promise<boolean> {
    return bcrypt.compare(plainText, hashedText);
  }
}
