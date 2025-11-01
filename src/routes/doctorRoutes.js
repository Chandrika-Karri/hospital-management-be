import express from 'express'
import { registerDoctor } from '../controllers/doctorController.js'
import Doctor from '../models/doctor.js'

const router = express.Router()

router.post("/register", registerDoctor)

router.get("/",  async (req, res) => {
  try {
    const doctors = await Doctor.find()
    res.json(doctors)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

router.get("/:id/slots", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const date = req.query.date || new Date().toISOString().split("T")[0];

    // Work start/end converted to Date objects for that specific day
    const start = new Date(`${date}T${doctor.workStart}:00`);
    const end = new Date(`${date}T${doctor.workEnd}:00`);

    const slots = [];
    const step = 30; // 30 minutes per slot

    for (let time = new Date(start); time < end; time.setMinutes(time.getMinutes() + step)) {
      const timeStr = time.toTimeString().slice(0, 5); // e.g. "09:00"

      // Check if this specific time is already booked for this date
      const isBooked = doctor.appointments?.some((a) => {
        const appDate = new Date(a.time).toISOString().split("T")[0];
        const appTime = new Date(a.time).toTimeString().slice(0, 5);
        return appDate === date && appTime === timeStr && a.isBooked;
      });
      slots.push({ time: timeStr, isBooked });
    }

    res.json(slots);

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
});

export default router
