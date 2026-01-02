const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const User = require("./models/User");
const City = require("./models/City");
const Property = require("./models/Property");
const Testimonial = require("./models/Testimonial");
const Amenity = require("./models/Amenity");
const Interested = require("./models/Interested");

mongoose.connect(process.env.MONGO_URI);

async function seed() {
  try {
    await mongoose.connection.asPromise();
    await mongoose.connection.db.dropDatabase();
    console.log("🗑️ Old database dropped");

    // --- Users (from users table) ---
    

    console.log("✅ Database seeded successfully with all data!");
    mongoose.disconnect(); 
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    mongoose.disconnect();
  }
}

seed(); 
