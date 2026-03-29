// require('dotenv').config({path:'./env'})

import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import os from "os";
import path from "path";
import express from "express";

dotenv.config({ path: "./env" });

// --- ADD THESE TWO LINES HERE TO FIX THE "FALSE RESULTS" ---
app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ limit: "50mb", extended: true }));
// -----------------------------------------------------------

const _dirname = path.dirname("");
const frontendBP = path.join(_dirname, "../Frontend/dist");
app.use(express.static(frontendBP));

// Function to get the local IP address
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "http://localhost/"; 
}

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERROR: ", error);
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
      const ip = getLocalIpAddress();
      console.log(`Server running at http://${ip}:${process.env.PORT}/`);
    });
  })
  .catch((err) => {
    console.log("MONGODB connection failed !!!", err);
  });