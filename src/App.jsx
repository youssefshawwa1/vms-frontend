// App.jsx
import { Routes, Route, Outlet } from "react-router-dom";
import Home from "./components/Home";
import Volunteers from "./components/Volunteers/Volunteers";
import VolunteerDetails from "./components/Volunteers/VolunteerDetails";
import AddVolunteer from "./components/Volunteers/AddVolunteer";
import AddTeam from "./components/Teams/AddTeam";
import Teams from "./components/Teams/Teams";
import Layout from "./components/Layout";
import AddTeamVolunteer from "./components/Teams/AddTeamVolunteer";
import "./App.css";
import TeamDetails from "./components/Teams/TeamDetails";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="volunteers" element={<Volunteers />} />
        <Route path="volunteers/:id" element={<VolunteerDetails />} />
        <Route path="volunteers/add" element={<AddVolunteer />} />
        <Route path="teams" element={<Teams />} />
        <Route path="teams/:id" element={<TeamDetails />} />
        <Route path="teams/add" element={<AddTeam />} />
      </Route>
    </Routes>
  );
};

export default App;
