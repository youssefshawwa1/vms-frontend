import { useState, useEffect, useMemo } from "react";
import useFetching from "../../Hooks/useFetching";
import { FormSubmitBtn, FormSectionGroup, FormSection } from "../Global/Form";
import { useValidateForm, validators } from "../../Hooks/useValidateForm";
const VolunteeringForm = ({ volunteeringDetails, callBack, type }) => {
  const [complete, setComplete] = useState(false);
  const validationRules = {
    volunteerTitle: validators.required(),
    startDate: validators.required(),
    roleId: validators.required(),
    description: validators.requiredAndLengthRange(
      30,
      1000,
      "Description is required!"
    ),
  };
  const initialData = {
    volunteerTitle: volunteeringDetails?.volunteerTitle || "",
    startDate: volunteeringDetails?.startDate || "",
    roleId: volunteeringDetails?.role || "",
    description: volunteeringDetails?.description || "",
    endDate: volunteeringDetails?.endDate || "",
    teamId: volunteeringDetails?.team?.teamId || "",
    volunteerId: volunteeringDetails?.volunteer?.volunteerId || "",
    teamVolunteerId: volunteeringDetails?.id || "",
  };

  const {
    formData,
    errors,
    handleChange,
    handleBlur,
    validateForm,
    clearFieldError,
    updateField,
    resetForm,
  } = useValidateForm(initialData, validationRules);

  const { fetchData, sendData } = useFetching();

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
    if (volunteeringDetails.endDate) setComplete(true);
  }, []);

  const structure = useMemo(
    () => [
      {
        label: "Volunteering Title",
        error: errors.volunteerTitle,
        onChange: handleChange,
        value: formData.volunteerTitle,
        name: "volunteerTitle",
        holder: "Coordinator...",
        onBlur: handleBlur,
        show: true,
      },
      {
        label: "Role Type",
        error: errors.roleId,
        onChange: handleChange,
        value: formData.roleId,
        name: "roleId",
        onBlur: handleBlur,
        options: roles,
        show: true,
        type: "selection",
      },
      {
        label: "Description",
        error: errors.description,
        onChange: handleChange,
        value: formData.description,
        name: "description",
        holder: "Some Description...",
        onBlur: handleBlur,
        show: true,
        type: "textarea",
      },
      {
        label: "Start Date",
        error: errors.startDate,
        onChange: handleChange,
        value: formData.startDate,
        name: "startDate",
        onBlur: handleBlur,
        show: true,
        type: "date",
      },
      {
        checked: complete,
        label: "End Volunteering",
        setChecked: (newValue) => {
          setComplete(newValue);
          clearFieldError("endDate");
          if (!newValue) {
            updateField("endDate", "");
          }
        },
        show: true,
        type: "checkbox",
      },
      {
        label: "End Date",
        error: errors.endDate,
        onChange: handleChange,
        value: formData.endDate,
        name: "endDate",
        onBlur: handleBlur,
        show: complete,
        type: "date",
      },
    ],
    [
      errors,
      complete,
      formData,
      handleChange,
      handleBlur,
      clearFieldError,
      updateField,
    ]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    complete
      ? (validationRules.endDate = () => {
          if (!formData.endDate) return "This field is required";
          else if (new Date(formData.endDate) > new Date())
            return "Can't be in the Future!";
          else if (new Date(formData.endDate) < new Date(formData.startDate))
            return "Can't be before Start Date!";
        })
      : validationRules.endDate ?? delete validationRules.endDate;
    if (validateForm()) {
      const data = {
        action: type ? "updateVolunteering" : "addVolunteering",
        data: {
          userId: 1001,
          teamId: formData.teamId,
          volunteerId: formData.volunteerId,
          volunteerTitle: formData.volunteerTitle,
          startDate: formData.startDate,
          roleId: formData.roleId,
          description: formData.description,
          teamVolunteerId: formData.teamVolunteerId,
          endDate: complete == true ? formData.endDate : "",
        },
      };
      console.log(volunteeringDetails);
      await sendData("teams.php", data, type ? callBack : resetForm);
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <FormSectionGroup>
        <FormSection title="Volunteering Information" data={structure} />
      </FormSectionGroup>
      <FormSubmitBtn text={type ? "Update Volunteering" : "Add Volunteering"} />
    </form>
  );
};
export default VolunteeringForm;
