import { Link } from "react-router-dom";
import { View, AddDocument, AddPerson } from "../Global/Icons";
import Tab from "../Global/Tab";

const VolunteeringTab = ({
  rows,
  filter,
  setFilter,
  handleAddTask,
  handleAddTeamVolunteer,
  type,
}) => {
  let columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "volunteerTitle", headerName: "Title", width: 130 },
    {
      field: "roleTitle",
      headerName: "Role Type",
      width: 120,
    },
    { field: "description", headerName: "Description", width: 130 },

    {
      field: "startDate",
      headerName: "Start Date",
      width: 100,
      valueGetter: (value, row) => {
        return new Date(row.startDate).toLocaleDateString();
      },
    },
    {
      field: "endDate",
      headerName: "End Date",
      width: 100,
      valueGetter: (value, row) => {
        return row.endDate ? new Date(row.endDate).toLocaleDateString() : "";
      },
    },
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
      width: 60,
      valueGetter: (value, row) => {
        if (row.active) {
          return "Active";
        }

        return "Not Active";
      },
    },
  ];
  switch (type) {
    case "forVolunteer":
      columns.push({
        field: "teamName",
        headerName: "Team",
        description: "This column is to View.",
        width: 100,
      });
      break;
    case "forTeam":
      columns.push(
        {
          field: "name",
          headerName: "Full Name",
          description: "This column is to View.",
          width: 120,
          valueGetter: (value, row) => {
            return row.fullName;
          },
        },
        { field: "email", headerName: "Email", width: 130 },
        { field: "phone", headerName: "Phone", width: 130 }
      );
      break;
    default:
      columns = "";
  }

  columns.push(
    {
      field: "addTask",
      headerName: "Add Task",
      description: "This column is to Add a task.",
      sortable: false,
      width: 80,
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
      width: 80,
      // Use `valueGetter` to combine multiple values
      renderCell: (params) => {
        // This is the key function

        return (
          <Link
            className="w-full h-full text-center flex justify-center items-center"
            variant="contained"
            size="small"
            to={`volunteering/${params.id}`}
          >
            <View />
          </Link>
        );
      },
    }
  );

  return (
    <div className="relative">
      <Tab
        columns={columns}
        rows={rows}
        filter={filter}
        setFilter={setFilter}
        hide={{
          status: false,
          description: false,
        }}
      />
      <div className="absolute top-0 right-0" onClick={handleAddTeamVolunteer}>
        <AddPerson />
      </div>
    </div>
  );
};
export default VolunteeringTab;
