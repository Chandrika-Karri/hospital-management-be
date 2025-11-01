import Doctor from "../models/doctor.js";

export const registerDoctor = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { name, specialization, email, phone, experience, availableFrom, availableTo } = req.body;

    const newDoctor = new Doctor({
      name,
      specialization,
      email,
      phone,
      experience,
      workStart: availableFrom,
      workEnd: availableTo
    });

    const savedDoctor = await newDoctor.save();
    console.log("Saved doctor:", savedDoctor);
    res.status(201).json(savedDoctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


