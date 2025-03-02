import React, { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [taskId, setTaskId] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/task/tasks");
      setTasks(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        await axios.put(`/api/task/${taskId}`, formData);
        setEditing(false);
        setTaskId("");
      } else {
        await axios.post("/api/task/create", formData);
      }
      setFormData({ title: "", description: "" });
      fetchTasks();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (_id) => {
    await axios.delete(`/api/task/${_id}`);
    fetchTasks();
  };

  const handleEdit = (task) => {
    setEditing(true);
    setTaskId(task._id);
    setFormData({ title: task.title, description: task.description });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-4">Task Manager</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            id="title"
            placeholder="Enter task title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            id="description"
            placeholder="Enter task description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700 transition"
          >
            {editing ? "Update Task" : "Create Task"}
          </button>
        </form>
      </div>

      <div className="w-full max-w-2xl mt-6">
        <h2 className="text-2xl font-bold mb-4">Task List</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks available</p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white p-4 rounded shadow flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold text-lg">{task.title}</h3>
                  <p className="text-gray-600">{task.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(task)}
                    className="bg-slate-500 text-white px-4 py-2 rounded hover:bg-slate-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
