import { useValidateForm, validators } from "../../Hooks/useValidateForm";
import useFetching from "../../Hooks/useFetching";
import { useMemo } from "react";
import {
  Input,
  SelectInput,
  FormSubmitBtn,
  FormSectionGroup,
  FormSection,
} from "../Global/Form";
const VolunteerForm = ({ type, volunteer, reFetch }) => {
  const countries = [
    {
      text: "Select Nationality",
      value: "",
    },
    {
      text: "Lebanon",
      value: "lb",
    },
    {
      text: "Syria",
      value: "sy",
    },
    {
      text: "Palestine",
      value: "ps",
    },
    {
      text: "Other",
      value: "other",
    },
  ];
  const genders = [
    {
      text: "Select Gender",
      value: "",
    },
    {
      text: "Male",
      value: "male",
    },
    {
      text: "Female",
      value: "female",
    },
  ];
  const initialData = {
    firstName: volunteer ? volunteer.firstName : "",
    lastName: volunteer ? volunteer.lastName : "",
    birthDate: volunteer ? volunteer.birthDate : "",
    major: volunteer ? volunteer.major : "",
    university: volunteer ? volunteer.university : "",
    phone: volunteer ? volunteer.phone + "" : "",
    email: volunteer ? volunteer.email : "",
    gender: volunteer
      ? volunteer.gender
        ? volunteer.gender.toLowerCase()
        : ""
      : "",
    nationality: volunteer ? volunteer.nationality : "",
    residentCountry: volunteer ? volunteer.residentCountry : "",
  };
  const validationRules = {
    firstName: validators.required(),
    lastName: validators.required(),
    birthDate: validators.birthDate(),
    major: validators.required(),
    university: validators.requiredAndLengthRange(
      2,
      300,
      "University is required!"
    ),
    phone: validators.phone(),
    email: validators.email(),
    gender: validators.required(),
    nationality: validators.required(),
    residentCountry: validators.required(),
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const data = {
        action: type ? type : "create",
        data: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          birthDate: formData.birthDate,
          major: formData.major,
          university: formData.university,
          phone: formData.phone,
          email: formData.email,
          gender: formData.gender,
          nationality: formData.nationality,
          residentCountry: formData.residentCountry,
          volunteerId: volunteer ? volunteer.id : "",
          userId: 1001,
        },
      };
      await sendData("volunteers.php", data, reFetch ? reFetch : resetForm);
    }
  };
  const structure = useMemo(
    () => [
      {
        title: "Personal Information",
        items: [
          {
            value: formData.firstName,
            error: errors.firstName,
            label: "First Name",
            onChange: handleChange,
            holder: "John..",
            name: "firstName",
            onBlur: handleBlur,
            show: true,
          },
          {
            value: formData.lastName,
            error: errors.lastName,
            label: "Last Name",
            onChange: handleChange,
            holder: "Doe..",
            name: "lastName",
            onBlur: handleBlur,
            show: true,
          },
          {
            value: formData.birthDate,
            error: errors.birthDate,
            label: "Birth Date",
            onChange: handleChange,
            name: "birthDate",
            onBlur: handleBlur,
            show: true,
            type: "date",
          },
          {
            value: formData.gender,
            error: errors.gender,
            label: "Gender",
            onChange: handleChange,
            name: "gender",
            onBlur: handleBlur,
            show: true,
            type: "selection",
            options: genders,
          },
        ],
      },
      {
        title: "Contact Info",
        items: [
          {
            value: formData.email,
            error: errors.email,
            label: "Email Address",
            onChange: handleChange,
            name: "email",
            onBlur: handleBlur,
            holder: "joe@gmail.com..",
            show: true,
            type: "email",
          },
          {
            value: formData.phone,
            error: errors.phone,
            label: "Phone Number",
            onChange: handleChange,
            name: "phone",
            onBlur: handleBlur,
            holder: "81 800 700..",
            show: true,
            type: "phone",
          },
        ],
      },
      {
        title: "Education Information",
        items: [
          {
            value: formData.university,
            error: errors.university,
            label: "University / School",
            onChange: handleChange,
            name: "university",
            onBlur: handleBlur,
            holder: "LIU..",
            show: true,
          },
          {
            value: formData.major,
            error: errors.major,
            label: "Major",
            onChange: handleChange,
            name: "major",
            onBlur: handleBlur,
            holder: "Computer Science..",
            show: true,
          },
        ],
      },
      {
        title: "Location Information",
        items: [
          {
            value: formData.nationality,
            error: errors.nationality,
            label: "Nationality",
            onChange: handleChange,
            name: "nationality",
            onBlur: handleBlur,
            show: true,
            options: countries,
            type: "selection",
          },
          {
            value: formData.residentCountry,
            error: errors.residentCountry,
            label: "Country of Residence",
            onChange: handleChange,
            name: "residentCountry",
            onBlur: handleBlur,
            show: true,
            options: countries,
            type: "selection",
          },
        ],
      },
    ],
    [errors, formData, handleChange, handleBlur]
  );
  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <FormSectionGroup data={structure} />
      <FormSubmitBtn text={type ? "Update Volunteer" : "Add Volunteer"} />
    </form>
  );
};
export default VolunteerForm;
