const Project = require("../models/project");

// Get all projects for a user
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user.id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create new project
exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newProject = new Project({
      name,
      description,
      createdBy: req.user.id,
    });
    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
