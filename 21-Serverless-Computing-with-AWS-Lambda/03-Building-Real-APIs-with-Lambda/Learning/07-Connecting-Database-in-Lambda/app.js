import connectDb, { createObjectId, isValidObjectId } from "./db.js";

export const lambdaFunction = async (event) => {
  const rawBody = event?.body;
  const path = event?.requestContext?.http?.path;
  const httpMethod = event?.requestContext?.http?.method;

  if (!httpMethod) return { message: "http method is required!" };
  if (!path || path !== "/") return { message: "Path not supported!" };

  // conditionally connect to DB
  const Todo = await connectDb();

  const body = rawBody ? JSON.parse(rawBody) : {};
  const todoContent = body.content;
  const isTodoCompleted = body.isCompleted;

  const handlers = {
    GET: async () => {
      if (!body.todoId) {
        const todos = await Todo.find().toArray();
        return todos;
      }

      if (!isValidObjectId(body.todoId))
        return { message: "Invalid object id!" };

      const todoId = createObjectId(body.todoId);

      const todo = await Todo.findOne({ _id: todoId });
      if (!todo) return { message: "todo doesn't exist!" };
      return todo;
    },
    POST: async () => {
      if (todoContent == null)
        return { message: "todo contents are required!" };

      const todo = await Todo.insertOne({
        content: todoContent,
        isCompleted: !!isTodoCompleted,
        timestamp: Date.now(),
      });

      return { message: "todo created successfully!", todo };
    },
    PUT: async () => {
      if (!body.todoId) return { message: "provide a todo to update!" };

      if (!isValidObjectId(body.todoId))
        return { message: "Invalid object id!" };

      const todoId = createObjectId(body.todoId);

      if (todoContent == null && isTodoCompleted == null)
        return { message: "provide some details to update!" };

      const toUpdate = {};
      if (todoContent) toUpdate.content = todoContent;
      if (typeof isTodoCompleted === "boolean")
        toUpdate.isCompleted = isTodoCompleted;

      const result = await Todo.updateOne({ _id: todoId }, { $set: toUpdate });

      if (result.modifiedCount === 0) return { message: "todo not found!" };

      return { message: "todo updated successfully!" };
    },
    DELETE: async () => {
      if (!body.todoId) return { message: "todo id required!" };

      if (!isValidObjectId(body.todoId))
        return { message: "Invalid object id!" };

      const todoId = createObjectId(body.todoId);

      const result = await Todo.deleteOne({ _id: todoId });

      if (result.deletedCount === 0) return { message: "todo doesn't exist!" };

      return { message: "todo deleted successfully!" };
    },
  };

  const handler = handlers[httpMethod];
  if (!handler) {
    return { message: "Invalid Http Method!" };
  }
  return await handler();
};
