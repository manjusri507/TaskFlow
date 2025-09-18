// models/Task.js
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Core board info
    content: { type: String, required: true }, // For board cards
    status: {
      type: String,
      enum: ["todo", "inprogress", "done"],
      default: "todo",
    },
    // Extended details
    description: { type: String, default: "" },
    labels: [{ type: String }],
    dueDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
