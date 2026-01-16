import { config } from "dotenv";
import path from "path";

config({ path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`) });

const {
  PORT,
  NODE_ENV,
  DB_HOST,
  DB_PORT,
  DB_USER_NAME,
  DB_PASS,
  DB_NAME,
  REFRESH_TOKEN_SECRET,
} = process.env;

export const CONFIG = {
  PORT,
  NODE_ENV,
  DB_HOST,
  DB_PORT,
  DB_USER_NAME,
  DB_PASS,
  DB_NAME,
  REFRESH_TOKEN_SECRET,
};
