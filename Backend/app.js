import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import predRouter from "./routes/prediction.routes.js";
import pdfRouter from "./routes/pdf.routes.js"; // Import pdfRoutes

const app = express();

// THIS IS THE FINAL CORRECTED CORS CONFIGURATION
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // This will read http://localhost:5173 from your .env file
    credentials: true,
  })
);

// Configurations for different types of data acceptance
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/predict", predRouter);
app.use("/api/pdf", pdfRouter); // Add this line to include the new PDF routes

export { app };
