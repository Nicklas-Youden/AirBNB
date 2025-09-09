import express from "express";
import connectDB from "./config/connection";
// import router from "./api/controllers/routes";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

connectDB();

// // Set up routes
// app.use("/api", router());

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
