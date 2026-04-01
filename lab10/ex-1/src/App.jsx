import { useState } from "react";
import "./index.css";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (!email.includes("@")) {
      setError("Invalid email format");
      return;
    }

    setError("");
    alert("Form Submitted Successfully");

    // reset
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="container">
      <h1>User Form</h1>

      <form onSubmit={handleSubmit} className="card">
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Submit</button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}

export default App;