import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI);

    console.log("==================================");
    console.log("Host:", conn.connection.host);
    console.log("Database:", conn.connection.name);
    console.log("URI:", process.env.DB_URI);

    const collections = await conn.connection.db.listCollections().toArray();
    console.log("Collections:", collections);
    console.log("==================================");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;