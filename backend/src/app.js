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
  updateCertificate,
  getCertificate,
  getCertificatePdf,
  sendCertificateByEmail,
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
  deleteTask,
  completeTask,
  createTask,
  updateTask,
} from "./controllers/teamVolunteerController.js";

import { getAllTasks } from "./controllers/taskController.js";
import { getAllCertificates } from "./controllers/certificateController.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
app.use(express.json());

app.delete("/users/:userId", deleteUser);
app.patch("/users/:userId/", updateUser);
app.get("/users/:userId", getUser);
app.get("/users", getAllUsers);
app.post("/users", createUser);
app.get("/roles", getAllRoles);
app.post("/volunteers/:volunteerId/certificates", createCertificate);
app.patch(
  "/volunteers/:volunteerId/certificates/:certificateId",
  updateCertificate
);
app.post(
  "/volunteers/:volunteerId/certificates/:certificateId/send",
  sendCertificateByEmail
);
app.get(
  "/volunteers/:volunteerId/certificates/:certificateId/pdf",
  getCertificatePdf
);
app.get("/volunteers/:volunteerId/certificates/:certificateId", getCertificate);

// app.post("/volunteers/:volunteerId/certificates/:certificateId/send", sendCertificate)
app.get("/volunteers/:volunteerId/certificates", getVolunteerCertificates);

app.patch("/volunteers/:volunteerId", updateVolunteer);
// app.get("/volunteers/:volunteerId/teams", getVolunteerTasks);
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

app.get("/volunteering/:teamVolunteerId/tasks/:taskId", getTask);
app.post("/volunteering/:teamVolunteerId/tasks", createTask);
app.patch("/volunteering/:teamVolunteerId/tasks/:taskId", updateTask);
app.patch(
  "/volunteering/:teamVolunteerId/tasks/:taskId/complete",
  completeTask
); /////////check for thiss
app.delete("/volunteering/:teamVolunteerId/tasks/:taskId", deleteTask);

app.patch("/volunteering/:teamVolunteerId/end", endVolunteering); /////////check for thiss
app.get("/volunteering/:teamVolunteerId/tasks", getTeamVolunteerTasks);
app.patch("/volunteering/:teamVolunteerId", updateTeamVolunteer);
app.get("/volunteering/:teamVolunteerId", getTeamVolunteer);
app.get("/volunteering", getAllTeamVolunteers);
app.post("/volunteering", createTeamVolunteer);
// app.patch("/tasks/:taskId/update", updateTask);

app.get("/tasks", getAllTasks);
app.get("/certificates", getAllCertificates);

app.listen(5000, () => {
  console.log("Connected to backend.");
});
