import DetailOverview from "../Components/DetailOverview";
import CertificateViewer from "../Components/CertificateViewer";
import GenericEditPage from "../Components/GenericEditPage";
import {
  getGridStringOperators,
  getGridDateOperators,
  getGridNumericOperators,
} from "@mui/x-data-grid";
export const certificateFormFields = [
  {
    name: "certificateTitle",
    label: "Certificiate Title",
    type: "text",
    gridSpan: "md:col-span-2",
    validation: { required: true },
  },
  {
    name: "certificateDescription",
    label: "Description",
    type: "text",
    gridSpan: "md:col-span-2",
    validation: {
      required: true,
    },
  },
  {
    name: "customMessage",
    label: "Appearing Text",
    type: "text",
    gridSpan: "md:col-span-2",
    validation: {
      required: true,
    },
  },
  {
    name: "certificateKind",
    label: "Kind",
    type: "select",
    options: ["withHours", "withoutHours"],
    gridSpan: "md:col-span-2",
    validation: { required: true },
  },
  {
    name: "certificateType",
    label: "Type",
    type: "select",
    options: ["appreciation", "achievvement", "recognition"],
    gridSpan: "md:col-span-2",
    validation: {
      required: true,
    },
  },
  {
    name: "volunteeringHours",
    label: "Hours",
    type: "number",
    gridSpan: "md:col-span-2",
    validation: {
      custom: (value, allValues) => {
        if (!value && allValues.certificateKind != "withHours") return null;
        if (!value && allValues.certificateKind) {
          return "This field is required";
        }
        if (allValues.certificateKind != "withHours" && value)
          return "Can't have value, its without hours";

        return null;
      },
    },
  },
];

export const certificateFieldConfig = {
  titleField: "certificateTitle",
  subTitleField: "certificateNumber",
  sections: [
    {
      group: "Certificate Overview",
      fields: [
        { label: "Certificate Number", path: "certificateNumber" },
        { label: "Description", path: "certificateDescription" },
        { label: "Certificate Type", path: "certificateType" },
        { label: "Certificate Kind", path: "certificateKind" },
        { label: "Custom Message", path: "customMessage" },
        { label: "Issue Date", path: "issueDate", type: "dateTime" },
        {
          label: "Volunteering Hours",
          path: "volunteeringHours",
          type: "number",
        },
        {
          label: "Total Hours at Issue",
          path: "totalHoursAtIssue",
          type: "number",
        },
      ],
    },
    {
      group: "Volunteer Details",
      fields: [
        { label: "First Name", path: "firstName" },
        { label: "Last Name", path: "lastName" },
        { label: "Email Address", path: "email" },
        { label: "Phone Number", path: "phone", type: "number" },
      ],
    },
    {
      group: "System & Communication",
      fields: [
        { label: "Issued By (User)", path: "userName" },
        { label: "Updated At", path: "updatedAt", type: "dateTime" },
        { label: "Emails Sent", path: "emailSendCount", type: "number" },
        {
          label: "First Email Sent",
          path: "firstEmailSentAt",
          type: "dateTime",
        },
        {
          label: "Last Email Sent",
          path: "lastEmailSentAt",
          type: "dateTime",
        },
      ],
    },
  ],
};
export const certificateTabConfig = {
  titleField: "certificateNumber",
  // subTitleField: "taskDescription",
  tabs: [
    {
      label: "General Details",
      path: "",

      component: DetailOverview,
      props: { config: certificateFieldConfig }, // Passes the fields config above to the overview
    },
    {
      label: "View Certificate",
      path: "view",
      component: CertificateViewer, // Use the specialized viewer here
      props: {}, // No extra config needed as it handles its own logiclds config above to the overview
    },
    {
      label: "Edit Certificate",
      path: "edit",
      component: GenericEditPage, // Use the wrapper, not just the form
      props: {
        config: certificateFormFields,
        apiEndpoint: "/certificates",
        title: "Certificates",
        redirectPath: "/certificates",
      },
    },
  ],
};

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
