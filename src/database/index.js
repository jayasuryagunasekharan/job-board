const mongoose = require("mongoose");

const connectToDB = async (retries = 5) => {
  const connectionURL = process.env.MONGODB_URL;

  const options = {
    serverSelectionTimeoutMS: 60000, // Increase timeout to 60 seconds
    socketTimeoutMS: 45000,
    connectTimeoutMS: 60000,
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(connectionURL, options);
      console.log("Job board database connection is successful");
      return; // Connection successful, exit the function
    } catch (error) {
      console.error(`Attempt ${attempt} failed. Error:`, error.message);
      
      if (attempt === retries) {
        console.error("All connection attempts failed. Throwing error.");
        throw error; // Throw error after all retries fail
      }
      
      // Wait before next attempt (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }
};

module.exports = connectToDB;
