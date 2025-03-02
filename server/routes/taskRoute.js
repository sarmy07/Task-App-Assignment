const express = require("express");
const {
  allTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
} = require("../controller/taskController");
const router = express.Router();

router.post("/create", createTask);
router.get("/tasks", allTasks);
router.get("/:id", getTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
