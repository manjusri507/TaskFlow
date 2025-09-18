const express = require("express");
const router = express.Router();
const { getProjects, createProject, deleteProject } = require("../controllers/projectController.js");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getProjects);
router.post("/", authMiddleware, createProject);
router.delete("/:id", authMiddleware, deleteProject);

module.exports = router;
