const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const employeesData = require("./data/employees.json"); // replace with your own data file
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/employees", (req, res) => {
  res.json(employeesData);
});

app.post("/employees", (req, res) => {
  const newEmployee = req.body;
  employeesData.push(newEmployee);
  res.status(201).json(newEmployee);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
