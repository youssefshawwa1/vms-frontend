import { useState, useMemo, useEffect } from "react";
import LinkBtn from "../Global/LinkBtn";
import AddTeamVolunteer from "./AddTeamVolunteer";
import { BsPersonFillAdd } from "react-icons/bs";
import Tab from "../Global/Tab";
import { useTeam } from "../../contexts/TeamContext";
import TabBtns from "../Global/TabBtns";
import TabBtn from "../Global/TabBtn";
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
    ],
    []
  );
  const [activeTab, setActiveTab] = useState("volunteers");
  const {
    teamDetails,
    teamVolunteering,
    teamTasks,
    volunteeringFilter,
    tasksFilter,
    reFetchData,
    reFetch,
    setVolunteeringFilter,
    setTasksFilter,
  } = useTeam();
  const teamVolunteersColumns = useMemo(
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
            <LinkBtn to={`volunteering/${params.id}`} text="View" />
          );
        },
      },
    ],
    []
  );
  useEffect(() => {
    setActiveTab("volunteering");
  }, [reFetchData]);

  const teamTasksColumns = useMemo(
    () => [
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
    ],
    []
  );
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      {/* Tab Headers */}

      <div className="border-b border-gray-200">
        <nav className="flex flex-col sm:flex-row">
          <TabBtns
            btns={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          {activeTab === "addTeamVolunteer" && (
            <TabBtn
              btn={{ name: "addTeamVolunteer", title: "Add a Volunteer" }}
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
              columns={teamVolunteersColumns}
              rows={teamVolunteering[volunteeringFilter]}
              filter={volunteeringFilter}
              setFilter={setVolunteeringFilter}
            />
            <div
              className="absolute top-0 right-0"
              onClick={() => {
                setActiveTab("addTeamVolunteer");
              }}
            >
              <BsPersonFillAdd className="text-yellow-400 text-4xl cursor-pointer hover:text-yellow-500 transition-colors" />
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <Tab
            columns={teamTasksColumns}
            rows={teamTasks[tasksFilter]}
            filter={tasksFilter}
            setFilter={setTasksFilter}
          />
        )}
        {activeTab === "addTeamVolunteer" && (
          <div>
            <AddTeamVolunteer
              teamId={teamDetails.id}
              reFetchData={reFetch}
              setActiveTab={setActiveTab}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamTabs;
