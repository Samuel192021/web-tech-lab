// Import events module
const EventEmitter = require("events");

// Create object
const eventEmitter = new EventEmitter();

// Listener 1
eventEmitter.on("greet", (name) => {
  console.log("Hello " + name);
});

// Listener 2
eventEmitter.on("greet", (name) => {
  console.log("Welcome " + name);
});

// Emit event
eventEmitter.emit("greet", "Samuel");