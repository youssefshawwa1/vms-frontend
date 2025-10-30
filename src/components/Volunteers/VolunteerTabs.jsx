import { useState, useMemo, useRef } from "react";
import { useVolunteer } from "../../Contexts/VolunteerContext";
import Tab from "../Global/Tab";
import TabBtns from "../Global/TabBtns";
import VolunteeringTab from "../Teams/VolunteeringTab";
import AddVolunteering from "../Teams/AddVolunteering";
import TasksTab from "../Tasks/TasksTab";
import CertificatesTab from "../VolunteeringCertificates/CertificatesTab";
import AddTaskTab from "../Tasks/AddTaskTab";
import { View } from "../Global/Icons";
// import CertificateForm from "../VolunteeringCertificates/CertificateForm";
import AddCertificate from "../VolunteeringCertificates/AddCertificate";
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
        name: "certificates",
        title: "Certificates",
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
      {
        name: "addCertificate",
        title: "Add Certificate",
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
    volunteerCertificates,
    volunteerHours,
    tasksFilter,
    reFetch,
    setTeamsFilter,
    setVolunteeringFilter,
    setTasksFilter,
  } = useVolunteer();
  const tablesSection = useRef();
  const [activeTab, setActiveTab] = useState("tasks");
  const [selectedVolunteering, setSelectedVolunteering] = useState(null);
  // useEffect(() => {
  //   setActiveTab("tasks");
  // }, [reFetchData]);
  const handleAddTask = (params) => {
    setSelectedVolunteering(params);
    setActiveTab("addTask");
  };
  const handleChangeSelection = () => {
    setSelectedVolunteering(null);
    setTimeout(() => {
      setActiveTab("volunteering");
    }, 200);
  };
  const handleAddToTeam = () => {
    setActiveTab("addToTeam");
  };
  const handleAddCertificate = () => {
    setActiveTab("addCertificate");
  };
  const goToTables = () => {
    setTimeout(() => {
      tablesSection.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 300);
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
      {
        field: "view",
        headerName: "View",
        // description: "This column is to Add a task.",
        sortable: false,
        width: 80,
        // Use `valueGetter` to combine multiple values
        renderCell: (params) => {
          // This is the key function

          return (
            <button
              onClick={() => {
                // handleAddTask(params.row);
              }}
              className="w-full h-full text-center flex justify-center items-center"
            >
              <View />
            </button>
          );
        },
      },
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
            whenVisible={goToTables}
          />
        )}
        {activeTab === "certificates" && (
          <CertificatesTab
            rows={volunteerCertificates}
            type="forVolunteer"
            // whenVisible={goToTables}
            handleAddCertificate={handleAddCertificate}
            whenVisible={goToTables}
            details={{
              ...volunteerHours,
              name: `${volunteerDetails.firstName}_${volunteerDetails.lastName}`,
            }}
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
            whenVisible={goToTables}
          />
        )}
        {activeTab === "teams" && (
          <Tab
            columns={volunteerTeamsColumns}
            rows={volunteerTeams[teamsFilter]}
            filter={teamsFilter}
            setFilter={setTeamsFilter}
            whenVisible={goToTables}
          />
        )}

        {activeTab === "addToTeam" && (
          <AddVolunteering
            type="forVolunteer"
            details={{
              volunteerId: volunteerDetails.id,
            }}
            reFetch={reFetch}
            whenVisible={goToTables}
          />
        )}
        {activeTab === "addTask" && (
          <AddTaskTab
            selectedVolunteering={selectedVolunteering}
            callBack={reFetch}
            cancel={handleChangeSelection}
            hide="volunteer"
            whenVisible={goToTables}
          />
        )}
        {activeTab === "addCertificate" && (
          // <CertificateForm volunteerrDetails={{ id: volunteerDetails.id }} />
          <AddCertificate
            selectedVolunteering={{
              id: volunteerDetails.id,
              issuedHours: volunteerHours.issuedHours,
              totalHours: volunteerHours.totalHours,
              currentHours: volunteerHours.currentHours,
            }}
            callBack={null}
            // hide={true}
            whenVisible={goToTables}
            cancel={() => {
              setActiveTab("certificates");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default VolunteerTabs;
