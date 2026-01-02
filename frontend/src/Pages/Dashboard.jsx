import { useState, useEffect } from "react";
import { useAuth } from "../Contexts/AuthContext";
import api from "../api/axios"; // Your new Axios instance
import {
  People,
  BarChart,
  Business,
  CheckCircle,
  Whatshot,
  Description,
  AccessTime,
  TrackChanges,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // Calling your Node.js endpoint
      const response = await api.get("/dashboard");
      const data = response.data.data;

      // Mapping backend data to your UI structure
      const formattedStats = [
        {
          label: "Total Volunteers",
          value: data.totalVolunteers,
          icon: <People />,
          color: "#0b4e70",
          width: "30%",
        },
        {
          label: "Total Volunteering",
          value: data.totalVolunteering,
          icon: <BarChart />,
          color: "#f59e0b",
          width: "50%",
        },
        {
          label: "Active Volunteering",
          value: data.activeVolunteering,
          icon: <BarChart />,
          color: "#0b4e70",
          width: "60%",
        },
        {
          label: "Total Teams",
          value: data.totalTeams,
          icon: <Business />,
          color: "#0b4e70",
          width: "30%",
        },
        {
          label: "Total Tasks",
          value: data.totalTasks,
          icon: <CheckCircle />,
          color: "#f59e0b",
          width: "90%",
        },
        {
          label: "Active Tasks",
          value: data.activeTasks,
          icon: <Whatshot />,
          color: "#0b4e70",
          width: "40%",
        },
        {
          label: "Certificates Issued",
          value: data.totalIssuedVolunteeringCertificates,
          icon: <Description />,
          color: "#f59e0b",
          width: "70%",
        },
        {
          label: "Volunteering Hours",
          value: data.totalVolunteeringHours,
          info: "Total contributed",
          icon: <AccessTime />,
          color: "#f59e0b",
          width: "92%",
        },
        {
          label: "Issued Hours",
          value: data.totalIssuedVolunteeringHours,
          info: "Certified hours",
          icon: <TrackChanges />,
          color: "#f59e0b",
          width: "83%",
        },
      ];

      setStats(formattedStats);
    } catch (error) {
      console.error("Failed to fetch stats", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <CircularProgress sx={{ color: "#0b4e70" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50/50 p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-[#0d4461] tracking-tight">
            Welcome back,{" "}
            <span className="text-[#f59e0b]">{user?.username || "User"}</span>
          </h1>
          <p className="mt-2 text-gray-500">
            Here's what's happening with your volunteering!.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {stats.map((item, index) => (
            <div
              key={index}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div
                className="absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-5 transition-all duration-500 group-hover:scale-150"
                style={{ backgroundColor: item.color }}
              />

              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {item.label}
                  </p>
                  <h3 className="mt-1 text-3xl font-bold text-[#0d4461]">
                    {item.value?.toLocaleString() || 0}
                  </h3>
                </div>
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg transition-transform duration-300 group-hover:rotate-12"
                  style={{ backgroundColor: item.color }}
                >
                  {item.icon}
                </div>
              </div>

              {item.info && (
                <p className="mt-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {item.info}
                </p>
              )}

              <div className="mt-6">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-gray-400">Target Progress</span>
                  <span className="font-semibold" style={{ color: item.color }}>
                    {item.width}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: item.width,
                      backgroundColor: item.color,
                      boxShadow: `0 0 10px ${item.color}40`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
