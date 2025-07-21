const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error("Error: MONGODB_URI is not defined in your .env file.");
      process.exit(1);
    }

    // The options useNewUrlParser and useUnifiedTopology are no longer required in recent versions of Mongoose.
    await mongoose.connect(uri);

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDb;
