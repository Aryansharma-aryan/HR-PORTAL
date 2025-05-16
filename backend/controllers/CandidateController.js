const Candidate = require("../models/Candidate");
const Employee = require("../models/Employee");
//create candidate
const createCandidate = async (req, res) => {
  try {
    // Validate incoming data
    const { name, email, phone, position } = req.body;
    if (!name || !email || !phone || !position) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if the email already exists in the database
    const existingCandidate = await Candidate.findOne({ email });
    if (existingCandidate) {
      return res
        .status(400)
        .json({ message: "Candidate with this email already exists." });
    }

    // Handle file upload if resume is provided
    const resume = req.file ? req.file.path : null;

    // Create new candidate
    const candidate = new Candidate({
      name,
      email,
      phone,
      position,
      resume,
    });

    // Save candidate to the database
    await candidate.save();

    // Respond with success
    res.status(201).json({ message: "Candidate created successfully" });
  } catch (error) {
    // Respond with error if something goes wrong
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

//get all candidate
const getAllCandidates = async (req, res) => {
  try {
    const candidate = await Candidate.find();
    res.status(200).json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//get candidate by id
const getCandidateById = async (req, res) => {
  try {
    const id = req.params.id;
    const candidate = await Candidate.findById(id);
    res.status(200).json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//update candidate
const updateCandidate = async (req, res) => {
  try {
    const id = req.params.id;
    const candidate = await Employee.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(candidate);
    res.json({ message: "candidate updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//delete candidate
const deleteCandidate = async (req, res) => {
  try {
    const deleted = await Candidate.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    res.status(200).json({ message: "Candidate deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting candidate" });
  }
};

const candidatetoEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // ✅ Check for duplicate employee email
    const existingEmployee = await Employee.findOne({ email: candidate.email });
    if (existingEmployee) {
      return res
        .status(400)
        .json({ message: "Employee with this email already exists" });
    }

    // ✅ Normalize attendanceStatus
    const newEmployee = new Employee({
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      position: candidate.position,
      resume: candidate.resume,
      isCurrent: true,
      attendanceStatus: candidate.attendanceStatus?.toLowerCase() || "absent",
      profilePicture: candidate.profilePicture || "",
      department: candidate.department || "",
      task: "",
    });

    await newEmployee.save();

    candidate.status = "selected";
    await candidate.save();

    res.json({
      message: "Candidate converted to employee",
      employee: newEmployee,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({
          message: "Duplicate entry: Employee with this email already exists",
        });
    }
    res.status(500).json({ message: error.message });
  }
};

//get all employee
const getAllEmployee = async (req, res) => {
  try {
    const employees = await Candidate.find({ status: "selected" });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "Error fetching employees", error: err });
  }
};
//update employee
const updateEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const updateData = req.body;

    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      updateData,
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({
      message: "Employee updated successfully",
      employee: updatedEmployee,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err });
  }
};
const updateCandidateStatus = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!candidate)
      return res.status(404).json({ message: "Candidate not found" });
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const updateAttendenceStatus = async (req, res) => {
  const attendanceUpdates = req.body; // Expecting array of { id, status }

  try {
    for (const { id, status } of attendanceUpdates) {
      await Employee.findByIdAndUpdate(id, { attendanceStatus: status });
    }
    return res.json({ message: "Attendance updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating attendance" });
  }
};
const attendence = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await Employee.findByIdAndUpdate(id, { attendanceStatus: status });
    res.json({ message: "Attendance updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating attendance" });
  }
};
const getAttendence = async (req, res) => {
  try {
    const employees = await Employee.find({});
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Server error fetching employees" });
  }
};
const attendanceUpdate = async (req, res) => {
  const updates = req.body; // array of { id, status }

  try {
    for (const { id, status } of updates) {
      const result = await Employee.findByIdAndUpdate(id, {
        attendanceStatus: status,
      });
      console.log("Updated:", result);
    }
    res.json({ message: "Attendance updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating attendance" });
  }
};
const getMyAllEmployee = async () => {
  try {
    const employees = await Employee.find(
      {},
      "name email phone position attendanceStatus"
    ); // include attendanceStatus
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};
module.exports = {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
  candidatetoEmployee,
  updateEmployee,

  getAllEmployee,
  updateCandidateStatus,
  updateAttendenceStatus,
  attendence,
  getAttendence,
  attendanceUpdate,
  getMyAllEmployee,
};
