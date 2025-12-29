import { useMemo, useState } from "react";
import useFetching from "../../Hooks/useFetching";
import { FormSubmitBtn, FormSectionGroup, FormSection } from "../Global/Form";
import { useValidateForm, validators } from "../../Hooks/useValidateForm";
const TaskForm = ({ teamVolunteerId, callBack, task }) => {
  console.log(task);
  const validationRules = {
    taskTitle: validators.required(),
    taskDescription: validators.required(),
    startDate: validators.required(),
    endDate: validators.required(),
    volunteeringHours: validators.nbBetween(0.5, 15),
    completionDate: () => {
      if (!formData.completionDate) return "This field is required";
      else if (new Date(formData.completionDate) > new Date())
        return "Can't be in the future!";
      else if (new Date(formData.completionDate) < new Date(formData.startDate))
        return "Can't be before start date!";
    },
  };
  const initialData = {
    taskTitle: task?.taskTitle || "",
    taskDescription: task?.taskDescription || "",
    startDate: task?.startDate || "",
    endDate: task?.endDate || "",
    volunteeringHours: task ? task.volunteeringHours : 1,
    completed: task ? (task.completed ? true : false) : false,
    completionDate: task?.completionDate || "",
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
  const [complete, setComplete] = useState(initialData.completed);

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
        type: "textarea",
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
            updateField("completionDate", task?.completionDate || "");
          }
          validationRules.completionDate = validators.required();
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
      ? (currentValidationRules.completionDate = validators.dateWithStartEnd())
      : validationRules.currentValidationRules ??
        delete validationRules.completionDate;
    if (validateForm()) {
      console.log(task);

      const data = {
        action: task ? "updateTask" : "addTask",
        data: {
          userId: 1001,
          taskTitle: formData.taskTitle,
          taskDescription: formData.taskDescription,
          startDate: formData.startDate,
          endDate: formData.endDate,
          volunteeringHours: formData.volunteeringHours,
          teamVolunteerId:
            task?.fullDetails?.volunteering?.volunteeringId || teamVolunteerId,
          completed: complete,
          completionDate: complete ? formData.completionDate : "",
          taskId: task?.id || "",
        },
      };
      // console.log(data);
      // return;
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
        <FormSubmitBtn text={task ? "Update Task" : "Add Task"} />
      </FormSectionGroup>
    </form>
  );
};
export default TaskForm;
