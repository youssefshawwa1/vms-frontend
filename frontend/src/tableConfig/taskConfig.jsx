import CompleteTaskAction from "../Components/CompleteTaskAction";
import { Box } from "@mui/material";
import {
  getGridStringOperators,
  getGridNumericOperators,
  getGridDateOperators,
} from "@mui/x-data-grid";
import { statusOperators } from "./filterHelper";
const tasksColumns = [
  {
    field: "taskId",
    headerName: "ID",
    width: 70,
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
  },

  {
    field: "taskTitle",
    headerName: "Task Title",
    width: 130,
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
  },
  {
    field: "taskDescription",
    headerName: "Description",
    width: 130,
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
  },
  {
    field: "startDate",
    headerName: "Start Date",
    width: 130,
    filterOperators: getGridDateOperators().filter(
      (op) =>
        op.value === "is" ||
        op.value === "onOrAfter" ||
        op.value === "onOrBefore"
    ),
    valueGetter: (value) =>
      value ? new Date(value).toLocaleDateString() : null,
  },
  {
    field: "endDate",
    headerName: "End Date",
    width: 130,
    filterOperators: getGridDateOperators().filter(
      (op) =>
        op.value === "is" ||
        op.value === "onOrAfter" ||
        op.value === "onOrBefore"
    ),
    valueGetter: (value) =>
      value ? new Date(value).toLocaleDateString() : null,
  },
  {
    field: "completed",
    headerName: "Status",
    width: 130,
    type: "singleSelect",
    filterOperators: statusOperators,
    valueOptions: [
      { value: 1, label: "Completed" },
      { value: 0, label: "In Progress" },
    ],
    valueGetter: (value, row) => {
      return row.completed?.data[0];
    },
    valueFormatter: (value) => {
      // value will be the boolean from your database
      return value ? "Completed" : "In Progress";
    },
  },

  {
    field: "completionDate",
    headerName: "Completed At",
    filterOperators: getGridDateOperators().filter(
      (op) =>
        op.value === "is" ||
        op.value === "onOrAfter" ||
        op.value === "onOrBefore"
    ),
    valueGetter: (value) =>
      value ? new Date(value).toLocaleDateString() : null,
    width: 130,
  },
  {
    field: "volunteeringHours",
    headerName: "Hours",
    width: 70,
    filterOperators: getGridNumericOperators()
      .filter((op) => ["=", ">=", "<="].includes(op.value))
      .map((op) => {
        if (op.value === ">=") return { ...op, label: "Greater or Equals" };
        if (op.value === "<=") return { ...op, label: "Less or Equals" };
        if (op.value === "=") return { ...op, label: "Equals" };
        return op;
      }),
  },
];
const tasksColumnsForVolunteer = [
  ...tasksColumns,
  {
    field: "teamName",
    headerName: "Team",
    width: 130,
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
  },
  {
    field: "volunteerTitle",
    headerName: "Title",
    width: 130,
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
  },
];
const tasksColumnsForTeam = [
  ...tasksColumns,
  {
    field: "volunteerTitle",
    headerName: "Title",
    width: 130,
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
  },
  {
    field: "fullName",
    headerName: "Full Name",
    width: 130,
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
    valueGetter: (value, row) => {
      return row.firstName + " " + row.lastName;
    },
  },
];
const tasksColumnsForTasks = [
  ...tasksColumns,
  {
    field: "volunteerTitle",
    headerName: "Title",
    width: 130,
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
  },
  {
    field: "volunteerName",
    headerName: "Full Name",
    width: 130,
    valueGetter: (value, row) => {
      return `${row.firstName} ${row.lastName} `;
    },
    filterOperators: getGridStringOperators().filter((op) => null),
  },
  {
    field: "teamName",
    headerName: "Team",
    width: 130,
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
  },
];
const columnsStyles = {
  // Global row styling for these specific classes
  "& .MuiDataGrid-row": {
    transition: "background-color 0.2s ease",
  },

  // 1. Expired (Past due) - Soft Gray
  "& .expired-row": {
    backgroundColor: "#f8f9fa",
    color: "#9e9e9e",
    "&:hover": { backgroundColor: "#f1f3f5" },
  },

  // 2. Critical (0-1 days left) - Soft Red
  "& .critical-row": {
    backgroundColor: "#ffebee", // Very light red
    color: "#c62828", // Deep red text for contrast
    fontWeight: "500",
    "&:hover": { backgroundColor: "#ffcdd2" },
  },

  // 3. Warning (2-3 days left) - Soft Orange
  "& .warning-row": {
    backgroundColor: "#fff3e0", // Light orange
    color: "#ef6c00", // Deep orange text
    "&:hover": { backgroundColor: "#ffe0b2" },
  },

  // 4. Alert (4-5 days left) - Soft Yellow/Amber
  "& .alert-row": {
    backgroundColor: "#fffde7", // Very light yellow
    color: "#f9a825", // Amber text
    "&:hover": { backgroundColor: "#fff9c4" },
  },

  // 5. Completed on time - Soft Emerald Green
  "& .completed-row": {
    backgroundColor: "#edf7ed", // Modern light green
    color: "#1b5e20", // Dark green text
    "&:hover": { backgroundColor: "#c8e6c9" },
  },

  // 6. Completed but late - Soft Teal/Blue-Gray
  "& .late-completion": {
    backgroundColor: "#f1f8e9", // Muted mint
    color: "#558b2f", // Muted olive/green text
    "&:hover": { backgroundColor: "#dcedc8" },
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
export {
  tasksColumnsForTasks,
  tasksColumnsForTeam,
  tasksColumnsForVolunteer,
  getRowClassName,
  columnsStyles,
};
