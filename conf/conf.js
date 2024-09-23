import dotenv from "dotenv";
dotenv.config();
const conf = {
  MONGO_URL: String(process.env.MONGO_URL),
  PORT: String(process.env.PORT),
  JWT_SECRET: String(process.env.JWT_SECRET),
};
export default conf;
