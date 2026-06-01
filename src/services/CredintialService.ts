import bcrypt from "bcryptjs";

export class CredentialsService {
  async comparePassword(userPassword: string, hashedPassword: string) {
    return await bcrypt.compare(userPassword, hashedPassword);
  }
}
