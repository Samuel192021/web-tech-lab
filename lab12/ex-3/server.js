const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// ✅ CONNECT TO MONGODB
mongoose.connect("mongodb://127.0.0.1:27017/testdb")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


// ✅ ROOT ROUTE (to fix "Cannot GET /")
app.get("/", (req, res) => {
  res.send("MongoDB API Running");
});


// ✅ SCHEMA
const userSchema = new mongoose.Schema({
  name: String,
  age: Number
});

// ✅ MODEL
const User = mongoose.model("User", userSchema);


// ✅ CREATE (POST)
app.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ READ ALL (GET)
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ READ ONE (GET)
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ UPDATE (PUT)
app.put("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ DELETE
app.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.send("User deleted");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ START SERVER
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});