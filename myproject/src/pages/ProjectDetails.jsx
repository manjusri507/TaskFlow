// src/pages/ProjectDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ProjectDetails() {
  const { projectId, taskId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Local state for editing
  const [description, setDescription] = useState("");
  const [labels, setLabels] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:5000/api/projects/${projectId}/tasks/${taskId}`,
          {
            headers: { authorization: token },
          }
        );

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Error fetching task details");
        }

        const data = await res.json();
        setTask(data);
        setDescription(data.description || "");
        setLabels(data.labels?.join(", ") || "");
        setDueDate(data.dueDate ? data.dueDate.substring(0, 10) : "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [projectId, taskId]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/projects/${projectId}/tasks/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
          body: JSON.stringify({
            description,
            labels: labels.split(",").map((l) => l.trim()).filter(Boolean),
            dueDate,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error updating task");
      }

      const updated = await res.json();
      setTask(updated);
      alert("Task updated successfully ");
      navigate(-1);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading task details...</p>;
  if (error) return <p style={{ color: "red" }}>❌ {error}</p>;

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "30px auto",
        padding: "25px",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>
        Task Details
      </h2>

      <p>
        <strong>Title:</strong> {task.content}
      </p>
      <p>
        <strong>Status:</strong>{" "}
        <span
          style={{
            padding: "4px 10px",
            borderRadius: "8px",
            background:
              task.status === "done"
                ? "#d4edda"
                : task.status === "inprogress"
                ? "#fff3cd"
                : "#f8d7da",
            color:
              task.status === "done"
                ? "#155724"
                : task.status === "inprogress"
                ? "#856404"
                : "#721c24",
            fontWeight: "bold",
          }}
        >
          {task.status}
        </span>
      </p>

      <div style={{ marginTop: "20px" }}>
        <label style={{ fontWeight: "bold" }}>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            style={{
              width: "100%",
              marginTop: "5px",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
              resize: "none",
              fontSize: "14px",
            }}
          />
        </label>

        <label style={{ display: "block", marginTop: "15px", fontWeight: "bold" }}>
          Labels (comma separated):
          <input
            type="text"
            value={labels}
            onChange={(e) => setLabels(e.target.value)}
            style={{
              width: "100%",
              marginTop: "5px",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
              fontSize: "14px",
            }}
          />
        </label>

        <label style={{ display: "block", marginTop: "15px", fontWeight: "bold" }}>
          Due Date:
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{
              marginTop: "5px",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
              fontSize: "14px",
            }}
          />
        </label>

        <button
          onClick={handleUpdate}
          style={{
            marginTop: "20px",
            padding: "12px 20px",
            width: "100%",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.background = "#45a049")}
          onMouseOut={(e) => (e.target.style.background = "#4CAF50")}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
