// models/Doctor.js
const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: String,
  workingHours: {
    start: { type: String, required: true }, // e.g., "09:00"
    end: { type: String, required: true }    // e.g., "18:00"
  },
  appointments: [
    {
      time: { type: Date, required: true },
      isBooked: { type: Boolean, default: false }
    }
  ]
});


module.exports = mongoose.model("Doctor", doctorSchema);
