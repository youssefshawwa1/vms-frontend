import { Link } from "react-router-dom";
import Tab from "../Global/Tab";
import { useOverLay } from "../../contexts/OverLayContext";
import { View, CompleteDocument } from "../Global/Icons";
import CompleteTask from "./CompleteTask";
const TasksTab = ({
  rows,
  filter,
  setFilter,
  details,
  reFetch,
  type = "full",
}) => {
  const { showPopUp, hidePopUp } = useOverLay();
  let columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "taskTitle", headerName: "Task Title", width: 130 },
    {
      field: "taskDescription",
      headerName: "Description",
      width: 130,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      width: 130,
      valueGetter: (value, row) => {
        return row.startDate
          ? new Date(row.startDate).toLocaleDateString()
          : "";
      },
    },
    {
      field: "endDate",
      headerName: "End Date",
      width: 130,
      valueGetter: (value, row) => {
        return row.endDate ? new Date(row.endDate).toLocaleDateString() : "";
      },
    },
    {
      field: "completed",
      headerName: "Status",
      width: 130,
      valueGetter: (value, row) => {
        console.log(row);
        return `${row.completed ? "Completed" : "In Progress"}`;
      },
    },
    {
      field: "completionDate",
      headerName: "Completed At",
      width: 130,
      valueGetter: (value, row) => {
        return row.completionDate
          ? new Date(row.completionDate).toLocaleDateString()
          : "";
      },
    },
    {
      field: "volunteeringHours",
      headerName: "Hours",
      width: 70,
    },
  ];
  switch (type) {
    case "forVolunteer":
      columns.push(
        {
          field: "teamName",
          headerName: "Team",
          width: 130,
        },
        { field: "volunteerTitle", headerName: "Title", width: 130 }
      );
      break;
    case "forTeam":
      columns.push(
        {
          field: "volunteerTitle",
          headerName: "Title",
          width: 130,
        },
        {
          field: "fullName",
          headerName: "Full Name",
          width: 130,
          valueGetter: (value, row) => {
            return row.firstName + " " + row.lastName;
          },
        }
      );
      break;
    case "forVolunteering":
      columns.push(
        {
          field: "teamName",
          headerName: "Team",
          width: 130,
        },
        {
          field: "fullName",
          headerName: "Full Name",
          width: 130,
          valueGetter: (value, row) => {
            return row.firstName + " " + row.lastName;
          },
        }
      );
      break;
    default:
      columns = "";
  }
  columns.push({
    field: "complete",
    headerName: "Complete",
    description: "This column is to Complete Task.",
    sortable: false,
    width: 100,
    // Use `valueGetter` to combine multiple values
    renderCell: (params) => {
      if (
        // (params.row.endDate && new Date(params.row.endDate) > new Date()) ||
        !params.row.completed
      ) {
        return (
          <button
            onClick={() => {
              handleCompleteTask(params.row);
            }}
            className="w-full h-full text-center flex justify-center items-center"
          >
            <CompleteDocument />
          </button>
        );
      }
    },
  });
  columns.push({
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
  });
  const handleCompleteTask = (params) => {
    showPopUp(
      "Complete a Task",
      <CompleteTask
        data={{
          fullName: `${
            params.firstName ? params.firstName : details.firstName
          } ${params.lastName ? params.lastName : details.lastName}`,

          teamName: `${details.teamName ? details.teamName : params.teamName}`,
          ...params,
        }}
        callBack={() => {
          hidePopUp();
          reFetch();
        }}
        onCancel={hidePopUp}
      />
    );
  };
  const columnsStyles = {
    "& .expired-row": { backgroundColor: "#f5f5f5", color: "#999" },
    "& .critical-row": {
      backgroundColor: "#f89facff",
    },
    "& .warning-row": {
      backgroundColor: "#f4c57aff",
    },
    "& .alert-row": {
      backgroundColor: "#fff3e0",
    },
    "& .completed-row": {
      backgroundColor: "#acf2b1ff",
    },
    "& .late-completion": {
      backgroundColor: "#e1f3e3ff",
    },
  };

  const getRowClassName = (params) => {
    const endDate = new Date(params.row.endDate);
    const today = new Date();
    const timeDiff = endDate - today;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    if (params.row.completed && params.row.endDate >= params.row.completionDate)
      return "completed-row";
    else if (
      params.row.completed &&
      params.row.endDate < params.row.completionDate
    )
      return "late-completion";

    if (daysDiff < 0) return "expired-row";
    if (daysDiff <= 1) return "critical-row";
    if (daysDiff <= 3) return "warning-row";
    if (daysDiff <= 5) return "alert-row";

    return "";
  };

  return (
    <Tab
      columns={columns}
      rows={rows}
      filter={filter}
      setFilter={setFilter}
      styles={columnsStyles}
      getRowClassName={getRowClassName}
    />
  );
};

export default TasksTab;
