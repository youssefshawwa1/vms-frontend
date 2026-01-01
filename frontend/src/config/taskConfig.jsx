import DetailOverview from "../Components/DetailOverview";
import GenericEditPage from "../Components/GenericEditPage";
import CompleteTaskAction from "../Components/CompleteTaskAction";
export const taskFormFields = [
  {
    name: "taskTitle",
    label: "Task Title",
    type: "text",
    gridSpan: "md:col-span-1",
    validation: { required: true },
  },
  {
    name: "startDate",
    label: "Start Date",
    type: "date",
    gridSpan: "md:col-span-1",
    validation: {
      required: true,
    },
  },
  {
    name: "endDate",
    label: "End Date",
    type: "date",
    gridSpan: "md:col-span-1",
    validation: {
      required: true,
    },
  },
  {
    name: "volunteeringHours",
    label: "Volunteering Hours",
    type: "number",
    gridSpan: "md:col-span-2",
    validation: { required: true },
  },
  {
    name: "taskDescription",
    label: "Description",
    type: "text",
    gridSpan: "md:col-span-2",
    validation: { required: true },
  },
  {
    name: "completed",
    label: "Is this Task Completed?",
    type: "checkbox",
    gridSpan: "md:col-span-2",
    validation: {
      custom: (value, allValues) => {
        if (!value && !allValues.completionDate) return null;
        if (!value && allValues.completionDate) {
          return "This field is required";
        }

        return null;
      },
    },
  },
  {
    name: "completionDate",
    label: "Completed At (If Completed)",
    type: "date",
    gridSpan: "md:col-span-2",
    validation: {
      custom: (value, allValues) => {
        // 1. If either date is missing, skip this specific check
        // (Let the 'required' validation handle empty states)
        if (!value && !allValues.completed) return null;
        console.log(value, allValues.completed);
        if (!value && allValues.completed) {
          return "This field is required";
        }
        const start = new Date(allValues.startDate);
        const completed = new Date(value);

        // 2. The Error Condition: End Date is before Start Date
        if (completed < start) {
          return "Completion Date cannot be earlier than the Start Date";
        }

        // 3. Keep your previous logic: If inactive, End Date is required

        return null;
      },
    },
  },
];

export const taskFieldConfig = {
  titleField: "taskTitle",
  subTitleField: "taskDescription",
  sections: [
    {
      group: "Overview",
      fields: [
        { label: "Description", path: "taskDescription" },
        { label: "Start Date", path: "startDate", type: "dateTime" },
        { label: "End Date", path: "endDate", type: "dateTime" },
        {
          label: "Volunteering Hours",
          path: "volunteeringHours",
          type: "number",
        },
        { label: "Completion Date", path: "completionDate", type: "dateTime" },
      ],
    },
    {
      group: "Volunteering Details",
      fields: [
        { label: "Title", path: "volunteerTitle" },
        { label: "First Name", path: "firstName" },
        { label: "Last Name", path: "lastName" },
        { label: "Email", path: "lastName" },
        { label: "Phone", path: "phone" },
        { label: "Team Name", path: "teamName" },
        { label: "Completed", path: "completed" },
        { label: "Role Title", path: "roleTitle" },
      ],
    },
    {
      group: "System Information",
      fields: [
        { label: "Created By", path: "createdByName" },
        { label: "Created At", path: "createdAt", type: "dateTime" },
        { label: "Updated By", path: "updatedByName" },
        { label: "Updated At", path: "updatedAt", type: "dateTime" },
      ],
    },
  ],
};

export const taskTabsConfig = {
  titleField: "taskTTitle",
  // subTitleField: "taskDescription",
  tabs: [
    {
      label: "General Details",
      path: "",

      component: DetailOverview,
      props: { config: taskFieldConfig, actions: [CompleteTaskAction] }, // Passes the fields config above to the overview
    },

    {
      label: "Edit Task",
      path: "edit",
      component: GenericEditPage,
      props: {
        config: taskFormFields,
        apiEndpoint: "/tasks",
        title: "Task",
        redirectPath: "/tasks",
        // Pass the action here
      },
    },
  ],
};
