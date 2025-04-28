import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const nodeEnv = process.env.NODE_ENV || "development";

export default {
  env: nodeEnv,
  port: process.env.PORT,
  mongoUrl: nodeEnv === 'test' ? process.env.MONGO_URI_TEST : process.env.MONGO_URI,
};