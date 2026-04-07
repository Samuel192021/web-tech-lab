const express = require("express");

const app = express();
app.use(express.json());

// ROOT ROUTE (FIX)
app.get("/", (req, res) => {
  res.send("Welcome to REST API");
});

let users = [
  { id: 1, name: "Samuel" },
  { id: 2, name: "Rahul" }
];

// GET all users
app.get("/users", (req, res) => {
  res.json(users);
});

// GET single user
app.get("/users/:id", (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  res.json(user);
});

// POST
app.post("/users", (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name
  };
  users.push(newUser);
  res.json(newUser);
});

// PUT
app.put("/users/:id", (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  user.name = req.body.name;
  res.json(user);
});

// DELETE
app.delete("/users/:id", (req, res) => {
  users = users.filter(u => u.id != req.params.id);
  res.send("User deleted");
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});