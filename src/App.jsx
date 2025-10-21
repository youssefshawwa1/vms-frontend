// App.jsx
import { Routes, Route } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Home from "./Pages/Home";
import Volunteers from "./Components/Volunteers/Volunteers";
import VolunteerDetails from "./Components/Volunteers/VolunteerDetails";
import AddVolunteer from "./Components/Volunteers/AddVolunteer";
import AddTeam from "./Components/Teams/AddTeam";
import Teams from "./Components/Teams/Teams";
import Layout from "./Components/Global/Layout/Layout";
import "./App.css";
import TeamDetails from "./Components/Teams/TeamDetails";
import { VolunteerProvider } from "./Contexts/VolunteerContext";
import { TeamProvider } from "./Contexts/TeamContext";
import { VolunteeringProvider } from "./Contexts/VolunteeringContext";
import PageNotFound from "./Components/Global/PageNotFound";
import Volunteering from "./Components/Volunteering/Volunteering";
import VolunteeringDetails from "./Components/Volunteering/VolunteeringDetails";
import Tasks from "./Components/Tasks/Tasks";
import TaskDetails from "./Components/Tasks/TaskDetails";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

        {/* Volunteer routes */}
        <Route
          path="volunteers"
          element={
            <VolunteerProvider>
              <Outlet />
            </VolunteerProvider>
          }
        >
          <Route index element={<Volunteers />} />
          <Route path=":id" element={<VolunteerDetails />} />
          <Route path="add" element={<AddVolunteer />} />
        </Route>

        {/* Team routes */}
        <Route
          path="teams"
          element={
            <TeamProvider>
              <Outlet />
            </TeamProvider>
          }
        >
          <Route index element={<Teams />} />
          <Route path=":id" element={<TeamDetails />} />
          <Route path="add" element={<AddTeam />} />
        </Route>

        <Route
          path="volunteering"
          element={
            <VolunteeringProvider>
              <Outlet />
            </VolunteeringProvider>
          }
        >
          <Route index element={<Volunteering />} />
          <Route path=":id" element={<VolunteeringDetails />} />
          {/* <Route path="add" element={<AddVolun />} /> */}
        </Route>
        <Route path="tasks" element={<Outlet />}>
          <Route index element={<Tasks />} />
          <Route path=":id" element={<TaskDetails />} />
          {/* <Route path="add" element={<AddVolun />} /> */}
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
