// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Volunteers from "./components/Volunteers/Volunteers";
import VolunteerDetails from "./components/Volunteers/VolunteerDetails";
import AddVolunteer from "./components/Volunteers/AddVolunteer";
import AddTeam from "./components/Teams/AddTeam";
import Teams from "./components/Teams/Teams";
import Layout from "./components/Global/Main/Layout";
import TeamVolunteer from "./components/Teams/TeamVolunteer/TeamVolunteer";
import "./App.css";
import TeamDetails from "./components/Teams/TeamDetails";
import { VolunteerProvider } from "./contexts/VolunteerContext";
import { TeamProvider } from "./contexts/TeamContext";
import { VolunteeringProvider } from "./contexts/VolunteeringContext";
import PageNotFound from "./components/Global/Main/PageNotFound";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="volunteers" element={<Volunteers />} />
        <Route
          path="volunteers/:id"
          element={
            <VolunteerProvider>
              <VolunteerDetails />
            </VolunteerProvider>
          }
        />
        <Route path="volunteers/add" element={<AddVolunteer />} />
        <Route path="teams" element={<Teams />} />
        <Route
          path="teams/:id"
          element={
            <TeamProvider>
              <TeamDetails />
            </TeamProvider>
          }
        />
        <Route path="teams/add" element={<AddTeam />} />
        <Route
          path="teams/:id/volunteering/:tvId"
          element={
            <VolunteeringProvider>
              <TeamVolunteer />
            </VolunteeringProvider>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
