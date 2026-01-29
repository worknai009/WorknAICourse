const User = require("../model/user.model");
const Course = require("../model/course.model");

exports.purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if course exists
    const course = await Course.findOne({ id: courseId });
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Check if already purchased
    if (user.purchasedCourses.includes(course._id)) {
      return res
        .status(400)
        .json({ success: false, message: "Course already purchased" });
    }

    user.purchasedCourses.push(course._id);
    await user.save();

    res.json({ success: true, message: "Course purchased successfully", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPurchasedCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("purchasedCourses");
    res.json({ success: true, data: user.purchasedCourses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCompletedCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("completedCourses");
    res.json({ success: true, data: user.completedCourses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.removePurchasedCourses = async (req, res) => {
  try {
    const { courseIds } = req.body; // Expecting an array of DB _id strings
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.purchasedCourses = user.purchasedCourses.filter(
      (id) => !courseIds.includes(id.toString()),
    );

    await user.save();

    res.json({ success: true, message: "Courses removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTopicProgress = async (req, res) => {
  try {
    const { courseId, topicId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Find or create course progress
    let progressItem = user.progress.find(
      (p) => p.courseId.toString() === courseId,
    );

    if (!progressItem) {
      user.progress.push({
        courseId,
        completedTopics: [topicId],
      });
    } else {
      if (!progressItem.completedTopics.includes(topicId)) {
        progressItem.completedTopics.push(topicId);
      }
    }

    await user.save();
    res.json({
      success: true,
      message: "Progress updated",
      progress: user.progress,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.removeTopicProgress = async (req, res) => {
  try {
    const { courseId, topicId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const progressItem = user.progress.find(
      (p) => p.courseId.toString() === courseId,
    );

    if (progressItem) {
      progressItem.completedTopics = progressItem.completedTopics.filter(
        (id) => id.toString() !== topicId,
      );
      await user.save();
    }

    res.json({
      success: true,
      message: "Progress removed",
      progress: user.progress,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("progress");
    res.json({ success: true, data: user.progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
