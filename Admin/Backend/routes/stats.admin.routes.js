const express = require("express");
const router = express.Router();
const User = require("../model/user.model");
const Course = require("../model/course.model");

router.get("/", async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const courseCount = await Course.countDocuments({ isActive: true });

    // Fetch recent activities (e.g., last 5 users)
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email createdAt");

    // Fetch recent courses
    const recentCourses = await Course.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select("name createdAt");

    // Calculate Revenue
    const usersWithPurchases = await User.find({
      purchasedCourses: { $exists: true, $not: { $size: 0 } },
    }).populate("purchasedCourses", "discountedPrice");

    let totalRevenue = 0;
    usersWithPurchases.forEach((user) => {
      user.purchasedCourses.forEach((course) => {
        if (course && course.discountedPrice) {
          totalRevenue += course.discountedPrice;
        }
      });
    });

    res.json({
      stats: {
        totalUsers: userCount,
        activeCourses: courseCount,
        totalRevenue: totalRevenue,
      },
      recentActivity: recentUsers
        .map((user) => ({
          id: user._id,
          type: "user",
          message: `New user registered: ${user.name}`,
          time: user.createdAt,
        }))
        .concat(
          recentCourses.map((course) => ({
            id: course._id,
            type: "course",
            message: `New course published: ${course.name}`,
            time: course.createdAt,
          })),
        )
        .sort((a, b) => b.time - a.time)
        .slice(0, 5),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
