import express from "express";
import path from "path";
import airBnbDestinationsRoutes from "./api/routes/airBnbDestinationsRoutes";
import userRoutes from "./api/routes/userRoutes";

const app = express();
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api/destinations", airBnbDestinationsRoutes);
app.use("/api/users", userRoutes);

export default app;
