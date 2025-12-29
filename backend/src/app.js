import express from "express";
import cors from "cors";
import db, { testConnection } from "./config/db.js";
import {
  getAllUsers,
  createUser,
  updateUser,
  getUser,
  // searchUsers,
  deleteUser,
} from "./controllers/userController.js";
import {
  getAllVolunteers,
  getVolunteer,
  createVolunteer,
  updateVolunteer,
  getVolunteerVolunteering,
  getVolunteerTasks,
  // searchVolunteers,
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
} from "./controllers/teamVolunteerController.js";

import {
  getAllTasks,
  createTask,
  updateTask,
  getTask,
  deleteTask,
  completeTask,
} from "./controllers/taskController.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
app.use(express.json());

app.post("/users/create", createUser);
app.post("/volunteers/create", createVolunteer);
app.post("/teams/create", createTeam);
app.post("/volunteering/create", createTeamVolunteer);
app.post("/tasks/create", createTask);

app.delete("/users/:userId/delete", deleteUser);
app.patch("/users/:userId/update/", updateUser);
app.get("/users/:userId", getUser);
app.get("/users", getAllUsers);

app.patch("/volunteers/:volunteerId/update", updateVolunteer);
app.get("/volunteers/:volunteerId/tasks", getVolunteerTasks);
app.get("/volunteers/:volunteerId/volunteering", getVolunteerVolunteering);
app.get("/volunteers/:volunteerId", getVolunteer);
app.get("/volunteers", getAllVolunteers);

app.patch("/teams/:teamId/update", updateTeam);
app.get("/teams/:teamId/tasks", getTeamTasks);
app.get("/teams/:teamId/volunteering", getTeamVolunteering);
app.get("/teams/:teamId", getTeam);
app.get("/teams", getAllTeams);

// app.post("/volunteering/:id/tasks/create", );
// app.patch("/volunteering/:id/tasks/:taskId/update");
// app.patch("/volunteering/:id/tasks/:taskId/complete");
// app.delete("/volunteering/:id/tasks/:taskId/delete");

app.get("/volunteering/:teamVolunteerId/tasks/:taskId", getTask);
app.get("/volunteering/:teamVolunteerId/tasks", getTeamVolunteerTasks);
app.get("/volunteering/:teamVolunteerId", getTeamVolunteer);
app.get("/volunteering", getAllTeamVolunteers);

app.patch("/tasks/:taskId/update", updateTask);

app.get("/tasks", getAllTasks);

app.listen(5000, () => {
  console.log("Connected to backend.");
});
