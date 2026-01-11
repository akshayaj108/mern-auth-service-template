import { DataSource, DataSourceOptions } from "typeorm";
import { User } from "./entity/User";
import { CONFIG } from "./config";

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
  entities: [User],
  migrations: [],
  subscribers: [],
} as DataSourceOptions);
