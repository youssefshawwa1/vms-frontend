// App.jsx
import { Routes, Route, Outlet } from "react-router-dom";
import Home from "./components/Home";
import Volunteers from "./components/Volunteers/Volunteers";
import VolunteerDetails from "./components/Volunteers/VolunteerDetails";
import AddVolunteer from "./components/Volunteers/AddVolunteer";
import Teams from "./components/Teams/Teams";
import Layout from "./components/Layout";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="volunteers" element={<Volunteers />} />
        <Route path="volunteers/:id" element={<VolunteerDetails />} />
        <Route path="volunteers/add" element={<AddVolunteer />} />
        <Route path="teams" element={<Teams />} />
      </Route>
    </Routes>
  );
}

export default App;
