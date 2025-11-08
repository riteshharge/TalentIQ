import express from "express";
import path from "path";
import cors from "cors";
import { serve } from "inngest/express"; // ✅ named import
import { clerkMiddleware } from "@clerk/express";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";

import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js";

const app = express();
const __dirname = path.resolve();

// Middleware
app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(clerkMiddleware());

// Inngest
app.use("/api/inngest", serve({ client: inngest, functions }));

// API routes
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

app.get("/health", (req, res) => res.json({ msg: "API is up" }));

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () =>
      console.log(`Server running on port: ${ENV.PORT}`)
    );
  } catch (err) {
    console.error("Error starting server:", err);
  }
};

startServer();
