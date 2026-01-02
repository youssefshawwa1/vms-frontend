import { getGridStringOperators } from "@mui/x-data-grid";
import { statusOperators } from "./filterHelper";
import DetailOverview from "../Components/DetailOverview";
import GenericEditPage from "../Components/GenericEditPage";
import { taskFieldConfig } from "./taskConfig";
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

export const userFieldsConfig = {
  titleField: "userName",
  subTitleField: "userEmail",
  sections: [
    {
      group: "Overview",
      fields: [
        { label: "First Name", path: "firstName" },
        { label: "Last Name", path: "lastName" },
        { label: "Active", path: "status" },
      ],
    },
    {
      group: "System Information",
      fields: [
        { label: "ID", path: "userId" },
        { label: "Created At", path: "createdAt", type: "dateTime" },
        { label: "Last Updated", path: "updatedAt", type: "dateTime" },
      ],
    },
  ],
};
export const userFormFieldConfigForCreate = [
  {
    name: "userName",
    label: "Username",
    type: "text",
    gridSpan: "md:col-span-1",
    validation: { required: true },
  },
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    gridSpan: "md:col-span-1",
    validation: { required: true },
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    gridSpan: "md:col-span-1",
    validation: {
      required: true,
    },
  },
  {
    name: "userEmail",
    label: "Email",
    type: "email",
    gridSpan: "md:col-span-1",
    validation: { required: true },
  },
  {
    name: "passwordHash",
    label: "Password",
    type: "password",
    gridSpan: "md:col-span-2",
    validation: {
      custom: (value, allValues) => {
        if (!value) return "Required!";
        if (value !== allValues.confirmPassword) return "Didnt Match!";
        if (value.length < 8 || value.length > 32)
          return "Password must be 8 chars more";
        if (!value || value == "") {
          return "Password is required!";
        }

        return null;
      },
    },
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    gridSpan: "md:col-span-2",
    validation: {
      custom: (value, allValues) => {
        if (!value) return "Required!";
        if (value !== allValues.passwordHash) return "Didnt Match!";
        if (value.length < 8 || value.length > 32)
          return "Password must be 8 chars more";
        if (!value || value == "") {
          return "Password is required!";
        }

        return null;
      },
    },
  },
  {
    name: "active",
    label: "Is Currently Active?",
    type: "checkbox",
    gridSpan: "md:col-span-2", // Spans full width or md:col-span-1 to sit next to date
    validation: { required: false },
  },
];
export const userFormFieldConfigForEditForUser = [
  {
    name: "userName",
    label: "Username",
    type: "text",
    gridSpan: "md:col-span-1",
    validation: { required: true },
  },
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    gridSpan: "md:col-span-1",
    validation: { required: true },
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    gridSpan: "md:col-span-1",
    validation: {
      required: true,
    },
  },
  {
    name: "userEmail",
    label: "Email",
    type: "email",
    gridSpan: "md:col-span-1",
    validation: { required: true },
  },
  {
    name: "oldPassword",
    label: "Old Password",
    type: "password",
    gridSpan: "md:col-span-2",
    validation: {
      custom: (value, allValues) => {
        if (!value) return "Required!";
        if (!value || value == "") {
          return "Password is required!";
        }
        if (value.length < 8 || value.length > 32)
          return "Password must be 8 chars more";

        return null;
      },
    },
  },
  {
    name: "passwordHash",
    label: "New Password",
    type: "password",
    gridSpan: "md:col-span-2",
    validation: {
      custom: (value, allValues) => {
        if (!value) return "Required!";
        if (value !== allValues.confirmPassword) return "Didnt Match!";
        if (value.length < 8 || value.length > 32)
          return "Password must be 8 chars more";
        if (!value || value == "") {
          return "Password is required!";
        }

        return null;
      },
    },
  },
  {
    name: "confirmPassword",
    label: "Confirm New Password",
    type: "password",
    gridSpan: "md:col-span-2",
    validation: {
      custom: (value, allValues) => {
        if (!value) return "Required!";
        if (value !== allValues.passwordHash) return "Didnt Match!";
        if (value.length < 8 || value.length > 32)
          return "Password must be 8 chars more";
        if (!value || value == "") {
          return "Password is required!";
        }

        return null;
      },
    },
  },
  {
    name: "active",
    label: "Is Currently Active?",
    type: "checkbox",
    gridSpan: "md:col-span-2", // Spans full width or md:col-span-1 to sit next to date
    validation: { required: false },
  },
];
export const userFormFieldConfigForEditForAdmin = [
  {
    name: "userName",
    label: "Username",
    type: "text",
    gridSpan: "md:col-span-1",
    validation: { required: true },
  },
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    gridSpan: "md:col-span-1",
    validation: { required: true },
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    gridSpan: "md:col-span-1",
    validation: {
      required: true,
    },
  },
  {
    name: "userEmail",
    label: "Email",
    type: "email",
    gridSpan: "md:col-span-1",
    validation: { required: true },
  },
  {
    name: "passwordHash",
    label: "New Password",
    type: "password",
    gridSpan: "md:col-span-2",
    validation: {
      custom: (value, allValues) => {
        if (!value && !allValues.confirmPassword) return null;
        if (value !== allValues.confirmPassword) return "Didnt Match!";
        if (value.length < 8 || value.length > 32)
          return "Password must be 8 chars more";
        if (!value || value == "") {
          return "Password is required!";
        }

        return null;
      },
    },
  },
  {
    name: "confirmPassword",
    label: "Confirm New Password",
    type: "password",
    gridSpan: "md:col-span-2",
    validation: {
      custom: (value, allValues) => {
        if (!value && !allValues.passwordHash) return null;
        if (value !== allValues.passwordHash) return "Didnt Match!";
        if (value.length < 8 || value.length > 32)
          return "Password must be 8 chars more";
        if (!value || value == "") {
          return "Password is required!";
        }

        return null;
      },
    },
  },
  {
    name: "status",
    label: "Is Currently Active?",
    type: "checkbox",
    gridSpan: "md:col-span-2", // Spans full width or md:col-span-1 to sit next to date
    validation: { required: false },
  },
];
export const userTabsConfig = {
  titleField: "userName",
  tabs: [
    {
      label: "General Details",
      path: "",
      component: DetailOverview,
      props: { config: userFieldsConfig }, // Passes the fields config above to the overview
    },
    {
      label: "Edit User",
      path: "edit",
      component: GenericEditPage,
      props: {
        config: userFormFieldConfigForEditForAdmin,
        apiEndpoint: "/users",
        title: "Volunteer",
        redirectPath: "/users",
      },
    },
  ],
};
