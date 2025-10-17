// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Home from "./Pages/Home";
import Volunteers from "./Components/Volunteers/Volunteers";
import VolunteerDetails from "./Components/Volunteers/VolunteerDetails";
import AddVolunteer from "./Components/Volunteers/AddVolunteer";
import AddTeam from "./Components/Teams/AddTeam";
import Teams from "./components/Teams/Teams";
import Layout from "./Components/Global/Layout/Layout";
import TeamVolunteer from "./Components/Volunteering/VolunteeringDetails";
import "./App.css";
import TeamDetails from "./Components/Teams/TeamDetails";
import { VolunteerProvider } from "./Contexts/VolunteerContext";
import { TeamProvider } from "./Contexts/TeamContext";
import { VolunteeringProvider } from "./Contexts/VolunteeringContext";
import PageNotFound from "./Components/Global/PageNotFound";

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
          path="volunteering/:id"
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
