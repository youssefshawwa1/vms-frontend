import useFetching from "../../Hooks/useFetching";
import { useValidateForm, validators } from "../../Hooks/useValidateForm";
import { FormSubmitBtn, FormSectionGroup, FormSection } from "../Global/Form";
import { useMemo } from "react";
const TeamForm = ({ type, team, reFetch }) => {
  const validationRules = {
    teamName: validators.required("Team Name is required!"),
    description: validators.requiredAndLengthRange(
      30,
      1000,
      "Description is required!"
    ),
  };
  const initialData = {
    teamName: team ? team.teamName : "",
    description: team ? team.description : "",
  };
  const {
    formData,
    errors,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
  } = useValidateForm(initialData, validationRules);
  const { sendData } = useFetching();
  const structure = useMemo(
    () => [
      {
        label: "Team Name",
        error: errors.teamName,
        onChange: handleChange,
        value: formData.teamName,
        name: "teamName",
        holder: "Logistics...",
        onBlur: handleBlur,
        show: true,
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
      },
    ],
    [errors, formData, handleChange, handleBlur]
  );
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const data = {
        action: type ? type : "create",
        data: {
          userId: 1001,
          teamName: formData.teamName,
          description: formData.description,
          teamId: team ? team.id : "",
        },
      };
      await sendData("teams.php", data, reFetch ? reFetch : resetForm);
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off" className="fadeIn">
      <FormSectionGroup>
        <FormSection title="Team Information" data={structure} />
      </FormSectionGroup>
      <FormSubmitBtn text={type ? "Update Team" : "Add Team"} />
    </form>
  );
};
export default TeamForm;
