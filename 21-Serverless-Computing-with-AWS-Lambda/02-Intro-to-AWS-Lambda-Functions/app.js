const eventPrototype = {
  city: "Pune",
  name: "Raquib",
  message: '"Hello from My Lambda!"',
  event: {
    headers: {
      "content-length": "38",
      "x-amzn-tls-version": "TLSv1.3",
      "x-forwarded-proto": "https",
      "postman-token": "6155394e-54a9-4b3a-9ae6-8e1777adc45d",
      "x-forwarded-port": "443",
      "x-forwarded-for": "xyz",
      accept: "*/*",
      "x-amzn-tls-cipher-suite": "TLS_AES_128_GCM_SHA256",
      "x-amzn-trace-id": "Root=1-6a382fe6-478900ed5a3feab513046e8a",
      host: "qmk6uwkdlnn5endurwmgs5wqha0jtuuw.lambda-url.ap-south-1.on.aws",
      "content-type": "application/json",
      "cache-control": "no-cache",
      "accept-encoding": "gzip, deflate, br",
      "user-agent": "PostmanRuntime/7.54.0",
    },
    isBase64Encoded: false,
    rawPath: "/",
    routeKey: "$default",
    requestContext: {
      accountId: "anonymous",
      timeEpoch: 1782067174179,
      routeKey: "$default",
      stage: "$default",
      domainPrefix: "qmk6uwkdlnn5endurwmgs5wqha0jtuuw",
      requestId: "39fc818e-3486-4f56-9829-0948321d7e71",
      domainName:
        "qmk6uwkdlnn5endurwmgs5wqha0jtuuw.lambda-url.ap-south-1.on.aws",
      http: {
        path: "/",
        protocol: "HTTP/1.1",
        method: "POST",
        sourceIp: "223.188.40.239",
        userAgent: "PostmanRuntime/7.54.0",
      },
      time: "21/Jun/2026:18:39:34 +0000",
      apiId: "qmk6uwkdlnn5endurwmgs5wqha0jtuuw",
    },
    body: '{\n    "log": "this a deployment log"\n}',
    version: "2.0",
    rawQueryString: "",
  },
  age: 32,
};

import fs from "node:fs/promises";
import crypto from "node:crypto";

const todoFile = "/tmp/todos.json";
let todoString = null;

try {
  await fs.access(todoFile);
  todoString = await fs.readFile(todoFile, "utf-8");
} catch (error) {
  await fs.writeFile(todoFile, "[]", "utf-8");
  todoString = "[]";
}

const Todos = JSON.parse(todoString);

export const lambdaFunction = async (event) => {
  const contentType = event.headers["content-type"];
  const rawBody = event.body;
  const path = event.requestContext?.http?.path;
  const httpMethod = event.requestContext?.http?.method;

  if (path && path !== "/") return { message: "Path not supported!" };

  console.log(httpMethod);
  console.log(path);

  const body = rawBody ? JSON.parse(rawBody) : {};
  const todoId = body.todoId;
  const todoContent = body.content;
  const isTodoCompleted = body.isCompleted;

  switch (httpMethod) {
    case "GET":
      if (!body.todoId) {
        return Todos;
      }

      const todo = Todos.find((todo) => todo.id === body.todoId);

      if (!todo) return { message: "todo doesn't exist!" };

      return todo;

    case "POST":
      if (todoContent == null)
        return { message: "todo contents are required!" };

      Todos.push({
        id: crypto.randomUUID(),
        content: todoContent,
        isCompleted: !!isTodoCompleted,
        timestamp: Date.now(),
      });
      await fs.writeFile(todoFile, JSON.stringify(Todos, null, 2));
      return { message: "todo created successfully!" };

    case "PUT":
      if (!todoId) return { message: "provide a todo to update!" };

      if (todoContent == null && isTodoCompleted == null)
        return { message: "provide some details to update!" };

      let todoPresent = false;
      Todos.forEach((todo) => {
        if (todo.id === todoId) {
          if (todoContent) todo.content = todoContent;
          if (typeof isTodoCompleted === "boolean")
            todo.isCompleted = isTodoCompleted;
          todoPresent = true;
        }
      });

      if (!todoPresent) return { message: "todo not found!" };

      await fs.writeFile(todoFile, JSON.stringify(Todos, null, 2));
      return { message: "todo updated successfully!" };

    case "DELETE":
      if (!body.todoId) return { message: "todo id required!" };

      const todoIndex = Todos.findIndex((todo) => todo.id === body.todoId);

      if (todoIndex === -1) return { message: "todo doesn't exist!" };

      Todos.splice(todoIndex, 1);
      await fs.writeFile(todoFile, JSON.stringify(Todos, null, 2));
      return { message: "todo deleted successfully!" };

    default:
      return { message: "Invalid Http Method!" };
  }
};
