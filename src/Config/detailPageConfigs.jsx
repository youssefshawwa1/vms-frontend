// Config/volunteerDetailConfig.js
export const volunteerDetailConfig = {
  endpoint: "volunteers.php",
  dataType: "volunteer",
  filters: {
    tasks: "current",
    volunteering: "current",
    teams: "current",
  },

  transformCardData: (details) => ({
    label: `${details.firstName} ${details.lastName}`,
    description: details.description || "",
    lastItem: {
      label: "Volunteer ID:",
      text: details.id,
    },
    sections: [
      {
        label: "Personal Information",
        items: [
          { label: "First Name:", text: details.firstName },
          { label: "Last Name:", text: details.lastName },
          { label: "Birth Date:", text: details.birthDate },
          { label: "Gender:", text: details.gender },
        ],
      },
      {
        label: "Contact Info",
        items: [
          { label: "Email:", text: details.email },
          { label: "Phone:", text: details.phone },
        ],
      },
      {
        label: "Education Information",
        items: [
          {
            label: "University / School:",
            text: details.university,
          },
          { label: "Major:", text: details.major },
        ],
      },
      {
        label: "Location Information",
        items: [
          { label: "Nationality:", text: details.nationality },
          {
            label: "Resident Country:",
            text: details.residentCountry,
          },
        ],
      },
      {
        type: "last",
        items: [
          {
            type: "last",
            label: "Inserted:",
            text: details.insertionDate,
          },
          {
            type: "last",
            label: "By:",
            text: details.createdBy?.userName,
          },
          {
            type: "last",
            label: "Updated:",
            text: details.updatedAt,
          },
          {
            type: "last",
            label: "By:",
            text: details.updatedBy?.userName,
          },
        ],
      },
    ],
  }),

  updateStates: (response, contextValues, filters) => {
    const {
      setVolunteerTasks,
      setVolunteerTeams,
      setVolunteerVolunteering,
      setVolunteerCertificates,
      setVolunteerHours,
    } = contextValues;

    // Update tasks
    if (response.volunteerTasks && setVolunteerTasks) {
      setVolunteerTasks((prev) => ({
        ...prev,
        [filters.tasks || "current"]: response.volunteerTasks,
      }));
    }

    // Update teams
    if (response.volunteerTeams && setVolunteerTeams) {
      setVolunteerTeams((prev) => ({
        ...prev,
        [filters.teams || "current"]: response.volunteerTeams,
      }));
    }

    // Update volunteering
    if (response.volunteering && setVolunteerVolunteering) {
      setVolunteerVolunteering((prev) => ({
        ...prev,
        [filters.volunteering || "current"]: response.volunteering,
      }));
    }

    // Update certificates and hours
    if (response.certificates && setVolunteerCertificates) {
      setVolunteerCertificates(response.certificates);
    }

    if (response.volunteeringHours && setVolunteerHours) {
      setVolunteerHours(response.volunteeringHours);
    }
  },

  editNote:
    "Make sure to verify all personal information before saving changes.",

  formProps: {
    // Additional props for VolunteerForm if needed
  },
};
