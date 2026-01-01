import DetailOverview from "../Components/DetailOverview";
import GenericTable from "../Components/Global/GenericTable";
import GenericEditPage from "../Components/GenericEditPage";
import GenericCreatePage from "../Components/GenericCreatePage";
import { taskFormFields } from "./taskConfig";
import {
  tasksColumnsForVolunteer as tasksColumns,
  getRowClassName,
  columnsStyles,
} from "../tableConfig/taskConfig";
export const volunteeringFormFieldConfig = [
  {
    name: "volunteerTitle",
    label: "Volunteering Title",
    type: "text",
    gridSpan: "md:col-span-1",
    validation: { required: true },
  },
  {
    name: "roleId",
    label: "Role Type",
    type: "select",
    options: [], // We will fill this dynamically
    gridSpan: "md:col-span-1",
    validation: { required: true },
  },
  {
    name: "startDate",
    label: "Start Date",
    type: "date",
    gridSpan: "md:col-span-1",
    validation: { required: true },
  },
  {
    name: "endDate",
    label: "End Date",
    type: "date",
    gridSpan: "md:col-span-1",
    validation: {
      custom: (value, allValues) => {
        // 1. If either date is missing, skip this specific check
        // (Let the 'required' validation handle empty states)
        if (!value || !allValues.startDate) return null;

        const start = new Date(allValues.startDate);
        const end = new Date(value);

        // 2. The Error Condition: End Date is before Start Date
        if (end < start) {
          return "End Date cannot be earlier than the Start Date";
        }

        // 3. Keep your previous logic: If inactive, End Date is required
        if (allValues.active === true && !value) {
          return "End Date is required if status is Inactive";
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
  {
    name: "description",
    label: "Description",
    type: "text",
    gridSpan: "md:col-span-2",
    validation: { required: true },
  },
];

const Combonentsss = (props) => {
  console.log(props);
  return <h1>creating a task for this one</h1>;
};
export const volunteeringFieldsConfig = {
  titleField: "firstName",
  subTitleField: "email",
  sections: [
    {
      group: "Personal Details",
      fields: [
        { label: "First Name", path: "firstName" },
        { label: "Last Name", path: "lastName" },
        { label: "Gender", path: "gender" },
        { label: "Birth Date", path: "birthDate", type: "date" },
        { label: "Phone", path: "phone" },
      ],
    },
    {
      group: "Volunteering Details",
      fields: [
        { label: "Volunteering Title", path: "volunteerTitle" },
        { label: "Volunteering Descriptoin", path: "description" },
        { label: "Role Title", path: "roleTitle" },
        { label: "Role Description", path: "roleDescription" },
        { label: "Status", path: "active" },
      ],
    },
    {
      group: "System Information",
      fields: [
        { label: "Created By", path: "userName" },
        { label: "Insertion Date", path: "insertionDate", type: "date" },
        { label: "Last Updated", path: "updatedAt", type: "dateTime" },
        { label: "Updated By", path: "updatedByName" },
        { label: "Volunteering Id", path: "teamVolunteerId" },
        { label: "Volunteer Id", path: "volunteerId" },
        { label: "Team Id", path: "teamId" },
      ],
    },
  ],
};

export const volunteeringTabsConfig = {
  titleField: "firstName",
  subTitleField: "email",
  tabs: [
    {
      label: "General Details",
      path: "",
      component: DetailOverview,
      props: { config: volunteeringFieldsConfig }, // Passes the fields config above to the overview
    },

    {
      label: "Tasks",
      path: "tasks",
      component: GenericTable,
      props: {
        getRowClassName: getRowClassName,
        customStyles: columnsStyles,
        columns: tasksColumns,

        apiEndpoint: "/volunteering/:id/tasks",
        title: "Tasks",
        initialFilters: {
          items: [
            {
              id: 1,
              field: "completed",
              operator: "is",
              value: false,
            },
          ],
        },
        searchPlaceholder: "Search Tasks...",
        description:
          "Explore Tasks rules data, click on a row to show more details",
        rowId: "taskId",
      },
    },
    {
      label: "Edit Volunteering",
      path: "edit",
      component: GenericEditPage, // Use the wrapper, not just the form
      props: {
        config: volunteeringFormFieldConfig,
        apiEndpoint: "/volunteering",
        title: "Volunteering",
        redirectPath: "/volunteering",
      },
    },
    {
      label: "Add Task",
      path: "create",
      component: GenericCreatePage, // Use the wrapper, not just the form
      props: {
        title: "Volunteer",
        config: taskFormFields,
        apiEndpoint: "/volunteering/:id/tasks",
        redirectPath: "/volunteering",
        paramMapping: {
          teamVolunteerId: "id",
        },
        clearOnSuccess: true,
      },
    },
  ],
};
