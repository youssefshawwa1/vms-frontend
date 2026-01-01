import { getGridStringOperators, getGridDateOperators } from "@mui/x-data-grid";
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

export { volunteerColumns };
