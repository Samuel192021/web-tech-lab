let students = [];
let editIndex = null;

const form = document.getElementById("studentForm");
const table = document.getElementById("studentTable");
const modal = document.getElementById("editModal");
const toast = document.getElementById("toast");

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const student = {
        id: studentId.value,
        name: name.value,
        department: department.value,
        marks: marks.value
    };

    fakeServerRequest("CREATE", student)
        .then(response => {
            students.push(student);
            renderTable();
            showToast("Student Added (200 OK)", "green");
            form.reset();
        })
        .catch(err => showToast(err.message, "red"));
});

function renderTable() {
    table.innerHTML = "";
    students.forEach((s, index) => {
        table.innerHTML += `
            <tr>
                <td>${s.id}</td>
                <td>${s.name}</td>
                <td>${s.department}</td>
                <td>${s.marks}</td>
                <td>
                    <button onclick="openEdit(${index})">Edit</button>
                    <button onclick="deleteStudent(${index})">Delete</button>
                </td>
            </tr>
        `;
    });
}

function openEdit(index) {
    editIndex = index;
    editName.value = students[index].name;
    editDepartment.value = students[index].department;
    editMarks.value = students[index].marks;
    modal.style.display = "flex";
}

function closeModal() {
    modal.style.display = "none";
}

updateBtn.addEventListener("click", function() {
    const updatedStudent = {
        ...students[editIndex],
        name: editName.value,
        department: editDepartment.value,
        marks: editMarks.value
    };

    fakeServerRequest("UPDATE", updatedStudent)
        .then(() => {
            students[editIndex] = updatedStudent;
            renderTable();
            closeModal();
            showToast("Student Updated (200 OK)", "green");
        })
        .catch(err => showToast(err.message, "red"));
});

function deleteStudent(index) {
    fakeServerRequest("DELETE")
        .then(() => {
            students.splice(index, 1);
            renderTable();
            showToast("Student Deleted (200 OK)", "green");
        })
        .catch(err => showToast(err.message, "red"));
}

/* Simulated AJAX Server */
function fakeServerRequest(type, data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < 0.9) {
                resolve({ status: 200, data });
            } else {
                reject({ status: 500, message: "500 Internal Server Error" });
            }
        }, 800);
    });
}

function showToast(message, color) {
    toast.style.display = "block";
    toast.style.background = color;
    toast.textContent = message;
    setTimeout(() => {
        toast.style.display = "none";
    }, 3000);
}
