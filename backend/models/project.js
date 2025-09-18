const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // link to logged-in user
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
