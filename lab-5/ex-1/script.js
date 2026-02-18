let xmlDoc;

const table = document.getElementById("employeeTable");
const form = document.getElementById("employeeForm");
const toast = document.getElementById("toast");

function loadEmployees() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "employees.xml", true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            xmlDoc = xhr.responseXML;

            if (!xmlDoc) {
                showToast("Malformed XML Error", "red");
                return;
            }

            displayEmployees();
        } else {
            showToast("Failed to load XML (Status " + xhr.status + ")", "red");
        }
    };

    xhr.onerror = function () {
        showToast("Network Error", "red");
    };

    xhr.send();
}

function displayEmployees() {
    table.innerHTML = "";
    const employees = xmlDoc.getElementsByTagName("employee");

    if (employees.length === 0) {
        showToast("No Employees Found", "orange");
    }

    for (let i = 0; i < employees.length; i++) {
        const id = employees[i].getElementsByTagName("id")[0].textContent;
        const name = employees[i].getElementsByTagName("name")[0].textContent;
        const dept = employees[i].getElementsByTagName("department")[0].textContent;
        const salary = employees[i].getElementsByTagName("salary")[0].textContent;

        table.innerHTML += `
            <tr>
                <td>${id}</td>
                <td>${name}</td>
                <td>${dept}</td>
                <td>${salary}</td>
                <td>
                    <button onclick="updateEmployee(${i})">Update</button>
                    <button onclick="deleteEmployee(${i})">Delete</button>
                </td>
            </tr>
        `;
    }
}

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const id = empId.value.trim();
    const name = empName.value.trim();
    const dept = empDept.value.trim();
    const salary = empSalary.value.trim();

    if (!id || !name || !dept || !salary) {
        showToast("All fields required", "red");
        return;
    }

    const employee = xmlDoc.createElement("employee");

    employee.innerHTML = `
        <id>${id}</id>
        <name>${name}</name>
        <department>${dept}</department>
        <salary>${salary}</salary>
    `;

    xmlDoc.getElementsByTagName("employees")[0].appendChild(employee);

    displayEmployees();
    showToast("Employee Added Successfully", "green");
    form.reset();
});

function updateEmployee(index) {
    const employees = xmlDoc.getElementsByTagName("employee");

    const newDept = prompt("Enter new Department:");
    const newSalary = prompt("Enter new Salary:");

    if (newDept)
        employees[index].getElementsByTagName("department")[0].textContent = newDept;

    if (newSalary)
        employees[index].getElementsByTagName("salary")[0].textContent = newSalary;

    displayEmployees();
    showToast("Employee Updated", "green");
}

function deleteEmployee(index) {
    const employees = xmlDoc.getElementsByTagName("employee");
    employees[index].parentNode.removeChild(employees[index]);

    displayEmployees();
    showToast("Employee Deleted", "green");
}

function showToast(message, color) {
    toast.style.display = "block";
    toast.style.background = color;
    toast.textContent = message;

    setTimeout(() => {
        toast.style.display = "none";
    }, 3000);
}

loadEmployees();
