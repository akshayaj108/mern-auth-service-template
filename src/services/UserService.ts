import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UserData } from "../types";
import createHttpError from "http-errors";
import { Roles } from "../constants";
import bcrypt from "bcrypt";

export class UserService {
  constructor(private userRepository: Repository<User>) {}
  async create({ firstName, lastName, email, pass }: UserData) {
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (user) {
      const err = createHttpError(400, "User email is already exists");
      throw err;
    }
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(pass, saltRounds);
      return await this.userRepository.save({
        firstName,
        lastName,
        email,
        pass: hashedPassword,
        role: Roles.CUSTOMER,
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
}
