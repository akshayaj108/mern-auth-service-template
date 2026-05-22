import { DataSource, DataSourceOptions } from "typeorm";
import { RefreshToken } from "../entity/RefreshToken";
import { CONFIG } from ".";
import { User } from "../entity/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: CONFIG.DB_HOST!,
  port: Number(CONFIG.DB_PORT),
  username: CONFIG.DB_USER_NAME!,
  password: CONFIG.DB_PASS!,
  database: CONFIG.DB_NAME!,
  //Don't use this prod
  synchronize: false,
  // synchronize: CONFIG.NODE_ENV === "test" || CONFIG.NODE_ENV === "dev",
  logging: false,
  entities: [User, RefreshToken],
  migrations: ["src/migration/*.ts"],
  subscribers: [],
} as DataSourceOptions);
