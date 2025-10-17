import { useState, useMemo, useRef, useEffect } from "react";
import { useTeam } from "../../Contexts/TeamContext";
import TabBtns from "../Global/TabBtns";
import TasksTab from "../Tasks/TasksTab";
import AddTaskTab from "../Tasks/AddTaskTab";
import VolunteeringTab from "./VolunteeringTab";
import AddVolunteering from "./AddVolunteering";
const TeamTabs = () => {
  const tabs = useMemo(
    () => [
      {
        name: "volunteering",
        title: "Volunteering",
      },
      {
        name: "tasks",
        title: "Tasks",
      },
      { name: "addTask", title: "Add a Task", hide: true },
      { name: "addTeamVolunteer", title: "Add a Volunteer", hide: true },
    ],
    []
  );
  const [activeTab, setActiveTab] = useState("volunteering");
  const [selectedVolunteering, setSelectedVolunteering] = useState({});
  const tablesSection = useRef(null);
  const {
    teamVolunteering,
    teamTasks,
    teamDetails,
    volunteeringFilter,
    tasksFilter,
    reFetch,
    setVolunteeringFilter,
    setTasksFilter,
  } = useTeam();

  const handleAddTask = (params) => {
    setActiveTab("addTask");
    setSelectedVolunteering(params);
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
    goToTables();
  }, [activeTab]);
  const goToTables = () => {
    setTimeout(() => {
      tablesSection.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 200);
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
        {/* Volunteers Tab */}
        {activeTab === "volunteering" && (
          <VolunteeringTab
            rows={teamVolunteering[volunteeringFilter]}
            filter={volunteeringFilter}
            setFilter={setVolunteeringFilter}
            type="forTeam"
            handleAddTeamVolunteer={handleAddTeamVolunteer}
            handleAddTask={handleAddTask}
          />
        )}

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
