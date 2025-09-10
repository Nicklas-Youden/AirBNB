import express from "express";
import airBnbDestinationsRoutes from "./api/routes/airBnbDestinationsRoutes";

const app = express();
app.use(express.json());
app.use("/api", airBnbDestinationsRoutes);

export default app;
