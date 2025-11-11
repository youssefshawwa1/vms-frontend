import useFetching from "../../Hooks/useFetching";
import { useValidateForm, validators } from "../../Hooks/useValidateForm";
import { FormSubmitBtn, FormSectionGroup, FormSection } from "../Global/Form";
import { useMemo, useState } from "react";
const UserForm = ({ type, user, reFetch }) => {
  const [active, setActive] = useState(
    user?.details?.status ? user?.details?.status : true
  );
  const validationRules = {
    userName: validators.required(),
    password: validators.minLength(8),
    rePassword: (value) => {
      if (!value || value.length < 1) return "This field is required";
      return value != formData.password ? "Not matched!" : "";
    },
    firstName: validators.required(),
    lastName: validators.required(),
    email: validators.required(),
  };
  if (user) {
    validationRules.oldPassword = validators.minLength(8);
  }
  const initialData = {
    userName: user?.details?.userName || "",
    oldPassword: "",
    password: "",
    rePassword: "",
    firstName: user?.details?.firstName || "",
    lastName: user?.details?.lastName || "",
    email: user?.details?.userEmail || "",
    status: active,
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
        label: "Username",
        error: errors.userName,
        onChange: handleChange,
        value: formData.userName,
        name: "userName",
        holder: "joe_2...",
        onBlur: handleBlur,
        show: true,
      },
      {
        label: "Old Password",
        error: errors.oldPassword,
        onChange: handleChange,
        value: formData.oldPassword,
        name: "oldPassword",
        onBlur: handleBlur,
        type: "password",
        show: user ? true : false,
      },
      {
        label: "Password",
        error: errors.password,
        onChange: handleChange,
        value: formData.password,
        name: "password",
        onBlur: handleBlur,
        type: "password",
        show: true,
      },
      {
        label: "Retype password",
        error: errors.rePassword,
        onChange: handleChange,
        value: formData.rePassword,
        name: "rePassword",
        onBlur: handleBlur,
        type: "password",
        show: true,
      },
      {
        label: "First Name",
        error: errors.firstName,
        onChange: handleChange,
        value: formData.firstName,
        name: "firstName",
        holder: "Joe..",
        onBlur: handleBlur,
        show: true,
      },
      {
        label: "Last Name",
        error: errors.lastName,
        onChange: handleChange,
        value: formData.lastName,
        name: "lastName",
        holder: "Doe..",
        onBlur: handleBlur,
        show: true,
      },
      {
        label: "Email",
        error: errors.email,
        onChange: handleChange,
        value: formData.email,
        name: "email",
        holder: "joe@email.com..",
        onBlur: handleBlur,
        type: "email",
        show: true,
      },
      {
        checked: active,
        label: "Active",
        setChecked: () => {
          setActive(!active);
        },
        type: "checkbox",
        show: user ? false : true,
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
          userName: formData.userName,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          userEmail: formData.email,
          status: active,
          userId: user?.details?.id || "",
          oldPassword: formData?.oldPassword || "",
        },
      };
      await sendData("users.php", data, reFetch ? reFetch : resetForm);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className=" animate-slide-up"
    >
      <FormSectionGroup>
        <FormSection title="User Information" data={structure} />
      </FormSectionGroup>
      <FormSubmitBtn text={type ? "Update Profile" : "Add User"} />
    </form>
  );
};
export default UserForm;
