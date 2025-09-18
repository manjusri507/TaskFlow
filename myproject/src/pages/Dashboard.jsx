import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { FaTrash } from "react-icons/fa";

export default function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");

  // ✅ Helper to get correct token header
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) return {};
    return { authorization: token }; // keep "Bearer" since backend expects it
     console.log("Token in localStorage:", token);
  };

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/projects", {
          headers: { ...getAuthHeader() },
        });
        const data = await res.json();

        if (res.ok) {
          setProjects(data);
        } else {
          console.error("Error fetching projects:", data.message);
          setProjects([]); // prevent .map crash
        }
      } catch (err) {
        console.error("Network error:", err);
        setProjects([]);
      }
    };
    fetchProjects();
  }, []);

  // Create project
  const handleCreateProject = async () => {
    if (newProjectName.trim() === "") return;

    try {
      const res = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          name: newProjectName,
          description: newProjectDesc,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setProjects([...projects, data]); // update state
        setNewProjectName("");
        setNewProjectDesc("");
        setShowModal(false);
      } else {
        console.error("Error creating project:", data.message);
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  // Delete project
  const handleDeleteProject = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: "DELETE",
        headers: { ...getAuthHeader() },
      });

      if (res.ok) {
        setProjects(projects.filter((p) => p._id !== id));
      } else {
        const data = await res.json();
        console.error("Error deleting project:", data.message);
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  // Navigate to project details
  const handleProjectClick = (id) => {
    navigate(`/projectboard/${id}`);
  };

  return (
    <div className="projects-container">
      {/* Header */}
      <div className="projects-header">
        <h1>My Projects</h1>
        <button onClick={() => setShowModal(true)} className="create-btn">
          + Create New Project
        </button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <p className="no-projects">No projects yet. Create one!</p>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project._id} className="project-card">
              <div
                className="project-info"
                onClick={() => handleProjectClick(project._id)}
              >
                <h2>{project.name}</h2>
                <p>{project.description}</p>
              </div>
              <button
                className="delete-btn"
                onClick={() => handleDeleteProject(project._id)}
              >
                <FaTrash size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create New Project</h2>
            <input
              type="text"
              placeholder="Project Name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
            <textarea
              placeholder="Project Description"
              value={newProjectDesc}
              onChange={(e) => setNewProjectDesc(e.target.value)}
              rows="3"
            />
            <div className="modal-actions">
              <button
                onClick={() => setShowModal(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button onClick={handleCreateProject} className="create-btn">
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
