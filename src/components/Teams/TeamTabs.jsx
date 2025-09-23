import { useState } from "react";
import Table from "../Table";
import LinkBtn from "../LinkBtn";
import AddTeamVolunteer from "./AddTeamVolunteer";
const TeamTabs = (props) => {
  const [activeTab, setActiveTab] = useState("volunteers");

  const teamVolunteersColumns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "volunteerTitle", headerName: "Title", width: 130 },
    {
      field: "roleTitle",
      headerName: "Role Type",
      width: 130,
    },
    { field: "description", headerName: "Description", width: 130 },
    {
      field: "name",
      headerName: "full name",
      description: "This column is to View.",
      width: 100,
      valueGetter: (value, row) => {
        return `${row.firstName} ${row.lastName}`;
      },
    },
    { field: "email", headerName: "Email", width: 130 },
    { field: "phone", headerName: "Phone", width: 130 },
    { field: "startDate", headerName: "Start Date", width: 130 },
    { field: "endDate", headerName: "End Date", width: 130 },
    {
      field: "active",
      headerName: "Status",
      width: 130,
      valueGetter: (value, row) => {
        if (row.active) {
          return "Active";
        }

        return "Not Active";
      },
    },
    {
      field: "view",
      headerName: "View",
      description: "This column is to Options.",
      sortable: false,
      width: 90,
      // Use `valueGetter` to combine multiple values
      renderCell: (params) => {
        // This is the key function

        return (
          // <Link
          //   className="bg-blue-400 w-full h-full p-4 text-white rounded-lg hover:bg-gray-400 focus:bg-gray-700  transition-color duration-200 ease-linear"
          //   variant="contained"
          //   size="small"
          //   to={`teamVolunteers/${params.id}`}
          // >
          //   View
          // </Link>
          <LinkBtn to={`teamVolunteers/${params.id}`} text="View" />
        );
      },
    },
  ];

  const teamTasksColumns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "taskTitle", headerName: "Task Title", width: 130 },
    {
      field: "description",
      headerName: "Description",
      width: 130,
    },
    { field: "startDate", headerName: "Start Date", width: 130 },
    { field: "endDate", headerName: "End Date", width: 130 },
    {
      field: "volunteeringHours",
      headerName: "Hours",
      width: 70,
      valueGetter: (value, row) => {
        return `${row.volunteeringHours} Hr`;
      },
    },
    {
      field: "fullName",
      headerName: "Volunteer",
      width: 130,
      valueGetter: (value, row) => {
        return `${row.firstName} ${row.lastName}`;
      },
    },
    { field: "volunteerTitle", headerName: "Title", width: 130 },
    {
      field: "view",
      headerName: "View",
      description: "This column is to View.",
      sortable: false,
      width: 100,
      // Use `valueGetter` to combine multiple values
      renderCell: (params) => {
        // This is the key function
        return <LinkBtn to={`tasks/${params.id}`} text="View" />;
      },
    },
  ];
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      {/* Tab Headers */}

      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "volunteers"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("volunteers")}
          >
            Volunteering
          </button>
          <button
            className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "tasks"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("tasks")}
          >
            Tasks
          </button>
          {activeTab === "addTeamVolunteer" && (
            <button
              className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "addTeamVolunteer"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Add a Volunteer
            </button>
          )}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6 w-full">
        {/* Volunteers Tab */}
        {activeTab === "volunteers" && (
          <div>
            {/* Filter Controls */}
            <div className="mb-6 relative">
              <label className="text-sm font-medium text-gray-700 mr-4">
                Show:
              </label>
              <div className="inline-flex space-x-4 ">
                {["all", "current", "old"].map((filter) => (
                  <label key={filter} className="inline-flex items-center">
                    <input
                      type="radio"
                      name="volunteerFilter"
                      value={filter}
                      checked={props.volunteersType === filter}
                      onChange={(e) => props.volunteersFilter(e.target.value)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">
                      {filter}
                    </span>
                  </label>
                ))}
              </div>
              <div
                className="absolute top-0 right-0"
                onClick={() => {
                  setActiveTab("addTeamVolunteer");
                  console.log(activeTab);
                }}
              >
                <LinkBtn text="Add" />
              </div>
            </div>

            <Table
              columns={teamVolunteersColumns}
              rows={props.teamVolunteers}
            />
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <div>
            {/* Filter Controls */}
            <div className="mb-6 ">
              <label className="text-sm font-medium text-gray-700 mr-4">
                Show:
              </label>
              <div className="inline-flex space-x-4">
                {["all", "current", "old"].map((filter) => (
                  <label key={filter} className="inline-flex items-center">
                    <input
                      type="radio"
                      name="taskFilter"
                      value={filter}
                      checked={props.tasksType === filter}
                      onChange={(e) => props.tasksFilter(e.target.value)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">
                      {filter}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tasks DataGrid Placeholder */}

            <Table columns={teamTasksColumns} rows={props.teamTasks} />
          </div>
        )}
        {activeTab === "addTeamVolunteer" && (
          <div>
            {/* Filter Controls */}
            {/* Tasks DataGrid Placeholder */}
            <AddTeamVolunteer
              teamId={props.teamId}
              reFetchData={props.reFetchData}
              setActiveTab={setActiveTab}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamTabs;
