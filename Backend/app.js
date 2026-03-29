import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import predRouter from "./routes/prediction.routes.js";
import pdfRouter from "./routes/pdf.routes.js"; 
import historyRouter from "./routes/history.routes.js"; 
import aiRouter from "./routes/ai.routes.js"; // 1. IMPORT THE AI ROUTER

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/predict", predRouter);
app.use("/api/pdf", pdfRouter); 
app.use("/api/v1/history", historyRouter); 
app.use("/api/v1/ai", aiRouter); // 2. REGISTER THE AI ROUTE

export { app };