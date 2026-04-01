import { useState, useEffect } from "react";

function App() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((res) => res.json())
      .then((result) => {
        setData(result.slice(0, 6)); // show 6 items
        setLoading(false);
      })
      .catch(() => {
        setError("Error fetching data");
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">

      <h1>API Data</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <div className="grid">
        {data.map((item) => (
          <div className="card" key={item.id}>
            <p>{item.title}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;