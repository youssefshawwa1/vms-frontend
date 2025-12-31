import {
  getGridStringOperators,
  getGridNumericOperators,
  getGridDateOperators,
} from "@mui/x-data-grid";
const volunteerColumns = [
  {
    field: "volunteerId",
    headerName: "ID",
    width: 70,
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
  },
  {
    field: "firstName",
    headerName: "First name",
    width: 100,
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
  },
  {
    field: "lastName",
    headerName: "Last name",
    width: 100,
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
  },
  {
    field: "email",
    headerName: "Email",
    width: 200,
    sortable: true,
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
  },
  {
    field: "phone",
    headerName: "Phone",
    width: 100,
    sortable: true,
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
  },
  {
    field: "birthDate",
    headerName: "Birth Date",
    width: 100,
    sortable: true,
    type: "date",
    filterOperators: getGridDateOperators().filter(
      (op) =>
        op.value === "is" ||
        op.value === "onOrAfter" ||
        op.value === "onOrBefore"
    ),
    valueGetter: (value) => (value ? new Date(value) : null),
  },
  {
    field: "gender",
    headerName: "Gender",
    width: 80,
    sortable: true,
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
  },
  {
    field: "major",
    headerName: "Major",
    width: 100,
    sortable: true,
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
  },
  {
    field: "university",
    headerName: "University",
    width: 100,
    sortable: true,
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
  },
];
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
    filterOperators: getGridDateOperators().filter(
      (op) =>
        op.value === "is" ||
        op.value === "onOrAfter" ||
        op.value === "onOrBefore"
    ),
    valueGetter: (value, row) => {
      return new Date(row.startDate).toLocaleDateString();
    },
  },
  {
    field: "endDate",
    headerName: "End Date",
    width: 100,
    filterOperators: getGridDateOperators().filter(
      (op) =>
        op.value === "is" ||
        op.value === "onOrAfter" ||
        op.value === "onOrBefore"
    ),
    valueGetter: (value, row) => {
      return row.endDate ? new Date(row.endDate).toLocaleDateString() : "";
    },
  },
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
        if (op.value === ">=") return { ...op, label: "From" };
        if (op.value === "<=") return { ...op, label: "To" };
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
        if (op.value === ">=") return { ...op, label: "From" };
        if (op.value === "<=") return { ...op, label: "To" };
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
        if (op.value === ">=") return { ...op, label: "From" };
        if (op.value === "<=") return { ...op, label: "To" };
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
        if (op.value === ">=") return { ...op, label: "From" };
        if (op.value === "<=") return { ...op, label: "To" };
        if (op.value === "=") return { ...op, label: "Equals" };
        return op;
      }),
  },
  {
    field: "active",
    headerName: "Status",
    width: 60,
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
    valueGetter: (value, row) => {
      if (row.active) {
        return "Active";
      }

      return "Not Active";
    },
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
const teamsColumns = [
  {
    field: "teamId",
    headerName: "ID",
    width: 70,
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
  },
  {
    field: "teamName",
    headerName: "Team Name",
    width: 130,
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
  },
  {
    field: "description",
    headerName: "description",
    width: 400,
    sortable: true,
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
  },
];
export {
  volunteerColumns,
  volunteeringColumnsForTeams,
  volunteeringColumnsForVolunteer,
  teamsColumns,
  volunteeringColumnsForVolunteering,
};
