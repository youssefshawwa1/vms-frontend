// App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Header from "./components/Header";
import SidePanel from "./components/SidePanel";
import Volunteers from "./components/Volunteers/Volunteers";
import VolunteerDetails from "./components/Volunteers/VolunteerDetails";
import AddVolunteer from "./components/Volunteers/AddVolunteer";
import { useLoading } from "./contexts/LoadingContext";
import Loading from "./components/Loading";
import Message from "./components/Message";
import "./App.css";
function App() {
  // const { isLoading, showLoading, hideLoading } = useLoding();
  const { isLoading, isMessageVisible } = useLoading();
  return (
    <div className="app">
      {/* Navigation */}
      {isLoading && <Loading />}
      {isMessageVisible && <Message />}
      <Header />
      <SidePanel userAvatar="YS" userRole="Admin" userName="joe" />
      <div className="main-content flex">
        {/* Routes */}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/volunteers" element={<Volunteers />} />
          <Route path="/volunteers/:id" element={<VolunteerDetails />} />
          <Route path="/volunteers/add" element={<AddVolunteer />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
