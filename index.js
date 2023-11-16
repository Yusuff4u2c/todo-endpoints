const express = require("express");
const { validationResult, body } = require("express-validator");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 8080;

let todos = [
  {
    id: 1,
    title: "Read some codes",
    description: "Saturday is for reading code",
  },
  {
    id: 2,
    title: "Do Some Laundries",
    description: "Sunday Morning is for movies",
  },
  {
    id: 3,
    title: "Watch Movies",
    description: "Sunday Evening is for movies",
  },
];

let lastId = 3;

const createTodoSchema = [body("title").isString().notEmpty(), body("description").isString().notEmpty()];

app.get("/", (req, res) => {
  res.send("<h1>Todo demo home</h1>");
});

app.get("/todos", (req, res) => {
  res.send({ status: true, data: todos });
});

app.get("/todos/:id", (req, res) => {
  let todo = todos.find((todo) => todo.id == req.params.id);
  res.send({ status: true, data: todo });
});

app.post("/todos", ...createTodoSchema, function (req, res) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    res.status(400).send({
      status: false,
      errors: result.errors,
    });
    return;
  }

  let newTodo = { ...req.body, id: ++lastId };
  console.log(req.body);
  todos.push(newTodo);

  res.status(201).send({
    message: "Todo Created",
    status: true,
    data: todos,
  });
});

app.delete("/todos/:id", (req, res) => {
  let todo = todos.find((todo) => todo.id == req.params.id);
  if (!todo) {
    res.status(400).send({
      status: false,
      message: "Todo not found",
    });
    return;
  }

  const filteredTodo = todos.filter((todo) => todo.id != req.params.id);
  todos = filteredTodo;
  console.log(todos);
  res.status(204).send();
});

app.put("/todos/:id", ...createTodoSchema, (req, res) => {
  console.log("Received PUT request with ID:", req.params.id);
  const result = validationResult(req);

  if (!result.isEmpty()) {
    res.status(400).send({
      status: false,
      errors: result.errors,
    });
    return;
  }

  const todoIndex = todos.findIndex((todo) => todo.id == req.params.id);

  if (todoIndex === -1) {
    res.status(404).send({
      status: false,
      message: "Todo not found",
    });
    return;
  }

  todos[todoIndex] = { ...todos[todoIndex], ...req.body };

  res.status(200).send({
    message: "Todo Updated",
    status: true,
    data: todos[todoIndex],
  });
});

app.listen(PORT, () => console.log("Listening at port 8080"));
