import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

// ✅ Global CORS setup
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // frontend ports
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204, // important for preflight
  })
);


// Body parser
app.use(express.json());

// Routes
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);

// Test route
app.get("/", (req, res) => res.send("✅ Backend is running"));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
