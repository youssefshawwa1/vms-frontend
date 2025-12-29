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
  // searchVolunteers,
} from "./controllers/volunteerController.js";
import {
  getAllTeams,
  createTeam,
  updateTeam,
  getTeam,
} from "./controllers/teamController.js";
import {
  getAllTeamVolunteers,
  getTeamVolunteer,
  createTeamVolunteer,
} from "./controllers/teamVolunteerController.js";
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

app.get("/users", getAllUsers);
app.get("/users/:id", getUser);

app.get("/volunteers", getAllVolunteers);
app.get("/volunteers/:id", getVolunteer);

app.get("/teams/:id", getTeam);
app.get("/teams", getAllTeams);

app.get("/volunteering/:id", getTeamVolunteer);
app.get("/volunteering", getAllTeamVolunteers);

app.patch("/users/update/:id", updateUser);
app.patch("/volunteers/update/:id", updateVolunteer);
app.patch("/teams/update/:id", updateTeam);

app.delete("/users/delete/:id", deleteUser);
app.listen(5000, () => {
  console.log("Connected to backend.");
});
