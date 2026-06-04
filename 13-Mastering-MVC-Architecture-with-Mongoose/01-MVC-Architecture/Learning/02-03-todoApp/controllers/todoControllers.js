import { ObjectId } from "mongodb";
import todoModel from "../models/todoModel.js";

export const addTodo = async (req, res) => {
  const todo = req.body;
  try {
    await todoModel.insertOne({ ...todo, completed: todo.completed || false });
    res.redirect("/todos");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create todo" });
  }
};

export const getAllTodos = async (req, res) => {
  try {
    // const todos = await req.db.collection("todos").find().toArray();
    const todos = await todoModel.find().lean().exec();
    // res.status(200).json(todos);
    res.render("index.jsx", { todos });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
};

export const getTodoById = async (req, res) => {
  try {
    // const todos = await req.db
    //   .collection("todos")
    //   .findOne({ _id: new ObjectId(req.params.id) });
    const todos = await todoModel.findById(req.params.id).lean().exec();
    res.status(200).json(todos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
};

export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const updatedTodo = req.body;
  try {
    // const result = await req.db
    //   .collection("todos")
    //   .updateOne({ _id: new ObjectId(id) }, { $set: updatedTodo });

    const result = await todoModel.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updatedTodo },
      { runValidators: true },
    );
    if (!result)
      return res.status(404).json({ message: "No such Todo exist!" });
    res.status(200).json({ message: "Todo updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update todo" });
  }
};

export const deleteTodo = async (req, res) => {
  const { id } = req.params;
  try {
    // const result = await req.db
    //   .collection("todos")
    //   .deleteOne({ _id: new ObjectId(id) });
    // if (result.deletedCount === 0) {
    //   return res.status(404).json({ error: "Todo not found" });
    // }
    const result = await todoModel.findByIdAndDelete(id);
    if (!result)
      return res.status(404).json({ message: "No such Todo exist!" });
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
};
