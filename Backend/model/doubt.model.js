const mongoose = require("mongoose");

const doubtSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
      required: true,
    },
    topicId: {
      type: String,
      required: true,
    },
    topicTitle: {
      type: String,
      required: true,
    },
    query: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
    },
    response: {
      type: String,
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  },
);

const Doubt = mongoose.model("doubts", doubtSchema);

module.exports = Doubt;
