import mongoose, { connect } from "mongoose";
import conf from "../conf/conf.js";

const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(conf.MONGO_URL);
    console.log(`MongoDb connected : ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error connection to MongoDB : ${err.message}`);
    process.exit();
  }
};

export default connectMongoDB;
