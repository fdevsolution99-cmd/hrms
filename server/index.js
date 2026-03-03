import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

import connectToDatabase from "./db/db.js";

// Routes
import authRouter from "./routes/auth.js";
import departmentRouter from "./routes/department.js";
import employeeRouter from "./routes/employee.js";
import salaryRouter from "./routes/salary.js";
import leaveRouter from "./routes/leave.js";
import settingRouter from "./routes/setting.js";
import attendanceRouter from "./routes/attendance.js";
import dashboardRouter from "./routes/dashboard.js";
import announcementRouter from "./routes/announcementRoutes.js";
import payrollTemplateRouter from "./routes/payrollTemplate.js";
import payslipRouter from "./routes/payslip.js";
import birthdayRouter from "./routes/birthdayRoutes.js";
import notificationRouter from "./routes/notification.js";
import feedbackRouter from "./routes/feedback.js";

import { initializeBirthdayScheduler } from "./services/birthdayScheduler.js";

dotenv.config();

// Connect database
connectToDatabase();

const app = express();
const httpServer = createServer(app);

/* --------------------------------------------------
   CORS CONFIGURATION
-------------------------------------------------- */

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "https://hrms-nine-opal.vercel.app"
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);

/* --------------------------------------------------
   MIDDLEWARE
-------------------------------------------------- */

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* --------------------------------------------------
   STATIC FILES
-------------------------------------------------- */

const __dirname = path.resolve();

app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

/* --------------------------------------------------
   SOCKET.IO
-------------------------------------------------- */

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

app.set("io", io);

app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join", (userId) => {
    if (!userId) return;

    const room = `user_${userId}`;
    socket.join(room);

    console.log(`User joined room: ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

/* --------------------------------------------------
   HEALTH CHECK
-------------------------------------------------- */

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server running"
  });
});

/* --------------------------------------------------
   API ROUTES
-------------------------------------------------- */

app.use("/api/auth", authRouter);
app.use("/api/department", departmentRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/salary", salaryRouter);
app.use("/api/leave", leaveRouter);
app.use("/api/setting", settingRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/announcement", announcementRouter);
app.use("/api/payroll-template", payrollTemplateRouter);
app.use("/api/payslip", payslipRouter);
app.use("/api/birthdays", birthdayRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/feedback", feedbackRouter);

/* --------------------------------------------------
   SERVER START
-------------------------------------------------- */

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // start scheduler
  initializeBirthdayScheduler();
});