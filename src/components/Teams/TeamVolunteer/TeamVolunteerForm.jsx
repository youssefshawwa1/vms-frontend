import { useState, useEffect } from "react";
import useFetching from "../../Global/Helpers/useFetching";
import {
  Input,
  FormSubmitBtn,
  FormSectionGroup,
  FormSection,
  SelectInput,
  CheckBox,
} from "../../Global/Form";

const TeamVolunteerForm = ({ volunteeringDetails, callBack, type }) => {
  const { fetchData, sendData } = useFetching();
  const [formData, setFormData] = useState({
    volunteerTitle: volunteeringDetails.volunteerTitle
      ? volunteeringDetails.volunteerTitle
      : "",
    startDate: volunteeringDetails.startDate
      ? volunteeringDetails.startDate
      : "",
    roleId: volunteeringDetails.role ? volunteeringDetails.role.roleId : "",
    description: volunteeringDetails.description
      ? volunteeringDetails.description
      : "",
    endDate: volunteeringDetails.endDate ? volunteeringDetails.endDate : "",
  });
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      const d = await fetchData("roles.php");
      setRoles(() => [
        {
          text: "Select Type",
          value: "",
        },
        ...d.map((role) => ({
          text: role.roleTitle,
          value: role.id,
        })),
      ]);
    };
    fetchRoles();
  }, []);
  const [complete, setComplete] = useState(false);

  const [errors, setErrors] = useState({});
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length === 0) {
      const data = {
        action: type ? "updateVolunteering" : "addVolunteering",
        data: {
          userId: 1001,
          teamId: volunteeringDetails.teamId ? volunteeringDetails.teamId : "",
          volunteerId: volunteeringDetails.volunteerId
            ? volunteeringDetails.volunteerId
            : "",
          volunteerTitle: formData.volunteerTitle,
          startDate: formData.startDate,
          roleId: formData.roleId,
          description: formData.description,
          teamVolunteerId: volunteeringDetails.id ? volunteeringDetails.id : "",
          endDate: complete == true ? formData.endDate : "",
        },
      };
      await sendData("teams.php", data, callBack);
    } else {
      setErrors(formErrors);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.volunteerTitle.trim())
      newErrors.volunteerTitle = "Volunteer title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (complete) {
      if (!formData.endDate) newErrors.endDate = "End Date is Required!";
      else if (formData.endDate < formData.startDate)
        newErrors.endDate = "Inserted Date is before the start Date!";
    }

    if (!formData.roleId) newErrors.roleId = "Role type is required";
    return newErrors;
  };
  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <FormSectionGroup>
        <FormSection title="Volunteering Information">
          <Input
            label="Volunteering Title"
            error={errors.volunteerTitle}
            onChange={handleChange}
            value={formData.volunteerTitle}
            name="volunteerTitle"
            holder="Coordinator..."
          />
          <SelectInput
            label="Role Type"
            value={formData.roleId}
            onChange={handleChange}
            error={errors.roleId}
            options={roles}
            name={"roleId"}
          ></SelectInput>
          <Input
            label="Description"
            error={errors.description}
            onChange={handleChange}
            value={formData.description}
            name="description"
            type="textarea"
            holder="Some Description"
          />
          <Input
            label="Start Date"
            error={errors.startDate}
            onChange={handleChange}
            value={formData.startDate}
            name="startDate"
            type="date"
          />

          <CheckBox
            checked={complete}
            setChecked={setComplete}
            ifChecked={() => {
              if (complete) {
                errors.endDate = "";
              }
            }}
            label="End Volunteering"
          />
          {complete && (
            <Input
              label="End Date"
              error={errors.endDate}
              onChange={handleChange}
              value={formData.endDate}
              name="endDate"
              type="date"
            />
          )}
        </FormSection>
      </FormSectionGroup>
      <FormSubmitBtn text={type ? "Update Volunteering" : "Add Volunteering"} />
    </form>
  );
};
export default TeamVolunteerForm;
