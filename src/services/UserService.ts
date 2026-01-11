import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UserData } from "../types";

export class UserService {
  constructor(private userRepository: Repository<User>) {}
  async create({ firstName, lastName, email, pass }: UserData) {
    return await this.userRepository.save({
      firstName,
      lastName,
      email,
      pass,
    });
  }
}
