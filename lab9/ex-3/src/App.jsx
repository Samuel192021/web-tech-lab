import { useState } from "react";
import "./index.css";

function App() {

  const [count, setCount] = useState(0);

  return (
    <div className="container">
      
      <h1>Counter App</h1>

      <div className="card">
        <h2>{count}</h2>

        <button onClick={() => setCount(count + 1)}>
          Increment
        </button>

        <button onClick={() => setCount(count - 1)}>
          Decrement
        </button>
      </div>

    </div>
  );
}

export default App;