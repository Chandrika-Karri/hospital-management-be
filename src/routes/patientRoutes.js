import express from "express";
import Patient from "../models/patient.js";
import Doctor from "../models/doctor.js";

const router = express.Router();

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
