const StudentCard = (props) => {
  return (
    <div style={{
      border: "2px solid black",
      padding: "15px",
      margin: "10px",
      borderRadius: "10px",
      width: "200px",
      backgroundColor: "#f0f0f0"
    }}>
      <h3>{props.name}</h3>
      <p>Department: {props.department}</p>
      <p>Marks: {props.marks}</p>
    </div>
  );
};

export default StudentCard;