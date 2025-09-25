import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useVolunteer } from "../../contexts/VolunteerContext";
import Tab from "../Global/Tab";
import TabBtns from "../Global/TabBtns";
import TabBtn from "../Global/TabBtn";
import AddToTeam from "./AddToTeam";
import { View } from "../Global/Icons";
import LinkBtn from "../Global/LinkBtn";

import { AddDocument, AddPerson } from "../Global/Icons";

const VolunteerTabs = () => {
  const tabs = useMemo(
    () => [
      {
        name: "tasks",
        title: "Tasks",
      },
      {
        name: "volunteering",
        title: "Volunteering Roles",
      },
      {
        name: "teams",
        title: "Teams",
      },
      {
        name: "hours",
        title: "Volunteering Hours",
      },
    ],
    []
  );
  const {
    volunteerTeams,
    volunteerTasks,
    volunteerVolunteering,
    teamsFilter,
    volunteeringFilter,
    tasksFilter,
    reFetchData,
    setTeamsFilter,
    setVolunteeringFilter,
    setTasksFilter,
  } = useVolunteer();

  const [activeTab, setActiveTab] = useState("tasks");
  useEffect(() => {
    setActiveTab("tasks");
  }, [reFetchData]);
  const handleAddTask = (params) => {
    console.log(params);
  };
  const volunteeringColumns = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 70 },
      { field: "volunteerTitle", headerName: "Title", width: 130 },
      {
        field: "roleTitle",
        headerName: "Role Type",
        width: 130,
      },
      { field: "description", headerName: "Description", width: 130 },
      {
        field: "teamName",
        headerName: "Team",
        description: "This column is to View.",
        width: 100,
      },
      { field: "startDate", headerName: "Start Date", width: 130 },
      { field: "endDate", headerName: "End Date", width: 130 },
      {
        field: "totalHours",
        headerName: "Total Hours",
        width: 130,
        valueGetter: (value, row) => {
          return `${row.totalHours ? row.totalHours : 0} Hr`;
        },
      },
      { field: "totalTasks", headerName: "Total Tasks", width: 130 },
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
        field: "addTask",
        headerName: "Add Task",
        description: "This column is to Add a task.",
        sortable: false,
        width: 90,
        // Use `valueGetter` to combine multiple values
        renderCell: (params) => {
          // This is the key function

          return (
            !params.endDate && (
              <button
                onClick={() => {
                  handleAddTask(params.row);
                }}
                className="w-full h-full text-center flex justify-center items-center"
              >
                <AddDocument />
              </button>
            )
          );
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
            <Link
              className="w-full h-full text-center flex justify-center items-center"
              variant="contained"
              size="small"
              to={`teamVolunteers/${params.id}`}
            >
              <View />
            </Link>
          );
        },
      },
    ],
    []
  );

  const volunteerTasksColumns = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 70 },
      { field: "taskTitle", headerName: "Task Title", width: 130 },
      {
        field: "taskDescription",
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
        field: "teamName",
        headerName: "Team",
        width: 130,
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
          return (
            <Link
              className="w-full h-full text-center flex justify-center items-center"
              variant="contained"
              size="small"
              to={`tasks/${params.id}`}
            >
              <View />
            </Link>
          );
        },
      },
    ],
    []
  );

  const volunteerTeamsColumns = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 70 },
      {
        field: "teamName",
        headerName: "Team",
        width: 130,
      },
      { field: "description", headerName: "Description", width: 130 },
      {
        field: "totalHours",
        headerName: "Total Hours",
        width: 130,
        valueGetter: (value, row) => {
          return `${row.totalHours ? row.totalHours : 0} Hr`;
        },
      },
      { field: "totalTasks", headerName: "Total Tasks", width: 130 },
      // {
      //   field: "view",
      //   headerName: "View",
      //   description: "This column is to View.",
      //   sortable: false,
      //   width: 100,
      //   // Use `valueGetter` to combine multiple values
      //   renderCell: (params) => {
      //     // This is the key function
      //     return <LinkBtn to={`tasks/${params.id}`} text="View" />;
      //   },
      // },
    ],
    []
  );
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-10">
      {/* Tab Headers */}

      <div className="border-b border-gray-200">
        <nav className="flex flex-col sm:flex-row">
          <TabBtns
            btns={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          {activeTab === "addToTeam" && (
            <TabBtn
              btn={{
                name: "addToTeam",
                title: "Add to Team",
              }}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          )}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6 w-full">
        {/* Volunteers Tab */}
        {activeTab === "volunteering" && (
          <div className="relative">
            <Tab
              columns={volunteeringColumns}
              rows={volunteerVolunteering[volunteeringFilter]}
              filter={volunteeringFilter}
              setFilter={setVolunteeringFilter}
            />

            <div
              className="absolute top-0 right-0"
              onClick={() => {
                setActiveTab("addToTeam");
              }}
            >
              <AddPerson />
            </div>
          </div>
        )}
        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <Tab
            columns={volunteerTasksColumns}
            rows={volunteerTasks[tasksFilter]}
            filter={tasksFilter}
            setFilter={setTasksFilter}
          />
        )}
        {activeTab === "teams" && (
          <Tab
            columns={volunteerTeamsColumns}
            rows={volunteerTeams[teamsFilter]}
            filter={teamsFilter}
            setFilter={setTeamsFilter}
          />
        )}

        {activeTab === "addToTeam" && <AddToTeam />}
      </div>
    </div>
  );
};

export default VolunteerTabs;
