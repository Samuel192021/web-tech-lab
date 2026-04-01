function App() {

  const name = "Samuel";
  const department = "CSE";
  const year = "2nd Year";
  const section = "A";

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      
      <h1>Student Profile</h1>

      <div style={{
        border: "2px solid black",
        padding: "20px",
        width: "300px",
        margin: "auto",
        borderRadius: "10px",
        backgroundColor: "#f5f5f5"
      }}>
        <p><b>Name:</b> {name}</p>
        <p><b>Department:</b> {department}</p>
        <p><b>Year:</b> {year}</p>
        <p><b>Section:</b> {section}</p>
      </div>

    </div>
  );
}

export default App;