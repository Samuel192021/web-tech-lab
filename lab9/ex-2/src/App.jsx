import StudentCard from "./StudentCard";

function App() {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Student Cards</h1>

      <div style={{
        display: "flex",
        justifyContent: "center"
      }}>
        <StudentCard name="Samuel" department="CSE" marks="85" />
        <StudentCard name="Rahul" department="ECE" marks="90" />
        <StudentCard name="Anu" department="IT" marks="88" />
      </div>
    </div>
  );
}

export default App;