import { useMemo, useState } from "react";
import useFetching from "../../Hooks/useFetching";
import { FormSubmitBtn, FormSectionGroup, FormSection } from "../Global/Form";
import { useValidateForm, validators } from "../../Hooks/useValidateForm";
const TaskForm = ({ teamVolunteerId, callBack, type }) => {
  const validationRules = {
    taskTitle: validators.required(),
    taskDescription: validators.required(),
    startDate: validators.required(),
    endDate: validators.required(),
    volunteeringHours: (value) => {
      if (value <= 0) {
        return "Must be at leat 1 hour per task!";
      } else if (value > 15) {
        return "Must be at max 15 Hour per task!";
      }
    },
  };
  const initialData = {
    taskTitle: "",
    taskDescription: "",
    startDate: "",
    endDate: "",
    volunteeringHours: 1,
    completed: "",
    completionDate: "",
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

  const { sendData } = useFetching();
  const [complete, setComplete] = useState(false);

  const structure = useMemo(
    () => [
      {
        label: "Task Title",
        error: errors.taskTitle,
        onChange: handleChange,
        value: formData.taskTitle,
        name: "taskTitle",
        holder: "Create a document...",
        onBlur: handleBlur,
        show: true,
      },
      {
        label: "Description",
        error: errors.taskDescription,
        onChange: handleChange,
        value: formData.taskDescription,
        name: "taskDescription",
        holder: "Some Description..",
        onBlur: handleBlur,
        show: true,
      },
      {
        label: "Start Date",
        error: errors.startDate,
        onChange: handleChange,
        value: formData.startDate,
        name: "startDate",
        type: "date",
        onBlur: handleBlur,
        show: true,
      },
      {
        label: "End Date",
        error: errors.endDate,
        onChange: handleChange,
        value: formData.endDate,
        name: "endDate",
        type: "date",
        onBlur: handleBlur,
        show: true,
      },

      {
        label: "Volunteering Hours",
        error: errors.volunteeringHours,
        onChange: handleChange,
        value: formData.volunteeringHours,
        name: "volunteeringHours",
        type: "number",
        onBlur: handleBlur,
        show: true,
      },
      {
        label: "Completion Date",
        error: errors.completionDate,
        onChange: handleChange,
        value: formData.completionDate,
        name: "completionDate",
        type: "date",
        onBlur: handleBlur,
        show: complete,
      },
      {
        checked: complete,
        label: "Completed Task",
        setChecked: (newValue) => {
          setComplete(newValue);
          // clearFieldError("completionDate");
          if (!newValue) {
            updateField("completionDate", "");
          }
          validationRules.completionDate = validationRules.required();
        },
        show: true,
        type: "checkbox",
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
    const currentValidationRules = { ...validationRules };
    complete
      ? (currentValidationRules.completionDate = validators.required())
      : validationRules.currentValidationRules ??
        delete validationRules.completionDate;

    if (validateForm()) {
      const data = {
        action: "addTask",
        data: {
          userId: 1001,
          taskTitle: formData.taskTitle,
          taskDescription: formData.taskDescription,
          startDate: formData.startDate,
          endDate: formData.endDate,
          volunteeringHours: formData.volunteeringHours,
          teamVolunteerId: teamVolunteerId,
          completed: complete,
          completionDate: complete ? formData.completionDate : "",
          taskId: "",
        },
      };
      const handleRefetch = () => {
        resetForm();
        callBack();
      };
      await sendData("teamVolunteers.php", data, handleRefetch);
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <FormSectionGroup>
        <FormSection title="Task Information" data={structure} />
        <FormSubmitBtn text={type ? "Update Task" : "Add Task"} />
      </FormSectionGroup>
    </form>
  );
};
export default TaskForm;
