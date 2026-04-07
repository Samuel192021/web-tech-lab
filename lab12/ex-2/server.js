const express = require("express");

const app = express();

// GLOBAL MIDDLEWARE
app.use((req, res, next) => {
  console.log("Time:", new Date().toISOString());
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  next();
});

// ROUTE MIDDLEWARE
const checkUser = (req, res, next) => {
  console.log("Checking user...");
  next();
};

// ROUTES
app.get("/", (req, res) => {
  res.send("Home Page");
});

app.get("/about", checkUser, (req, res) => {
  res.send("About Page");
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});