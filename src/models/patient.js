import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  description: { type: String },
  emergency: { type: Boolean, default: false },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, default: "Pending" } // e.g., Pending, Confirmed, Cancelled
});

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
