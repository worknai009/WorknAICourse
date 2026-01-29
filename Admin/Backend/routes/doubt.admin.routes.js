const express = require("express");
const router = express.Router();
const Doubt = require("../model/doubt.model");
// Using User model from adjacent admin routes or generic reference if needed,
// but populate relies on model name registration.
// We assume 'users' and 'courses' models are registered in this app instance
// (usually via require in other routes or central loader).
// Just to be safe, let's allow populate to work if models are known.
// If models aren't registered, we might need to require them here even if unused directly.
const Course = require("../model/course.model");
const User = require("../model/user.model");

// Get all doubts
router.get("/", async (req, res) => {
  try {
    const doubts = await Doubt.find()
      .populate("userId", "name email")
      .populate("courseId", "name")
      .sort("-createdAt");
    res.json(doubts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Resolve doubt
router.patch("/:id/resolve", async (req, res) => {
  try {
    const { response } = req.body;
    // req.user should be available from protectAdmin middleware
    const mentorId = req.user._id;

    const doubt = await Doubt.findByIdAndUpdate(
      req.params.id,
      {
        response,
        status: "resolved",
        mentorId,
      },
      { new: true },
    );

    if (!doubt) {
      return res.status(404).json({ message: "Doubt not found" });
    }

    res.json(doubt);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
