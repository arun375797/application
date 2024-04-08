const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require("./models/User");
const Employee = require("./models/Employee");

const jwt = require("jsonwebtoken");
const path = require("path");
const app = express();
app.use(express.json());
app.use(cors());


const path = require('path'); 


mongoose
  .connect(
    "mongodb+srv://arun:life@cluster0.acjyovk.mongodb.net/empreact?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


  app.use(express.static(path.join(__dirname,'/build'))); 
  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname,'/build/index.html')); }); 




// posting user details
app.post("/api/signup", async (req, res) => {
  try {
    const user = await UserModel.create(req.body);
    res.json(user);
  } catch (err) {
    console.error("Error occurred while signing up:", err);
    res.status(400).json(err);
  }
});

//login verification
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username: username });
    if (user) {
      if (user.password === password) {
        res.json("success");
      } else {
        res.json("The password is incorrect");
      }
    } else {
      res.json("User is not registered");
    }
  } catch (err) {
    console.error("Error occurred while logging in:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Admin signup
app.post("/api/admin/signup", async (req, res) => {
  try {
    
    const user = await UserModel.create({ ...req.body, role: "admin" });
    res.json(user);
  } catch (err) {
    console.error("Error occurred while signing up:", err);
    res.status(400).json(err);
  }
});

// Admin login
app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await UserModel.findOne({ username, role: "admin" });
    if (admin) {
      if (admin.password === password) {
        const payload = { adminId: admin._id };
        const token = jwt.sign(payload, "reactblogapp");
        res.json({ message: "Login successful", token });
      } else {
        res.status(401).json({ message: "Invalid username or password" });
      }
    } else {
      res.status(404).json({ message: "User is not registered" });
    }
  } catch (err) {
    console.error("Error occurred while logging in:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//employee data saving
app.post("/api/employees", async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.json(employee);
  } catch (error) {
    console.error("Error occurred while saving employee:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//display the data
app.get("/api/employees", async (req, res) => {
  try {
    // Fetch all employees from the database
    const employees = await Employee.find();
    // Send the employees data as response
    res.json(employees);
  } catch (error) {
    console.error("Error while fetching employees:", error);
    // Send error response if there's an error
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//crud
app.put("/api/employees/:id", async (req, res) => {
  try {
    const { id } = req.params; // Extract id from URL parameters
    const { name, designation, location, salary } = req.body; // Extract data from request body

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { name, designation, location, salary },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json(updatedEmployee);
  } catch (error) {
    console.error("Error while updating employee:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a specific employee by ID
app.delete("/api/employees/:id", async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error while deleting employee:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Get employee data by ID
app.get("/api/employees/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    console.error("Error while fetching employee by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
