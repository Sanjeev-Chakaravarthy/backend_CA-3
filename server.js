const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 5000;

app.use(bodyParser.json());


mongoose
  .connect("mongodb+srv://sanjeevms28122:28122006MS@cluster0.kwpz8.mongodb.net/backend_ca-3")
  .then(() => console.log("MongoDB connection successful"))
  .catch((error) => console.error("MongoDB connection failed:", error));


const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dob: { type: Date, required: true },
});


const User = mongoose.model("User", userSchema);


app.post("/signup", async (req, res) => {
  try {
    const { username, email, password, dob } = req.body;

 
    if (!username) {
      return res.status(400).json({ error: "Username cannot be empty" });
    }
    if (!email) {
      return res.status(400).json({ error: "Email cannot be empty" });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    if (!password || password.length < 8 || password.length > 16) {
      return res.status(400).json({
        error: "Password length should be greater than 8 or less than or equal to 16",
      });
    }
    if (!dob) {
      return res.status(400).json({ error: "Date of Birth cannot be empty" });
    }

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newUser = new User({ username, email, password: hashedPassword, dob });
    await newUser.save();

    console.log("New user created:", newUser);
    res.status(201).json({ message: "Signup successful", user: { username, email, dob } });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
