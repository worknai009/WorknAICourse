const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    purchasedCourses: [
      { type: mongoose.Schema.Types.ObjectId, ref: "courses" },
    ],
    completedCourses: [
      { type: mongoose.Schema.Types.ObjectId, ref: "courses" },
    ],
    profileImage: { type: String, default: "" },
    progress: [
      {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "courses" },
        completedTopics: [{ type: String }],
      },
    ],
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("users", userSchema);
