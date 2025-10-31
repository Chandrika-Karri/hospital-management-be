const express = require("express");
const Doctor = require("../models/doctor");
const router = express.Router();

router.post("/add", async (req, res) => {
  const doctor = new Doctor(req.body);
  await doctor.save();
  res.json({ message: "Doctor added!" });
});

// routes/doctorRoutes.js
router.get("/:id/slots", async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });

  const slots = [];
  const [startHour, startMin] = doctor.workingHours.start.split(":").map(Number);
  const [endHour, endMin] = doctor.workingHours.end.split(":").map(Number);

  const slotDuration = 30; // 30 minutes per slot
  let current = new Date();
  current.setHours(startHour, startMin, 0, 0);

  const end = new Date();
  end.setHours(endHour, endMin, 0, 0);

  while (current < end) {
    const isBooked = doctor.appointments.some(
      appt => appt.time.getTime() === current.getTime() && appt.isBooked
    );

    slots.push({
      time: new Date(current), 
      isBooked
    });

    current.setMinutes(current.getMinutes() + slotDuration);
  }

  res.json(slots);
});


module.exports = router;
