const express = require("express");
const router = express.Router();
const upload = require("../middleware/Upload");
const { registerUser, loginUser } = require("../controllers/AuthController");
const {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
  candidatetoEmployee,
  updateEmployee,
  updateCandidateStatus,
  updateAttendenceStatus,
  attendence,
  getAttendence,
  attendanceUpdate,
  getMyAllEmployee,

  getAllEmployee,
} = require("../controllers/CandidateController");
const protectRoute = require("../middleware/AuthMiddleware"); // Import the protectRoute middleware

// Register route
router.post("/register", registerUser);
router.get("/protected", protectRoute, (req, res) => {
  res.send({ message: "This is a protected route", user: req.user });
});

// Login route
router.post("/login", loginUser);

// Candidate routes
router.post(
  "/createCandidate",
  upload.single("resume"),

  protectRoute,
  createCandidate
);

router.get("/getAllCandidates", protectRoute, getAllCandidates);
router.get("/getCandidateById/:id", protectRoute, getCandidateById);
router.put("/updateCandidate/:id", protectRoute, updateCandidate);
router.delete("/:id", protectRoute, deleteCandidate);
router.post("/candidatetoemployee/:id", protectRoute, candidatetoEmployee);
router.get("/getAllEmployee", getAllEmployee);
router.put("/updateemployee/:id", protectRoute, updateEmployee);

router.delete("/deleteCandidate/:id", deleteCandidate);
router.patch("/updateCandidateStatus/:id", protectRoute, updateCandidateStatus);
router.patch("/updateAttendanceStatus/:id", updateAttendenceStatus);
router.get("/getMyAllEmployee", getMyAllEmployee);

router.patch("/attendence/:id", attendence);
router.get("/getAttendence", getAttendence);
router.post("/attendance/update", attendanceUpdate);

module.exports = router;
