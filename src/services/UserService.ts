import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UpdateUserPayload, UserData } from "../types";
import createHttpError from "http-errors";
import { getHashPassword } from "../utils";
import { Tenant } from "../entity/Tenants";

export class UserService {
  constructor(private readonly userRepository: Repository<User>) {}
  async findByEmailWithPassword(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      select: ["id", "firstName", "lastName", "email", "pass", "role"],
    });
  }

  async create({ firstName, lastName, email, pass, role, tenantId }: UserData) {
    const user = await this.findByEmailWithPassword(email);
    if (user) {
      const err = createHttpError(400, "User email is already exists");
      throw err;
    }
    try {
      const hashedPassword = await getHashPassword(pass);
      const userData: Partial<User> = {
        firstName,
        lastName,
        email,
        pass: hashedPassword,
        role: role!,
      };

      if (tenantId) {
        userData.tenant = { id: tenantId } as Tenant;
      }

      return await this.userRepository.save(userData);
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
    return await this.userRepository.findOne({
      where: { id },
      relations: ["tenant"],
    });
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
