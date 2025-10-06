import { useState } from "react";
import useFetching from "../Global/Helpers/useFetching";
import {
  Input,
  FormSubmitBtn,
  FormSectionGroup,
  FormSection,
  CheckBox,
} from "../Global/Form";
import { useValidateForm, validators } from "../Global/useValidateForm";
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
  const { formData, errors, handleChange, handleBlur, validateForm } =
    useValidateForm(initialData, validationRules);

  const { sendData } = useFetching();
  const [complete, setComplete] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    complete
      ? (validationRules.completionDate = validators.required())
      : validationRules.completionDate ?? delete validationRules.completionDate;

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
      await sendData("teamVolunteers.php", data, callBack);
    } else {
      console.log(errors);
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <FormSectionGroup>
        <FormSection title="Task Information">
          <Input
            label="Volunteering Title"
            error={errors.taskTitle}
            onChange={handleChange}
            value={formData.taskTitle}
            name="taskTitle"
            holder="Create a document..."
            onBlur={handleBlur}
          />
          <Input
            label="Description"
            error={errors.taskDescription}
            onChange={handleChange}
            value={formData.taskDescription}
            name="taskDescription"
            holder="Some Description.."
            onBlur={handleBlur}
          />
          <Input
            label="Start Date"
            error={errors.startDate}
            onChange={handleChange}
            value={formData.startDate}
            name="startDate"
            type="date"
            onBlur={handleBlur}
          />
          <Input
            label="End Date"
            error={errors.endDate}
            onChange={handleChange}
            value={formData.endDate}
            name="endDate"
            type="date"
            onBlur={handleBlur}
          />
          {complete && (
            <Input
              label="Completion Date"
              error={errors.completionDate}
              onChange={handleChange}
              value={formData.completionDate}
              name="completionDate"
              type="date"
              onBlur={handleBlur}
            />
          )}
          <Input
            label="Volunteering Hours"
            error={errors.volunteeringHours}
            onChange={handleChange}
            value={formData.volunteeringHours}
            name="volunteeringHours"
            type="number"
            onBlur={handleBlur}
          />
          <CheckBox
            checked={complete}
            setChecked={setComplete}
            ifChecked={() => {
              if (complete) {
                errors.completionDate = "";
              }
            }}
          />
        </FormSection>
        <FormSubmitBtn text={type ? "Update Task" : "Add Task"} />
      </FormSectionGroup>
    </form>
  );
};
export default TaskForm;
