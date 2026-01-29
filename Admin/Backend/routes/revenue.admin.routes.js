const express = require("express");
const router = express.Router();
const User = require("../model/user.model");

router.get("/transactions", async (req, res) => {
  try {
    // Find users who have purchased courses and populate them
    const users = await User.find({
      purchasedCourses: { $exists: true, $not: { $size: 0 } },
    })
      .populate("purchasedCourses", "name discountedPrice id")
      .select("name email purchasedCourses updatedAt")
      .sort({ updatedAt: -1 });

    // Flatten the data for easier display in a table
    let transactions = [];
    users.forEach((user) => {
      user.purchasedCourses.forEach((course) => {
        transactions.push({
          id: `${user._id}_${course._id}`,
          userName: user.name,
          userEmail: user.email,
          courseName: course.name,
          courseId: course.id,
          amount: course.discountedPrice,
          date: user.updatedAt, // This is a fallback, real transactions would have their own timestamp
        });
      });
    });

    // Re-sort by date if necessary
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
