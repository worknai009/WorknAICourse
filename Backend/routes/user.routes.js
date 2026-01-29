const express = require("express");
const router = express.Router();
const {
  purchaseCourse,
  getPurchasedCourses,
  getCompletedCourses,
  removePurchasedCourses,
  updateTopicProgress,
  removeTopicProgress,
  getUserProgress,
} = require("../controllers/purchaseController");
const { protect } = require("../config/authMiddleware");

router.post("/purchase", protect, purchaseCourse);
router.get("/my-courses", protect, getPurchasedCourses);
router.get("/completed-courses", protect, getCompletedCourses);
router.delete("/remove-courses", protect, removePurchasedCourses);
router.post("/progress", protect, updateTopicProgress);
router.post("/progress/remove", protect, removeTopicProgress);
router.get("/progress", protect, getUserProgress);

module.exports = router;
