import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import "./ProjectBoard.css";

export default function ProjectBoard() {
  const { id } = useParams(); // projectId
  const navigate = useNavigate();

  const [columns, setColumns] = useState({
    todo: { name: "To-Do", tasks: [] },
    inProgress: { name: "In Progress", tasks: [] },
    done: { name: "Done", tasks: [] },
  });

  const [newTask, setNewTask] = useState({});
  const [editingTask, setEditingTask] = useState(null);
  const [editValue, setEditValue] = useState("");

  const token = localStorage.getItem("token");

  // ✅ Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/projects/${id}/tasks`, {
          headers: { Authorization: token },
        });
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const tasks = await res.json();

        setColumns({
          todo: { name: "To-Do", tasks: tasks.filter((t) => t.status === "todo") },
          inProgress: { name: "In Progress", tasks: tasks.filter((t) => t.status === "inprogress") },
          done: { name: "Done", tasks: tasks.filter((t) => t.status === "done") },
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchTasks();
  }, [id, token]);

  // ✅ Add task
  const handleAddTask = async (colId) => {
    if (!newTask[colId]?.trim()) return;
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ content: newTask[colId], status: colId }),
      });
      const task = await res.json();
      setColumns({
        ...columns,
        [colId]: { ...columns[colId], tasks: [...columns[colId].tasks, task] },
      });
      setNewTask({ ...newTask, [colId]: "" });
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Delete task
  const handleDeleteTask = async (colId, taskId) => {
    try {
      await fetch(`http://localhost:5000/api/projects/${id}/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      setColumns({
        ...columns,
        [colId]: {
          ...columns[colId],
          tasks: columns[colId].tasks.filter((t) => t._id !== taskId),
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Edit task
  const handleEditTask = (taskId, colId, content) => {
    setEditingTask({ taskId, colId });
    setEditValue(content);
  };

  const handleSaveEdit = async () => {
    const { taskId, colId } = editingTask;
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ content: editValue, status: colId }),
      });
      const updated = await res.json();
      const updatedTasks = columns[colId].tasks.map((t) =>
        t._id === taskId ? updated : t
      );
      setColumns({ ...columns, [colId]: { ...columns[colId], tasks: updatedTasks } });
      setEditingTask(null);
      setEditValue("");
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Drag & Drop → update backend status
  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      // reorder in same column
      const column = columns[source.droppableId];
      const copiedTasks = [...column.tasks];
      const [removed] = copiedTasks.splice(source.index, 1);
      copiedTasks.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: { ...column, tasks: copiedTasks },
      });
    } else {
      // move to another column
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceTasks = [...sourceColumn.tasks];
      const destTasks = [...destColumn.tasks];
      const [removed] = sourceTasks.splice(source.index, 1);

      try {
        await fetch(`http://localhost:5000/api/projects/${id}/tasks/${removed._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
          body: JSON.stringify({
            content: removed.content,
            status: destination.droppableId,
          }),
        });
      } catch (err) {
        console.error(err);
      }

      destTasks.splice(destination.index, 0, { ...removed, status: destination.droppableId });

      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceColumn, tasks: sourceTasks },
        [destination.droppableId]: { ...destColumn, tasks: destTasks },
      });
    }
  };

  const handleViewDetails = (taskId) => {
  console.log("Navigating to:", `/projectdetails/${id}/${taskId}`);
  navigate(`/projectdetails/${id}/${taskId}`);
};


  return (
    <div className="board-container">
      <h1 className="board-title">Project Board - {id}</h1>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board-grid">
          {Object.entries(columns).map(([colId, col]) => (
            <Droppable droppableId={colId} key={colId}>
              {(provided) => (
                <div className="column" ref={provided.innerRef} {...provided.droppableProps}>
                  <h2 className="column-title">{col.name}</h2>

                  {col.tasks.map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided) => (
                        <div
                          className="task-card"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {editingTask &&
                          editingTask.taskId === task._id &&
                          editingTask.colId === colId ? (
                            <div className="edit-task">
                              <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                              />
                              <button className="save-btn" onClick={handleSaveEdit}>
                                Save
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="task-content">
                                <p>{task.content}</p>
                                <div className="task-actions">
                                  <button onClick={() => handleEditTask(task._id, colId, task.content)}>
                                    <FaEdit />
                                  </button>
                                  <button onClick={() => handleDeleteTask(colId, task._id)}>
                                    <FaTrash />
                                  </button>
                                </div>
                              </div>
                              <button
                                className="view-details-btn"
                                onClick={() => handleViewDetails(task._id)}
                              >
                                View Details
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}

                  <div className="add-task">
                    <input
                      type="text"
                      placeholder="New task..."
                      value={newTask[colId] || ""}
                      onChange={(e) => setNewTask({ ...newTask, [colId]: e.target.value })}
                    />
                    <button onClick={() => handleAddTask(colId)}>
                      <FaPlus />
                    </button>
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
