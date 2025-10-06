import { useState, useMemo, useEffect, useRef } from "react";
import { useTeam } from "../../contexts/TeamContext";
import TabBtns from "../Global/TabBtns";
import TasksTab from "../Tasks/TasksTab";
import AddTaskTab from "../Tasks/AddTaskTab";
import VolunteeringTab from "./VolunteeringTab";
import AddVolunteering from "./AddVolunteering";
const TeamVolunteerTabs = () => {
  const tabs = useMemo(
    () => [
      {
        name: "tasks",
        title: "Tasks",
      },
      { name: "addTask", title: "Add a Task", hide: false },
    ],
    []
  );
  const [activeTab, setActiveTab] = useState("tasks");
  const tablesSection = useRef(null);
  const {
    teamVolunteering,
    teamTasks,
    teamDetails,
    volunteeringFilter,
    tasksFilter,
    reFetchData,
    reFetch,
    setVolunteeringFilter,
    setTasksFilter,
  } = useTeam();

  const handleAddTask = (params) => {
    setActiveTab("addTask");
    goToTables();
  };
  const handleChangeSelection = () => {
    setActiveTab("volunteering");
    goToTables();
  };
  const handleAddTeamVolunteer = () => {
    setActiveTab("addTeamVolunteer");
    goToTables();
  };

  useEffect(() => {
    setActiveTab("volunteering");
    goToTables();
  }, [reFetchData]);
  const goToTables = () => {
    setTimeout(() => {
      tablesSection.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 500);
  };
  return (
    <div
      className="bg-white rounded-lg shadow-md border border-gray-200"
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
        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <TasksTab
            rows={teamTasks[tasksFilter]}
            filter={tasksFilter}
            setFilter={setTasksFilter}
            details={teamDetails}
            reFetch={reFetch}
            type="forTeam"
          />
        )}
        {activeTab === "addTeamVolunteer" && (
          <AddVolunteering
            type="forTeam"
            details={{
              teamId: teamDetails.id,
            }}
            reFetch={reFetch}
          />
        )}
        {activeTab === "addTask" && (
          <AddTaskTab
            selectedVolunteering={selectedVolunteering}
            callBack={reFetch}
            cancel={handleChangeSelection}
          />
        )}
      </div>
    </div>
  );
};

export default TeamTabs;
