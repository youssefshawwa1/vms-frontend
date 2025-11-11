// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
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
import Certificates from "./Components/VolunteeringCertificates/Certificates";
import CertificateDetails from "./Components/VolunteeringCertificates/CertificateDetails";
import { useAuth } from "./Contexts/AuthContext";
import ProtectedRoute from "./Components/Auth/ProtectedRoute";
import Login from "./Pages/Login";
import Profile from "./Components/Users/Profile";
import Users from "./Components/Users/Users";
import AddUser from "./Components/Users/AddUser";
import UserDetails from "./Components/Users/UserDetails";
const App = () => {
  const { isAuthenticated, loading } = useAuth();
  return (
    <Routes>
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/users" element={<Users />} />
        {/* Volunteer routes */}

        <Route path="users" element={<Outlet />}>
          <Route index element={<Users />} />
          <Route path=":id" element={<UserDetails />} />
          <Route path="add" element={<AddUser />} />
        </Route>
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
        </Route>
        <Route path="tasks" element={<Outlet />}>
          <Route index element={<Tasks />} />
          <Route path=":id" element={<TaskDetails />} />
        </Route>
        <Route path="certificates" element={<Outlet />}>
          <Route index element={<Certificates />} />
          <Route path=":id" element={<CertificateDetails />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
