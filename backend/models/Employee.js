const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  position: { type: String, required: true },
  resume: { type: String },
  dateOfJoining: { type: Date, default: Date.now },
 attendanceStatus: {
  type: String,
  enum: ["present", "absent"], // all lowercase
  default: "absent",
},

  isCurrent: {
  type: Boolean,
  default: true
}

  
});

module.exports = mongoose.model("Employee", employeeSchema);