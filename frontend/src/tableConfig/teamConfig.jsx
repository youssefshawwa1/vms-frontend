import { getGridStringOperators } from "@mui/x-data-grid";
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

export { teamsColumns };
