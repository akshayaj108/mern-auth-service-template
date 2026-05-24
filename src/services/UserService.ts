import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UserData } from "../types";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";

export class UserService {
  constructor(private userRepository: Repository<User>) {}
  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }
  async getHashPassword(password: string) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }
  async create({ firstName, lastName, email, pass, role }: UserData) {
    const user = await this.findByEmail(email);
    if (user) {
      const err = createHttpError(400, "User email is already exists");
      throw err;
    }
    try {
      const hashedPassword = await this.getHashPassword(pass);
      return await this.userRepository.save({
        firstName,
        lastName,
        email,
        pass: hashedPassword,
        role: role!,
      });
    } catch (error) {
      console.log("err", error);
      const customError = createHttpError(
        500,
        "Failed to store data in database",
      );
      throw customError;
    }
  }
  async findById(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }
}
