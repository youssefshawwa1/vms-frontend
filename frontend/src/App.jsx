// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Volunteers from "./Pages/Volunteers";
import Teams from "./Pages/Teams";
import Layout from "./Components/Global/Layout/Layout";
import "./App.css";
import PageNotFound from "./Components/Global/PageNotFound";
import Volunteering from "./Pages/Volunteering";
import Tasks from "./Pages/Tasks";
import Certificates from "./Pages/Certificates";
import { useAuth } from "./Contexts/AuthContext";
import ProtectedRoute from "./Components/Auth/ProtectedRoute";
import Login from "./Pages/Login";
import Profile from "./Components/Users/Profile";
import Users from "./Pages/Users";
import { volunteerFormFieldConfig } from "./config/volunteerConfig";
import GenericCreatePage from "./Components/GenericCreatePage";
import axios from "axios";
import DetailViewShell from "./Components/DetailViewShell";
import { teamTabsConfig } from "./config/teamConfig";
import { volunteerTabsConfig } from "./config/volunteerConfig";
import { teamFormFieldConfig } from "./config/teamConfig";
import { volunteeringTabsConfig } from "./config/volunteeringConfig";
import { taskTabsConfig } from "./config/taskConfig";
import { certificateTabConfig } from "./config/certificateConfig";
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

        {/* <Route path="users" element={<Outlet />}>
          <Route index element={<Users />} />
          <Route path=":id" element={<UserDetails />} />
          <Route path="add" element={<AddUser />} />
        </Route> */}
        <Route
          path="volunteers"
          // element={<Outlet />} // You can include this, or omit it entirely
        >
          <Route index element={<Volunteers />} />

          <Route
            path=":id"
            element={
              <DetailViewShell
                idName={"volunteerId"}
                config={volunteerTabsConfig}
                fetchFn={(params) =>
                  axios.get(`http://localhost:5000/volunteers/${params.id}`)
                }
              />
            }
          >
            {volunteerTabsConfig.tabs.map((tab) => (
              <Route
                key={tab.path}
                index={tab.path === ""}
                path={tab.path !== "" ? tab.path : undefined}
                element={<tab.component {...tab.props} />}
              />
            ))}
          </Route>

          <Route
            path="create"
            element={
              <GenericCreatePage
                title={"Volunteer"}
                config={volunteerFormFieldConfig}
                apiEndpoint={"/volunteers/create"}
                redirectPath={"/volunteers"}
              />
            }
          />
        </Route>

        <Route path="teams">
          <Route index element={<Teams />} />
          <Route
            path=":id"
            element={
              <DetailViewShell
                idName={"teamId"}
                config={teamTabsConfig}
                fetchFn={(params) =>
                  axios.get(`http://localhost:5000/teams/${params.id}`)
                }
              />
            }
          >
            {teamTabsConfig.tabs.map((tab) => (
              <Route
                key={tab.path}
                index={tab.path === ""}
                path={tab.path !== "" ? tab.path : undefined}
                element={<tab.component {...tab.props} />}
              />
            ))}
          </Route>

          <Route
            path="create"
            element={
              <GenericCreatePage
                title={"Team"}
                config={teamFormFieldConfig}
                apiEndpoint={"/teams"}
                redirectPath={"/teams"}
              />
            }
          />
        </Route>

        <Route path="volunteering">
          <Route index element={<Volunteering />} />

          <Route
            path=":id"
            element={
              <DetailViewShell
                idName={"teamVolunteerId"}
                config={volunteeringTabsConfig}
                fetchFn={(params) =>
                  axios.get(`http://localhost:5000/volunteering/${params.id}`)
                }
              />
            }
          >
            {volunteeringTabsConfig.tabs.map((tab) => (
              <Route
                key={tab.path}
                index={tab.path === ""}
                path={tab.path !== "" ? tab.path : undefined}
                element={<tab.component {...tab.props} />}
              />
            ))}
          </Route>
        </Route>

        <Route path="tasks">
          <Route index element={<Tasks />} />

          <Route
            path=":id"
            element={
              <DetailViewShell
                idName={"taskId"}
                config={taskTabsConfig}
                fetchFn={(params) =>
                  axios.get(`http://localhost:5000/tasks/${params.id}`)
                }
              />
            }
          >
            {taskTabsConfig.tabs.map((tab) => (
              <Route
                key={tab.path}
                index={tab.path === ""}
                path={tab.path !== "" ? tab.path : undefined}
                element={<tab.component {...tab.props} />}
              />
            ))}
          </Route>
        </Route>

        <Route path="certificates">
          <Route index element={<Certificates />} />

          <Route
            path=":id"
            element={
              <DetailViewShell
                idName={"certificateId"}
                config={certificateTabConfig}
                fetchFn={(params) =>
                  axios.get(`http://localhost:5000/certificates/${params.id}`)
                }
              />
            }
          >
            {certificateTabConfig.tabs.map((tab) => (
              <Route
                key={tab.path}
                index={tab.path === ""}
                path={tab.path !== "" ? tab.path : undefined}
                element={<tab.component {...tab.props} />}
              />
            ))}
          </Route>
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
