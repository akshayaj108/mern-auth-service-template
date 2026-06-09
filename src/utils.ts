import { AppDataSource } from "./config/data-source";
import logger from "./config/logger";
import { User } from "./entity/User";
import bcrypt from "bcryptjs";
import { Roles } from "./constants";
import { CONFIG } from "./config";

export async function createAdmin() {
  const userRepository = AppDataSource.getRepository(User);

  const adminRole = Roles.ADMIN;
  const existingAdmin = await userRepository.findOneBy({ role: adminRole });

  if (existingAdmin) {
    console.log("Admin user already exists.");
    return;
  }

  const adminUser = new User();
  adminUser.firstName = CONFIG.ADMIN_FIRST_NAME || "System";
  adminUser.lastName = CONFIG.ADMIN_LAST_NAME || "Admin";
  adminUser.email = CONFIG.ADMIN_EMAIL || "admin@mern.com";
  adminUser.pass = await getHashPassword(CONFIG.ADMIN_PASSWORD || "password");
  adminUser.role = adminRole;

  try {
    await userRepository.save(adminUser);
    logger.info("Admin user created successfully.");
  } catch (error) {
    console.error("Error creating admin user:", error);
    logger.info("Admin user already created by another instance.");
  }
}
export async function getHashPassword(password: string) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}
