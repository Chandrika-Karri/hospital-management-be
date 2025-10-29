const express = require("express");
const Patient = require("../models/patient");
const router = express.Router();

router.post("/book", async (req, res) => {
  const patient = new Patient(req.body);
  await patient.save();
  res.json({ message: "Appointment booked!" });
});

module.exports = router;
