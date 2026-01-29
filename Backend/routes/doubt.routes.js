const express = require("express");
const router = express.Router();
const {
  submitDoubt,
  getAllDoubts,
  resolveDoubt,
  getUserDoubts,
} = require("../controllers/doubtController");
const { protect } = require("../config/authMiddleware");

// User routes
router.post("/", protect, submitDoubt);
router.get("/my-doubts", protect, getUserDoubts);

// Admin routes (should ideally have an isAdmin middleware, but let's check role in controller or add it here if exists)
router.get("/all", protect, getAllDoubts);
router.patch("/:doubtId/resolve", protect, resolveDoubt);

module.exports = router;
