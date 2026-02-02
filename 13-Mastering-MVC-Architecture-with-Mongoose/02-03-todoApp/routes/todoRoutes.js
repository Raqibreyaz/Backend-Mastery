import express from "express";
import {
  addTodo,
  getTodoById,
  getAllTodos,
  updateTodo,
  deleteTodo, 
} from "../controllers/todoControllers.js";

const router = express.Router();

// Create a new to-do item
// Get all to-do items
router.route("/").post(addTodo).get(getAllTodos);

// Get single to-do item
// Update a to-do item
// Delete a to-do item
router.route("/:id").get(getTodoById).put(updateTodo).delete(deleteTodo);

export default router;
