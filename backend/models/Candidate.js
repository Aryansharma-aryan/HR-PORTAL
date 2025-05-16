const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  position: { type: String, required: true },
  resume: { type: String }, // Store filename or path
  status: {
    type: String,
    enum: ["new", "interviewed", "selected", "rejected"],
    default: "new"
  }
}, { timestamps: true });

module.exports = mongoose.model("Candidate", candidateSchema);
