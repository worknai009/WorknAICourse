const mongoose = require("mongoose");

const doubtSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // Ref 'users' might be in a different db or same db; assuming same db for now.
      // If 'users' model isn't registered in this connection, populate might fail if strict,
      // but usually flexible in Mongoose if connected to same DB.
      ref: "users",
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "courses",
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
