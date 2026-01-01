import { getGridStringOperators } from "@mui/x-data-grid";
import { statusOperators } from "./filterHelper";
const usersColumns = [
  {
    field: "userId",
    headerName: "ID",
    width: 70,
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
  },
  {
    field: "userName",
    headerName: "Username",
    width: 100,
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
  },
  {
    field: "userEmail",
    headerName: "Email",
    width: 300,
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
  },
];
const usersColumnsForAdmin = [
  ...usersColumns,
  {
    field: "status",
    headerName: "Status",
    width: 90,
    type: "singleSelect",
    filterOperators: statusOperators,
    valueOptions: [
      { value: 1, label: "Active" },
      { value: 0, label: "In Active" },
    ],
    valueGetter: (value, row) => {
      return row.status?.data[0];
    },
    valueFormatter: (value) => {
      // value will be the boolean from your database
      return value ? "Active" : "In Active";
    },
  },
  {
    field: "view",
    headerName: "View",
    description: "This column is to View.",
    sortable: false,
    width: 100,
    // Use `valueGetter` to combine multiple values
    // renderCell: (params) => {
    //   // This is the key function
    //   return (
    //     <Link
    //       to={`${params.id}`}
    //       className="w-full h-full text-center flex justify-center items-center"
    //     >
    //       <View />
    //     </Link>
    //   );
    // },
  },
];

export { usersColumns, usersColumnsForAdmin };
