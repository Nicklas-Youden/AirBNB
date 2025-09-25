import express from "express";
import path from "path";
import airBnbDestinationsRoutes from "./api/routes/airBnbDestinationsRoutes";

const app = express();
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api", airBnbDestinationsRoutes);

export default app;
