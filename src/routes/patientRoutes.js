import express from "express";
import Patient from "../models/patient.js";
import Doctor from "../models/doctor.js";

const router = express.Router();

// Get appointment by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const patient = await Patient.findById(id).populate("doctorId");
  if (!patient) return res.status(404).json({ message: "Appointment not found" });
  res.json(patient);
});

// Confirm appointment
router.put("/:id/confirm", async (req, res) => {
  const { id } = req.params;
  const patient = await Patient.findByIdAndUpdate(id, { status: "Confirmed" }, { new: true });
  res.json(patient);
});

// Cancel appointment (delete patient & free doctor slot)
router.delete("/cancel/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const patient = await Patient.findById(id);
    if (!patient) return res.status(404).json({ message: "Appointment not found" });

    // 1️⃣ Free up the doctor's slot
    await Doctor.updateOne(
      { _id: patient.doctorId, "appointments.time": new Date(`${patient.date}T${patient.time}:00`) },
      { $set: { "appointments.$.isBooked": false } }
    );

    // 2️⃣ Delete the patient record
    await Patient.findByIdAndDelete(id);

    res.json({ message: "Appointment cancelled successfully" });
  } catch (err) {
    console.error("Error cancelling appointment:", err);
    res.status(500).json({ message: "Failed to cancel appointment" });
  }
});


// Change time
router.put("/:id/change-time", async (req, res) => {
  const { id } = req.params;
  const { newDate, newTime } = req.body;

  const patient = await Patient.findById(id);
  if (!patient) return res.status(404).json({ message: "Appointment not found" });

  // Check if new slot is free
  const doctor = await Doctor.findById(patient.doctorId);
  const slotTaken = doctor.appointments?.some(a => 
    new Date(a.time).toISOString() === new Date(`${newDate}T${newTime}:00`).toISOString()
  );

  if (slotTaken) return res.status(400).json({ message: "This time slot is already booked" });

  // Remove old slot
  await Doctor.updateOne(
    { _id: doctor._id },
    { $pull: { appointments: { time: new Date(`${patient.date}T${patient.time}:00`) } } }
  );

  // Add new slot
  await Doctor.updateOne(
    { _id: doctor._id },
    { $push: { appointments: { time: new Date(`${newDate}T${newTime}:00`), isBooked: true } } }
  );

  // Update patient record
  patient.date = newDate;
  patient.time = newTime;
  await patient.save();

  res.json(patient);
});

// ✅ POST: Book appointment
router.post("/book", async (req, res) => {
  try {
    const { name, doctorId, description, emergency, time, date } = req.body;

    const existingAppointment = await Doctor.findOne({
      _id: doctorId,
      "appointments.time": new Date(`${date}T${time}:00`),
    });

    if (existingAppointment) {
      return res
        .status(400)
        .json({ message: "This time slot is already booked." });
    }

    // 1️⃣ Save new patient appointment
    const patient = await Patient.create({
      name,
      doctorId,
      description,
      emergency,
      date,
      time
    });

    // 2️⃣ Mark doctor’s appointment as booked
    const appointmentTime = new Date(`${date}T${time}:00`);

    await Doctor.findByIdAndUpdate(
      doctorId,
      { $push: { appointments: { time: appointmentTime, isBooked: true } } },
      { new: true }
    );

    res.json(patient);
  } catch (err) {
    console.error("Error booking appointment:", err);
    res.status(500).json({ message: "Error booking appointment" });
  }
});

export default router;
