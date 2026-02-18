let students = [];

async function loadStudents() {
    try {
        const response = await fetch("students.json");

        if (!response.ok)
            throw new Error("Failed to load JSON (Status " + response.status + ")");

        const data = await response.json();
        students = data.students || [];
        renderStudents();
    } catch (error) {
        showToast("JSON Error: " + error.message, "red");
    }
}

function renderStudents(filter = "") {
    const table = document.getElementById("studentTable");
    table.innerHTML = "";

    let total = 0;
    let sum = 0;
    let top = 0;

    students.forEach((student, index) => {
        if (!student.name.toLowerCase().includes(filter.toLowerCase())) return;

        total++;
        sum += parseInt(student.marks);
        if (student.marks > top) top = student.marks;

        const grade = getGrade(student.marks);

        table.innerHTML += `
        <tr>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.course}</td>
            <td>${student.marks}</td>
            <td>${grade}</td>
            <td>
                <button onclick="editStudent(${index})">Edit</button>
                <button onclick="deleteStudent(${index})">Delete</button>
            </td>
        </tr>`;
    });

    document.getElementById("totalStudents").textContent = total;
    document.getElementById("avgMarks").textContent =
        total ? (sum / total).toFixed(2) : 0;
    document.getElementById("topScore").textContent = top;
}

function getGrade(marks) {
    if (marks >= 90) return "A+";
    if (marks >= 75) return "A";
    if (marks >= 60) return "B";
    return "C";
}

document.getElementById("studentForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const id = studentId.value.trim();
    const nameVal = name.value.trim();
    const courseVal = course.value.trim();
    const marksVal = parseInt(marks.value);

    if (!id || !nameVal || !courseVal || isNaN(marksVal)) {
        showToast("All fields required!", "red");
        return;
    }

    students.push({ id, name: nameVal, course: courseVal, marks: marksVal });
    renderStudents();
    this.reset();
    showToast("Student Added!", "green");
});

function editStudent(index) {
    const newMarks = prompt("Enter new marks:");
    if (newMarks && !isNaN(newMarks)) {
        students[index].marks = parseInt(newMarks);
        renderStudents();
        showToast("Student Updated!", "green");
    }
}

function deleteStudent(index) {
    students.splice(index, 1);
    renderStudents();
    showToast("Student Deleted!", "green");
}

document.getElementById("searchBox").addEventListener("input", function() {
    renderStudents(this.value);
});

function showToast(msg, color) {
    const toast = document.getElementById("toast");
    toast.style.display = "block";
    toast.style.background = color;
    toast.textContent = msg;
    setTimeout(() => toast.style.display = "none", 3000);
}

loadStudents();
