import DetailOverview from "../Components/DetailOverview";
import GenericTable from "../Components/Global/GenericTable";
import { volunteeringColumnsForTeams as volunteeringColumns } from "../tableConfig/volunteeringConfig";
import GenericEditPage from "../Components/GenericEditPage";
import SelectAndCreatePage from "../Components/SelectAndCreatePage";
import { volunteeringFormFieldConfig } from "../config/volunteeringConfig";
import { volunteerColumns } from "../tableConfig/volunteerConfig";
import {
  getRowClassName,
  columnsStyles,
  tasksColumnsForTeam as tasksColumns,
} from "../tableConfig/taskConfig";

export const teamFormFieldConfig = [
  {
    name: "teamName",
    label: "Team Name",
    type: "text",
    gridSpan: "col-span-2",
    validation: { required: true },
  },
  {
    name: "description",
    label: "Team Description",
    type: "text",
    gridSpan: "col-span-2",
    validation: { required: true },
  },
];

export const teamFieldsConfig = {
  titleField: "teamName",
  subTitleField: "description",
  sections: [
    {
      group: "Overview",
      fields: [{ label: "Description", path: "description" }],
    },
    {
      group: "System Information",
      fields: [
        { label: "Created By", path: "userName" },
        { label: "Team ID", path: "teamId" },
        { label: "Created At", path: "createdAt", type: "date" },
        { label: "Last Updated", path: "updatedAt", type: "dateTime" },
        { label: "Updated By", path: "updatedByName" },
      ],
    },
  ],
};

export const teamTabsConfig = {
  titleField: "teamName",
  tabs: [
    {
      label: "General Details",
      path: "",
      component: DetailOverview,
      props: { config: teamFieldsConfig }, // Passes the fields config above to the overview
    },
    {
      label: "Volunteering",
      path: "volunteering",
      component: GenericTable,
      props: {
        columns: volunteeringColumns,

        apiEndpoint: "/teams/:id/volunteering",
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

        apiEndpoint: "/teams/:id/tasks",
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
      label: "Edit Team",
      path: "edit",
      component: GenericEditPage,
      props: {
        config: teamFormFieldConfig,
        apiEndpoint: "/teams",
        title: "Volunteer",
        redirectPath: "/teams",
      },
    },
    {
      label: "Add Volunteer",
      path: "volunteering/add",
      component: SelectAndCreatePage,
      props: {
        tableTitle: "Select Volunteer",
        tableEndpoint: "/volunteers",
        rowIdKey: "volunteerId",
        createTitle: "New Volunteering Assignment",
        createApiEndpoint: "/volunteering",
        tableColumns: volunteerColumns,
        createConfig: volunteeringFormFieldConfig,
        selectMappingKey: "volunteerId",

        paramMapping: {
          teamId: "id",
        },
        redirectPath: "/teams/:id",
        clearOnSuccess: false,
      },
    },
  ],
};
