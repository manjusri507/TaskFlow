const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router({ mergeParams: true });

// Get all tasks for a project
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new task
router.post("/", authMiddleware, async (req, res) => {
  try {
    const task = new Task({
      projectId: req.params.projectId,
      createdBy: req.user.id,
      content: req.body.content,
      status: req.body.status?.toLowerCase() || "todo", // ✅ normalize
      description: req.body.description || "",
      labels: req.body.labels || [],
      dueDate: req.body.dueDate || null,
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get single task
router.get("/:taskId", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.taskId,
      projectId: req.params.projectId,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update task
router.put("/:taskId", authMiddleware, async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.status) updates.status = updates.status.toLowerCase(); // ✅ normalize

    const task = await Task.findOneAndUpdate(
      { _id: req.params.taskId, projectId: req.params.projectId },
      updates,
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete task
router.delete("/:taskId", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.taskId,
      projectId: req.params.projectId,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
