import { useState } from "react";
import "./index.css";

function App() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");

  const addItem = () => {
    if (input === "") return;

    setItems([...items, input]);
    setInput("");
  };

  const removeItem = (index) => {
    const newList = items.filter((_, i) => i !== index);
    setItems(newList);
  };

  return (
    <div className="container">
      <h1>Dynamic List</h1>

      <input
        type="text"
        placeholder="Enter item"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button onClick={addItem}>Add</button>

      {items.length === 0 ? (
        <p>No items</p>
      ) : (
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              {item}
              <button onClick={() => removeItem(index)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;