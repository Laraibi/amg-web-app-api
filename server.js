const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const employeesDataPath = path.join(__dirname, "data", "employees.json");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// READ all employees
app.get("/employees", (req, res) => {
  const employeesData = getEmployeesData();
  res.json(employeesData);
});

// READ one employee by matricule
app.get("/employees/:matricule", (req, res) => {
  const matricule = req.params.matricule;
  const employeesData = getEmployeesData();
  const employee = employeesData.find((e) => e.matricule === matricule);
  if (employee) {
    res.json(employee);
  } else {
    res.status(404).send("Employee not found");
  }
});

// CREATE a new employee
app.post("/employees", (req, res) => {
  const employeesData = getEmployeesData();
  const newEmployee = req.body;
  employeesData.push(newEmployee);
  saveEmployeesData(employeesData);
  res.status(201).json(newEmployee);
});

// UPDATE an existing employee
app.put("/employees/:matricule", (req, res) => {
  const matricule = req.params.matricule;
  const employeesData = getEmployeesData();
  const employeeIndex = employeesData.findIndex((e) => e.matricule === matricule);
  if (employeeIndex >= 0) {
    const updatedEmployee = { ...employeesData[employeeIndex], ...req.body };
    employeesData[employeeIndex] = updatedEmployee;
    saveEmployeesData(employeesData);
    res.json(updatedEmployee);
  } else {
    res.status(404).send("Employee not found");
  }
});

// DELETE an employee
app.delete("/employees/:matricule", (req, res) => {
  const matricule = req.params.matricule;
  const employeesData = getEmployeesData();
  const employeeIndex = employeesData.findIndex((e) => e.matricule === matricule);
  if (employeeIndex >= 0) {
    employeesData.splice(employeeIndex, 1);
    saveEmployeesData(employeesData);
    res.sendStatus(204);
  } else {
    res.status(404).send("Employee not found");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function getEmployeesData() {
  const employeesDataJson = fs.readFileSync(employeesDataPath);
  const employeesData = JSON.parse(employeesDataJson);
  return employeesData;
}

function saveEmployeesData(employeesData) {
  const employeesDataJson = JSON.stringify(employeesData, null, 2);
  fs.writeFileSync(employeesDataPath, employeesDataJson);
  // Update the file date of the JSON file
  fs.utimesSync(employeesDataPath, new Date(), new Date());
}
