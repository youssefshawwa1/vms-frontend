import {
  getGridStringOperators,
  getGridNumericOperators,
  getGridDateOperators,
} from "@mui/x-data-grid";
import { statusOperators } from "./filterHelper";
const volunteeringColumns = [
  {
    field: "teamVolunteerId",
    headerName: "ID",
    width: 70,
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
  {
    field: "roleTitle",
    headerName: "Role Type",
    width: 120,
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
  },
  {
    field: "description",
    headerName: "Description",
    width: 130,
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
  },

  {
    field: "startDate",
    headerName: "Start Date",
    width: 100,
    type: "date",
    filterOperators: getGridDateOperators().filter(
      (op) =>
        op.value === "is" ||
        op.value === "onOrAfter" ||
        op.value === "onOrBefore"
    ),
    valueGetter: (value, row) => {
      return new Date(row.startDate);
    },
  },
  {
    field: "endDate",
    headerName: "End Date",
    width: 100,
    type: "date",
    filterOperators: getGridDateOperators().filter(
      (op) =>
        op.value === "is" ||
        op.value === "onOrAfter" ||
        op.value === "onOrBefore"
    ),
    valueGetter: (value, row) => {
      return row.endDate ? new Date(row.endDate) : "";
    },
  },
  {
    field: "active",
    headerName: "Status",
    width: 100,
    type: "singleSelect",
    filterOperators: statusOperators,
    valueOptions: [
      { value: 1, label: "Active" },
      { value: 0, label: "In Active" },
    ],
    valueGetter: (value, row) => {
      return row.active?.data[0];
    },
    valueFormatter: (value) => {
      // value will be the boolean from your database
      return value ? "Active" : "In Active";
    },
  },
];
const volunteeringColumnsForVolunteer = [
  ...volunteeringColumns,
  {
    field: "totalHours",
    headerName: "Total Hours",
    width: 130,
    type: "number",
    filterOperators: getGridNumericOperators()
      .filter((op) => ["=", ">=", "<="].includes(op.value))
      .map((op) => {
        if (op.value === ">=") return { ...op, label: "Greater or Equals" };
        if (op.value === "<=") return { ...op, label: "Less or Equals" };
        if (op.value === "=") return { ...op, label: "Equals" };
        return op;
      }),
    valueGetter: (value, row) => {
      return `${row.totalHours ? row.totalHours : 0} Hr`;
    },
  },
  {
    field: "totalTasks",
    headerName: "Total Tasks",
    width: 130,
    type: "number",
    filterOperators: getGridNumericOperators()
      .filter((op) => ["=", ">=", "<="].includes(op.value))
      .map((op) => {
        if (op.value === ">=") return { ...op, label: "Greater or Equals" };
        if (op.value === "<=") return { ...op, label: "Less or Equals" };
        if (op.value === "=") return { ...op, label: "Equals" };
        return op;
      }),
  },
  {
    field: "teamName",
    headerName: "Team",
    description: "This column is to View.",
    width: 100,
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
  },
];
const volunteeringColumnsForTeams = [
  ...volunteeringColumns,
  {
    field: "totalHours",
    headerName: "Total Hours",
    width: 130,
    type: "number",
    filterOperators: getGridNumericOperators()
      .filter((op) => ["=", ">=", "<="].includes(op.value))
      .map((op) => {
        if (op.value === ">=") return { ...op, label: "Greater or Equals" };
        if (op.value === "<=") return { ...op, label: "Less or Equals" };
        if (op.value === "=") return { ...op, label: "Equals" };
        return op;
      }),
    valueGetter: (value, row) => {
      return `${row.totalHours ? row.totalHours : 0} Hr`;
    },
  },
  {
    field: "totalTasks",
    headerName: "Total Tasks",
    width: 130,
    type: "number",
    filterOperators: getGridNumericOperators()
      .filter((op) => ["=", ">=", "<="].includes(op.value))
      .map((op) => {
        if (op.value === ">=") return { ...op, label: "Greater or Equals" };
        if (op.value === "<=") return { ...op, label: "Less or Equals" };
        if (op.value === "=") return { ...op, label: "Equals" };
        return op;
      }),
  },
  {
    field: "name",
    headerName: "Full Name",
    description: "This column is to View.",
    width: 120,
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
    valueGetter: (value, row) => {
      return row.fullName;
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: 130,
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
  },
  {
    field: "phone",
    headerName: "Phone",
    width: 130,
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
  },
];
const volunteeringColumnsForVolunteering = [
  ...volunteeringColumns,
  {
    field: "volunteerName",
    headerName: "Volunteer Name",
    width: 100,
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
  },

  {
    field: "teamName",
    headerName: "Team",
    width: 100,
    sortable: true,
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
  },
];

export {
  volunteeringColumnsForVolunteering,
  volunteeringColumnsForTeams,
  volunteeringColumnsForVolunteer,
};
