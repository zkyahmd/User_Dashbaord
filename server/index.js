const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); // Added for password hashing
const UserModel = require("./models/user");

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = "my-key";

// Db connection
mongoose.connect("mongodb://127.0.0.1:27017/userDashboard");

// to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

// Login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  UserModel.findOne({ email: email }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return res.status(500).json({ message: "Server error" });
        if (isMatch) {
          // Generate JWT token
          const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
          res.json({ token });
        } else {
          res.json({ message: "The password is incorrect" });
        }
      });
    } else {
      res.json({ message: "No record existed" });
    }
  });
});

// Register route
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ message: "Server error" });
    UserModel.create({ ...req.body, password: hashedPassword })
      .then((users) => res.json(users))
      .catch((err) => res.json(err));
  });
});

// Get user details (for dashboard)
app.get("/getUser", verifyToken, (req, res) => {
  UserModel.findById(req.user.id)
    .then((user) => {
      if (user) {
        res.json(user); // send user data
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((err) => res.status(400).json(err));
});

// Update user profile 
app.put("/updateProfile", verifyToken, (req, res) => {
  const { name, email, password } = req.body;
  const updateData = { name, email };

  if (password) {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ message: "Error hashing password" });
      updateData.password = hashedPassword; // Hash the new password
      updateUser(updateData);
    });
  } else {
    updateUser(updateData);
  }

  function updateUser(updateData) {
    UserModel.findByIdAndUpdate(req.user.id, updateData, { new: true })
      .then((updatedUser) => res.json(updatedUser)) // send the updated user data
      .catch((err) => res.status(400).json(err));
  }
});

// Server
app.listen(3001, () => {
  console.log("Server is running..");
});