const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  video: {
    url: { type: String, default: "" },
    provider: { type: String, default: "cloudinary" },
    duration: { type: Number, default: 0 },
    isPreview: { type: Boolean, default: false },
  },
});

const weekSchema = new mongoose.Schema({
  label: { type: String, required: true },
  title: { type: String, required: true },
  topics: [topicSchema],
});

const syllabusPhaseSchema = new mongoose.Schema({
  month: { type: String, required: true },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  weeks: [weekSchema],
});

const technicalSpecSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
  icon: { type: String, required: true },
});

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, default: "link" },
});

const courseSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["Online", "Offline", "Hybrid"],
    },
    language: { type: String, required: true },
    originalPrice: { type: Number, required: true },
    discountedPrice: { type: Number, required: true },
    technicalSpecs: [technicalSpecSchema],
    syllabusPhases: [syllabusPhaseSchema],
    resources: [resourceSchema],
    certificateImage: { type: String, default: null },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

courseSchema.index({ name: 1 });

module.exports = mongoose.model("courses", courseSchema);
