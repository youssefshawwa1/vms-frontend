import { useState, useMemo, useEffect, useRef } from "react";
import { useVolunteer } from "../../contexts/VolunteerContext";
import Tab from "../Global/Tab";
import TabBtns from "../Global/TabBtns";
import VolunteeringTab from "../Teams/VolunteeringTab";
import AddVolunteering from "../Teams/AddVolunteering";

import TasksTab from "../Tasks/TasksTab";

import AddTaskTab from "../Tasks/AddTaskTab";

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
      {
        name: "addToTeam",
        title: "Add to Team",
        hide: true,
      },
      {
        name: "addTask",
        title: "Add Task",
        hide: true,
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
    volunteerDetails,
    tasksFilter,
    reFetch,
    reFetchData,
    setTeamsFilter,
    setVolunteeringFilter,
    setTasksFilter,
  } = useVolunteer();
  const tablesSection = useRef();
  const [activeTab, setActiveTab] = useState("tasks");
  const [selectedVolunteering, setSelectedVolunteering] = useState({});
  useEffect(() => {
    setActiveTab("tasks");
  }, [reFetchData]);
  const handleAddTask = (params) => {
    setActiveTab("addTask");
    setSelectedVolunteering(params);
  };
  const handleChangeSelection = () => {
    setActiveTab("volunteering");
  };
  const handleAddToTeam = () => {
    setActiveTab("addToTeam");
  };
  useEffect(() => {
    goToTables();
  }, [activeTab]);

  const goToTables = () => {
    tablesSection.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };
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
    <div
      className="bg-white rounded-lg shadow-md border border-gray-200 mb-10 fadeIn"
      ref={tablesSection}
    >
      {/* Tab Headers */}
      <div className="border-b border-gray-200">
        <nav className="flex flex-col sm:flex-row">
          <TabBtns
            btns={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6 w-full">
        {/* Volunteers Tab */}
        {activeTab === "volunteering" && (
          <VolunteeringTab
            rows={volunteerVolunteering[volunteeringFilter]}
            filter={volunteeringFilter}
            setFilter={setVolunteeringFilter}
            type="forVolunteer"
            handleAddTask={handleAddTask}
            handleAddTeamVolunteer={handleAddToTeam}
          />
        )}
        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <TasksTab
            rows={volunteerTasks[tasksFilter]}
            filter={tasksFilter}
            setFilter={setTasksFilter}
            details={volunteerDetails}
            reFetch={reFetch}
            type="forVolunteer"
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

        {activeTab === "addToTeam" && (
          <AddVolunteering
            type="forVolunteer"
            details={{
              volunteerId: volunteerDetails.id,
            }}
            reFetch={reFetch}
          />
        )}
        {activeTab === "addTask" && (
          <AddTaskTab
            selectedVolunteering={selectedVolunteering}
            callBack={reFetch}
            cancel={handleChangeSelection}
            hide="volunteer"
          />
        )}
      </div>
    </div>
  );
};

export default VolunteerTabs;
