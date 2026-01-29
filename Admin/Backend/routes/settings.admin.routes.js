const express = require("express");
const router = express.Router();
const Admin = require("../model/admin.model");
const bcrypt = require("bcryptjs");

// Get current admin info
router.get("/profile", async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");
    if (!admin)
      return res.status(404).json({ message: "Admin user not found" });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update admin profile
router.put("/update-profile", async (req, res) => {
  try {
    const { name, email, newPassword } = req.body;
    const admin = await Admin.findById(req.user.id);

    if (!admin)
      return res.status(404).json({ message: "Admin user not found" });

    if (name) admin.name = name;
    if (email) admin.email = email;

    if (newPassword) {
      admin.password = newPassword; // The pre-save hook in user.model.js will hash this
    }

    await admin.save();

    const updatedAdmin = admin.toObject();
    delete updatedAdmin.password;

    res.json({ message: "Profile updated successfully", user: updatedAdmin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
