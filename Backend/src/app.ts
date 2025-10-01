import express from "express";
import path from "path";
import airBnbDestinationsRoutes from "./api/routes/airBnbDestinationsRoutes";
import userRoutes from "./api/routes/userRoutes";
import bookingRoutes from "./api/routes/bookingRoutes";

const app = express();
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api/destinations", airBnbDestinationsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/booking", bookingRoutes);

export default app;
