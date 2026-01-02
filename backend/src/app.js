//all my routes are here, I didnt use a seperate routes folder or file. as I will work on it later.

import express from "express";
import cors from "cors";
import {
  getAllUsers,
  createUser,
  updateUser,
  getUser,
  deleteUser,
  getProfile,
  updateProfile,
} from "./controllers/userController.js";
import { getAllRoles } from "./controllers/roleController.js";
import {
  getAllVolunteers,
  getVolunteer,
  createVolunteer,
  updateVolunteer,
  getVolunteerVolunteering,
  getVolunteerTasks,
  getVolunteerCertificates,
  createCertificate,
} from "./controllers/volunteerController.js";
import {
  getAllTeams,
  createTeam,
  updateTeam,
  getTeam,
  getTeamVolunteering,
  getTeamTasks,
} from "./controllers/teamController.js";
import {
  getAllTeamVolunteers,
  getTeamVolunteer,
  createTeamVolunteer,
  getTeamVolunteerTasks,
  updateTeamVolunteer,
  endVolunteering,
  getTask,
  createTask,
} from "./controllers/teamVolunteerController.js";

import {
  getAllTasks,
  completeTask,
  updateTask,
  deleteTask,
} from "./controllers/taskController.js";
import {
  getAllCertificates,
  updateCertificate,
  getCertificate,
  getCertificatePdf,
  sendCertificateByEmail,
  getCertificatePreview,
} from "./controllers/certificateController.js";
import {
  login,
  verifyOTP,
  validateToken,
} from "./controllers/authController.js";
import { authenticateToken } from "./middleware/auth.js";
import { getDashboardStats } from "./controllers/dashboardController.js";
const app = express();
app.use(
  cors({
    origin: "https://remarkable-monstera-21ca08.netlify.app",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
app.use(express.json());

app.get("/dashboard", authenticateToken, getDashboardStats);
app.post("/auth/login", login);
app.post("/auth/verify-otp", verifyOTP);
app.get("/auth/validate-token", authenticateToken, validateToken);
app.delete("/users/:userId", deleteUser);
app.patch("/users/:userId/", updateUser);
app.get("/users/:userId", authenticateToken, getUser);
app.get("/users", authenticateToken, getAllUsers);
app.post("/users", authenticateToken, createUser);
app.get("/roles", getAllRoles);

app.patch("/certificates/:certificateId", authenticateToken, updateCertificate);
app.post(
  "/certificates/:certificateId/send",
  authenticateToken,
  sendCertificateByEmail
);
app.get(
  "/certificates/:certificateId/pdf",
  authenticateToken,
  getCertificatePdf
);
app.get("/certificates/:certificateId", authenticateToken, getCertificate);
app.get("/certificates", authenticateToken, getAllCertificates);
app.get(
  "/certificates/:certificateId/preview",
  authenticateToken,
  getCertificatePreview
);
// app.post("/volunteers/:volunteerId/certificates/:certificateId/send", sendCertificate)
app.get(
  "/volunteers/:volunteerId/certificates",
  authenticateToken,
  getVolunteerCertificates
);

app.patch("/volunteers/:volunteerId", authenticateToken, updateVolunteer);
// app.get("/volunteers/:volunteerId/teams", getVolunteerTasks);
app.post(
  "/volunteers/:volunteerId/certificates",
  authenticateToken,
  createCertificate
);
app.get("/volunteers/:volunteerId/tasks", authenticateToken, getVolunteerTasks);
app.get(
  "/volunteers/:volunteerId/volunteering",
  authenticateToken,
  getVolunteerVolunteering
);
app.get("/volunteers/:volunteerId", authenticateToken, getVolunteer);
app.get("/volunteers", authenticateToken, getAllVolunteers);
app.post("/volunteers", authenticateToken, createVolunteer);

app.patch("/teams/:teamId", authenticateToken, updateTeam);
app.get("/teams/:teamId/tasks", authenticateToken, getTeamTasks);
app.get("/teams/:teamId/volunteering", authenticateToken, getTeamVolunteering);
app.get("/teams/:teamId", authenticateToken, getTeam);
app.get("/teams", authenticateToken, getAllTeams);
app.post("/teams", createTeam);

app.get("/tasks/:taskId", authenticateToken, getTask);

// app.delete("/volunteering/:teamVolunteerId/tasks/:taskId", deleteTask);

app.patch(
  "/volunteering/:teamVolunteerId/end",
  authenticateToken,
  endVolunteering
);
app.get(
  "/volunteering/:teamVolunteerId/tasks",
  authenticateToken,
  getTeamVolunteerTasks
);
app.post("/volunteering/:teamVolunteerId/tasks", authenticateToken, createTask);
app.patch(
  "/volunteering/:teamVolunteerId",
  authenticateToken,
  updateTeamVolunteer
);
app.get("/volunteering/:teamVolunteerId", authenticateToken, getTeamVolunteer);
app.get("/volunteering", authenticateToken, getAllTeamVolunteers);
app.post("/volunteering", authenticateToken, createTeamVolunteer);
// app.patch("/tasks/:taskId/update", updateTask);
app.get("/profile", authenticateToken, getProfile);
app.patch("/profile", authenticateToken, updateProfile);

app.get("/tasks", authenticateToken, getAllTasks);

app.patch("/tasks/:taskId", authenticateToken, updateTask);
app.patch("/tasks/:taskId/complete", authenticateToken, completeTask);

app.listen(5000, () => {
  console.log("Connected to backend.");
});
