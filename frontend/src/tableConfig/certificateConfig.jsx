import {
  getGridStringOperators,
  getGridDateOperators,
  getGridNumericOperators,
} from "@mui/x-data-grid";
import { statusOperators } from "./filterHelper";
const certificatesColumns = [
  {
    field: "certificateId",
    headerName: "ID",
    width: 70,
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
  },
  {
    field: "certificateNumber",
    headerName: "Number",
    width: 130,
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
  },
];
const certificatesColumnsPart2 = [
  {
    field: "certificateTitle",
    headerName: "Title:",
    width: 130,
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
  },
  {
    field: "issueDate",
    headerName: "Issue Date",
    width: 100,
    type: "date",
    filterOperators: getGridDateOperators().filter(
      (op) =>
        op.value === "is" ||
        op.value === "onOrAfter" ||
        op.value === "onOrBefore"
    ),
    valueGetter: (value) => (value ? new Date(value) : null),
  },
];
const certificatesColumnsPart3 = [
  {
    field: "volunteeringHours",
    headerName: "Hours",
    width: 100,
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
      return row.volunteeringHours || "N/A";
    },
  },
  {
    field: "certificateType",
    headerName: "Type",
    width: 100,
    type: "singleSelect",
    filterOperators: statusOperators,
    valueOptions: [
      { value: "appreciation", label: "Appretiatoin" },
      { value: "achievement", label: "Achievement" },
      { value: "recognition", label: "Recognition" },
    ],
  },
  {
    field: "certificateKind",
    headerName: "Kind",
    width: 100,
    type: "singleSelect",
    filterOperators: statusOperators,
    valueOptions: [
      { value: "withHours", label: "Hour Based" },
      { value: "withoutHours", label: "Normal" },
    ],
    valueFormatter: (value) => {
      return value == "withHours" ? "Hour Based" : "Normal";
    },
  },
  {
    field: "download",
    headerName: "Download",
    // description: "This column is to Add a task.",
    sortable: false,
    width: 80,
    // Use `valueGetter` to combine multiple values
    //   renderCell: (params) => {
    //     // This is the key function

    //     return (
    //       <button
    //         onClick={() => {
    //           handleDownload(params);
    //         }}
    //         className="w-full h-full text-center flex justify-center items-center"
    //       >
    //         <Download />
    //       </button>
    //     );
    //   },
  },

  {
    field: "view",
    headerName: "View",
    // description: "This column is to Add a task.",
    sortable: false,
    width: 80,
    // Use `valueGetter` to combine multiple values
    // renderCell: (params, row) => {
    //   // This is the key function

    //   return (
    //     <Link
    //       to={`/certificates/${params.id}`}
    //       onClick={() => {
    //         // handleAddTask(params.row);
    //       }}
    //       className="w-full h-full text-center flex justify-center items-center"
    //     >
    //       <View />
    //     </Link>
    //   );
    // },
  },
];
const certificatesColumnsForCertificates = [
  ...certificatesColumns,

  {
    field: "fullName",
    headerName: "Volunteer Name:",
    width: 130,
    filterOperators: null,
    valueGetter: (value, row) => {
      return `${row.firstName} ${row.lastName}`;
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: 100,
    filterOperators: null,
  },
  {
    field: "phone",
    headerName: "Phone",
    filterOperators: null,
    width: 100,
  },
  ...certificatesColumnsPart2,
  ...certificatesColumnsPart3,
];
const certificatesColumnsForVolunteer = [
  ...certificatesColumns,
  ...certificatesColumnsPart2,
  {
    field: "certificateDescription",
    headerName: "Description",
    width: 100,
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
  },
  {
    field: "customMessage",
    headerName: "Appearing Description",
    filterOperators: getGridStringOperators().filter(
      (op) => op.value === "equals"
    ),
    width: 100,
  },
  {
    field: "totalHoursAtIssue",
    headerName: "At Issue Hours",
    width: 100,
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
      return row.volunteeringHours || "N/A";
    },
  },
  ...certificatesColumnsPart3,
];

export { certificatesColumnsForVolunteer, certificatesColumnsForCertificates };
