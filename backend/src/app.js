import express from "express";
import cors from "cors";
import db, { testConnection } from "./config/db.js";
import {
  getAllUsers,
  createUser,
  updateUser,
  getUser,
  deleteUser,
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
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
app.use(express.json());

app.post("/auth/login", login);
app.post("/auth/verify-otp", verifyOTP);
app.get("/auth/validate-token", authenticateToken, validateToken);
app.delete("/users/:userId", deleteUser);
app.patch("/users/:userId/", updateUser);
app.get("/users/:userId", getUser);
app.get("/users", getAllUsers);
app.post("/users", createUser);
app.get("/roles", getAllRoles);

app.patch("/certificates/:certificateId", updateCertificate);
app.post("/certificates/:certificateId/send", sendCertificateByEmail);
app.get("/certificates/:certificateId/pdf", getCertificatePdf);
app.get("/certificates/:certificateId", getCertificate);
app.get("/certificates", getAllCertificates);
app.get("/certificates/:certificateId/preview", getCertificatePreview);
// app.post("/volunteers/:volunteerId/certificates/:certificateId/send", sendCertificate)
app.get("/volunteers/:volunteerId/certificates", getVolunteerCertificates);

app.patch("/volunteers/:volunteerId", updateVolunteer);
// app.get("/volunteers/:volunteerId/teams", getVolunteerTasks);
app.post("/volunteers/:volunteerId/certificates", createCertificate);
app.get("/volunteers/:volunteerId/tasks", getVolunteerTasks);
app.get("/volunteers/:volunteerId/volunteering", getVolunteerVolunteering);
app.get("/volunteers/:volunteerId", getVolunteer);
app.get("/volunteers", getAllVolunteers);
app.post("/volunteers", createVolunteer);

app.patch("/teams/:teamId", updateTeam);
app.get("/teams/:teamId/tasks", getTeamTasks);
app.get("/teams/:teamId/volunteering", getTeamVolunteering);
app.get("/teams/:teamId", getTeam);
app.get("/teams", getAllTeams);
app.post("/teams", createTeam);

app.get("/tasks/:taskId", getTask);

// app.delete("/volunteering/:teamVolunteerId/tasks/:taskId", deleteTask);

app.patch("/volunteering/:teamVolunteerId/end", endVolunteering);
app.get("/volunteering/:teamVolunteerId/tasks", getTeamVolunteerTasks);
app.post("/volunteering/:teamVolunteerId/tasks", createTask);
app.patch("/volunteering/:teamVolunteerId", updateTeamVolunteer);
app.get("/volunteering/:teamVolunteerId", getTeamVolunteer);
app.get("/volunteering", getAllTeamVolunteers);
app.post("/volunteering", createTeamVolunteer);
// app.patch("/tasks/:taskId/update", updateTask);

app.get("/tasks", getAllTasks);

app.patch("/tasks/:taskId", updateTask);
app.patch("/tasks/:taskId/complete", completeTask);

app.listen(5000, () => {
  console.log("Connected to backend.");
});
