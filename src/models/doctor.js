import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  experience: { type: Number },

  // Doctor working hours (used to generate available time slots)
  workStart: { type: String, required: true }, // e.g. "09:00"
  workEnd: { type: String, required: true },   // e.g. "17:00"

  // Appointment slots
  appointments: [
    {
      time: { type: Date },
      isBooked: { type: Boolean, default: false },
    },
  ],
});

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
