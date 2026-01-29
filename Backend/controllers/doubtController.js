const Doubt = require("../model/doubt.model");

exports.submitDoubt = async (req, res) => {
  try {
    const { courseId, topicId, topicTitle, query } = req.body;
    const userId = req.user._id; // Assuming user is available from auth middleware

    const newDoubt = await Doubt.create({
      userId,
      courseId,
      topicId,
      topicTitle,
      query,
    });

    res.status(201).json({
      success: true,
      data: newDoubt,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllDoubts = async (req, res) => {
  try {
    const doubts = await Doubt.find()
      .populate("userId", "name email")
      .populate("courseId", "name")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      data: doubts,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.resolveDoubt = async (req, res) => {
  try {
    const { doubtId } = req.params;
    const { response } = req.body;
    const mentorId = req.user._id;

    const doubt = await Doubt.findByIdAndUpdate(
      doubtId,
      {
        response,
        status: "resolved",
        mentorId,
      },
      { new: true },
    );

    if (!doubt) {
      return res.status(404).json({
        success: false,
        message: "Doubt not found",
      });
    }

    res.status(200).json({
      success: true,
      data: doubt,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUserDoubts = async (req, res) => {
  try {
    const userId = req.user._id;
    const doubts = await Doubt.find({ userId })
      .populate("courseId", "name")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      data: doubts,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
