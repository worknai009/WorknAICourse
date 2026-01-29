const express = require("express");
const router = express.Router();
const Admin = require("../model/admin.model");
const jwt = require("jsonwebtoken");

// Admin Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Admin.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid credentials or you are not an admin" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin Signup (Initial setup or adding more admins)
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await Admin.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new Admin({
      name,
      email,
      password,
      role: "admin", // Force role as admin for this signup route
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
