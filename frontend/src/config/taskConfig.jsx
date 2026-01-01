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
      custom: (value, allValues) => {
        // 1. If either date is missing, skip this specific check
        // (Let the 'required' validation handle empty states)
        if (!value) return "Start Date Field is Required";

        const start = new Date(allValues.startDate);
        const end = new Date(value);

        // 2. The Error Condition: End Date is before Start Date
        if (end < start) {
          return "End Date cannot be earlier than the Start Date";
        }

        // 3. Keep your previous logic: If inactive, End Date is required

        return null;
      },
    },
  },
  {
    name: "endDate",
    label: "End Date",
    type: "date",
    gridSpan: "md:col-span-1",
    validation: {
      required: true, // Tasks usually need an end date
      custom: (value, allValues) => {
        if (!value || !allValues.startDate) return null;

        const start = new Date(allValues.startDate);
        const end = new Date(value);

        if (end < start) {
          return "End Date cannot be earlier than the Start Date";
        }
        return null;
      },
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
