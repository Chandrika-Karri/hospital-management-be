const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: String,
  doctor: String,
  timeSlot: String,
  description: String,
  emergency: Boolean
});

module.exports = mongoose.model("Patient", patientSchema);
