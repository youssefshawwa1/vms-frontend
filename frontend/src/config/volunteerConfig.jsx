import DetailOverview from "../Components/DetailOverview";
import GenericTable from "../Components/Global/GenericTable";
import { volunteeringColumnsForVolunteer as volunteeringColumns } from "../tableConfig/volunteeringConfig";
import { certificatesColumnsForVolunteer as certificatesColumns } from "../tableConfig/certificateConfig";
import GenericEditPage from "../Components/GenericEditPage";
import {
  tasksColumnsForVolunteer as tasksColumns,
  getRowClassName,
  columnsStyles,
} from "../tableConfig/taskConfig";
export const volunteerFormFieldConfig = [
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
    validation: { required: true },
  },

  // --- Contact Information ---
  {
    name: "email",
    label: "Email Address",
    type: "email",
    gridSpan: "md:col-span-1",
    validation: {
      required: true,
      pattern: /^\S+@\S+\.\S+$/,
    },
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "text",
    gridSpan: "md:col-span-1",
    validation: { required: true },
  },

  // --- Demographics ---
  {
    name: "birthDate",
    label: "Date of Birth",
    type: "date",
    gridSpan: "md:col-span-1",
    validation: { required: true },
  },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    options: ["Male", "Female", "Prefer not to say"],
    gridSpan: "md:col-span-1",
    validation: { required: true },
  },

  // --- Education (Full Width) ---
  {
    name: "major",
    label: "Major",
    type: "text",
    gridSpan: "md:col-span-1",
    validation: { required: true },
  },
  {
    name: "university",
    label: "University / Institution",
    type: "text",
    gridSpan: "md:col-span-1",
    validation: { required: true },
  },

  // --- Background ---
  {
    name: "residentCountry",
    label: "Country of Residence",
    type: "select",
    options: [
      "Lebanon",
      "Syria",
      "Egypt",
      "United Arab Emirates",
      "Palastine",
      "Other",
    ], // Add more as needed
    gridSpan: "md:col-span-1",
    validation: { required: true },
  },
  {
    name: "nationality",
    label: "Nationality",
    type: "text",
    gridSpan: "md:col-span-1",
    validation: { required: true },
  },
];

export const volunteerFieldsConfig = {
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
        { label: "Nationality", path: "nationality" },
        { label: "Resident Country", path: "residentCountry" },
      ],
    },
    {
      group: "Academic & Professional",
      fields: [
        { label: "University", path: "university" },
        { label: "Major", path: "major" },
      ],
    },
    {
      group: "System Information",
      fields: [
        { label: "Username", path: "userName" },
        { label: "Volunteer ID", path: "volunteerId" },
        { label: "Insertion Date", path: "insertionDate", type: "date" },
        { label: "Last Updated", path: "updatedAt", type: "dateTime" },
        { label: "Updated By", path: "updatedByName" },
      ],
    },
  ],
};

export const volunteerTabsConfig = {
  titleField: "firstName",
  subTitleField: "email",
  tabs: [
    {
      label: "General Details",
      path: "",
      component: DetailOverview,
      props: { config: volunteerFieldsConfig }, // Passes the fields config above to the overview
    },
    {
      label: "Volunteering History",
      path: "volunteering",
      component: GenericTable,
      props: {
        columns: volunteeringColumns,

        apiEndpoint: "/volunteers/:id/volunteering",
        title: "Volunteering",
        initialFilters: {
          items: [
            {
              id: 1,
              field: "active",
              operator: "is",
              value: 1,
            },
          ],
        },
        searchPlaceholder: "Search volunteering...",
        description:
          "Explore volunteering rules data, click on a row to show more details",
        rowId: "teamVolunteerId",
      },
    },
    {
      label: "Tasks",
      path: "tasks",
      component: GenericTable,
      props: {
        getRowClassName: getRowClassName,
        customStyles: columnsStyles,
        columns: tasksColumns,

        apiEndpoint: "/volunteers/:id/tasks",
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
      label: "Certificates",
      path: "certificates",
      component: GenericTable,
      props: {
        columns: certificatesColumns,

        apiEndpoint: "/volunteers/:id/certificates",
        title: "Certificates",
        searchPlaceholder: "Search certificates...",
        description:
          "Explore certificates rules data, click on a row to show more details",
        rowId: "certificateId",
      },
    },
    {
      label: "Edit Volunteer",
      path: "edit",
      component: GenericEditPage, // Use the wrapper, not just the form
      props: {
        config: volunteerFormFieldConfig,
        apiEndpoint: "/volunteers",
        title: "Volunteer",
        redirectPath: "/volunteers",
      },
    },
  ],
};
