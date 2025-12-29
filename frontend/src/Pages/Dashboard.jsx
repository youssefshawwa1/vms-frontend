// components/Dashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../Contexts/AuthContext";
import useFetching from "../Hooks/useFetching";
const Dashboard = () => {
  const { fetchData } = useFetching();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    await fetchData("dashboard.php", (data) => {
      setLoading(false);
      setStats([
        {
          label: "Total Volunteers",
          value: data.totalVolunteers,
          icon: "👥",
          color: "#0b4e70",
          width: "30%",
        },
        {
          label: "Total Volunteering",
          value: data.totalVolunteering,
          icon: "📊",
          color: "#f59e0b",
          width: "50%",
        },
        {
          label: "Active Volunteering",
          value: data.activeVolunteering,
          icon: "📊",
          color: "#0b4e70",
          width: "60%",
        },
        {
          label: "Total Teams",
          value: data.totalTeams,
          icon: "🏢",
          color: "#0b4e70",
          width: "30%",
        },
        {
          label: "Total Tasks",
          value: data.totalTasks,
          icon: "✅",
          color: "#f59e0b",
          width: "90%",
        },
        {
          label: "Active Tasks",
          value: data.activeTasks,
          icon: "🔥",
          color: "#0b4e70",
          width: "40%",
        },
        {
          label: "Volunteering Certificates",
          value: data.totalIssuedVolunteeringCertificates,
          icon: "📜",
          color: "#f59e0b",
          width: "70%",
        },
        {
          label: "Volunteering Hours",
          value: data.totalVolunteeringHours,
          info: "Total hours contributed",
          icon: "⏰",
          color: "#f59e0b",
          width: "92%",
        },
        {
          label: "Issued Hours",
          value: data.totalIssuedVolunteeringHours,
          info: "Certified hours",
          icon: "🎯",
          color: "#f59e0b",
          width: "83%",
        },
      ]);
    });
  };

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-white p-6 w-full">
      <div className="dashboard">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 animate-fade-in">
          Dashboard
        </h1>

        <div className="stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto">
          {/* Total Volunteering */}
          {stats.map((item) => (
            <div
              className="stat-card group bg-white rounded-xl shadow-lg border border-gray-100 p-6 
                     transition-all duration-500 ease-in-out 
                     hover:shadow-2xl hover:-translate-y-2 hover:scale-105
                     animate-slide-up"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700 transition-colors duration-300 group-hover:text-[#0d4461]">
                  {item.label}
                </h3>
                <div
                  className={`
                    w-10 h-10 bg-[${item.color}] rounded-lg flex items-center justify-center 
                         transition-all duration-300 group-hover:scale-105 group-hover:rotate-25
                    `}
                >
                  <span className="text-white text-lg transition-transform duration-300 group-hover:scale-110">
                    {item.icon}
                  </span>
                </div>
              </div>
              <p
                className="text-3xl font-bold text-[#0d4461] transition-all duration-300 
                     group-hover:scale-105 group-hover:text-[#0a3550] group-hover:"
              >
                {item.value}
              </p>
              {item?.info && (
                <div className="mt-2 text-sm text-gray-500 transition-all duration-300 group-hover:text-gray-700">
                  {item?.info}
                </div>
              )}
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`bg-[${item.color}] h-2 rounded-full transition-all duration-1000 ease-out 
                         group-hover:w-full`}
                  style={{ width: item.width }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
