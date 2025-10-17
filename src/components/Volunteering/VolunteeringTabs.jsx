import { useState, useMemo, useEffect, useRef } from "react";
import { useVolunteering } from "../../Contexts/VolunteeringContext";
import TabBtns from "../Global/TabBtns";
import TasksTab from "../Tasks/TasksTab";
import AddTaskTab from "../Tasks/AddTaskTab";
// import VolunteeringTab from "../Teams/VolunteeringTab";
// import AddVolunteering from "../Teams/AddVolunteering";
const TeamVolunteerTabs = () => {
  const tabs = useMemo(
    () => [
      {
        name: "statistics",
        title: "Statistics",
      },
      {
        name: "tasks",
        title: "Tasks",
      },
      { name: "addTask", title: "Add a Task" },
    ],
    []
  );
  const [activeTab, setActiveTab] = useState("statistics");
  const tablesSection = useRef(null);
  const {
    volunteeringDetails,
    volunteeringTasks,
    tasksFilter,
    reFetch,

    setTasksFilter,
  } = useVolunteering();

  const handleChangeSelection = () => {
    setActiveTab("tasks");
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
        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <TasksTab
            rows={volunteeringTasks[tasksFilter]}
            filter={tasksFilter}
            setFilter={setTasksFilter}
            details={volunteeringDetails}
            reFetch={volunteeringTasks}
            type="forVolunteering"
          />
        )}

        {activeTab === "addTask" && (
          <AddTaskTab
            selectedVolunteeringHide={true}
            callBack={reFetch}
            cancel={handleChangeSelection}
            hide={true}
            selectedVolunteering={volunteeringDetails}
          />
        )}
      </div>
    </div>
  );
};

export default TeamVolunteerTabs;
