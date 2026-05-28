import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UpdateUserPayload, UserData } from "../types";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";

export class UserService {
  constructor(private readonly userRepository: Repository<User>) {}
  async findByEmailWithPassword(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      select: [
        "id",
        "firstName",
        "lastName",
        "email",
        "pass",
        "role",
        "tenant",
      ],
    });
  }
  async getHashPassword(password: string) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }
  async create({ firstName, lastName, email, pass, role, tenantId }: UserData) {
    const user = await this.findByEmailWithPassword(email);
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
        tenantId: tenantId ? { id: tenantId } : undefined,
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
  async get() {
    return await this.userRepository.find();
  }
  async findById(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }
  async updateById(userId: number, userData: UpdateUserPayload) {
    const updatedUser = await this.userRepository.update(userId, userData);
    if (!updatedUser) {
      return null;
    }
    return await this.userRepository.findOneBy({ id: userId });
  }
  async delete(userId: number) {
    const response = await this.userRepository.delete(userId);
    if (response.affected === 0) {
      return null;
    }
    return response;
  }
}
