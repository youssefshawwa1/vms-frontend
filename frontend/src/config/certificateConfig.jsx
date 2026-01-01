import DetailOverview from "../Components/DetailOverview";
import CertificateViewer from "../Components/CertificateViewer";
import GenericEditPage from "../Components/GenericEditPage";

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
