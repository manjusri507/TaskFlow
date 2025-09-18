const Task = require("../models/Task");

// Get all tasks for a project
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      projectId: req.params.projectId,
      createdBy: req.user.id,
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { content, status } = req.body;
    const task = new Task({
      content,
      status: status || "todo",
      projectId: req.params.projectId,
      createdBy: req.user.id,
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update a task (edit content or move column)
exports.updateTask = async (req, res) => {
  try {
    const { content, status } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      { content, status },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
