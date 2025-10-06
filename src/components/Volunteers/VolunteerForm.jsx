import { useValidateForm, validators } from "../Global/useValidateForm";
import useFetching from "../Global/Helpers/useFetching";
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

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <FormSectionGroup>
        <FormSection title="Personal Information">
          <Input
            value={formData.firstName}
            error={errors.firstName}
            label="First Name"
            onChange={handleChange}
            holder="some first name.."
            name={"firstName"}
            onBlur={handleBlur}
          />
          <Input
            value={formData.lastName}
            error={errors.lastName}
            label="Last Name"
            onChange={handleChange}
            holder="some last name.."
            name="lastName"
            onBlur={handleBlur}
          />
          <Input
            value={formData.birthDate}
            error={errors.birthDate}
            label="Birth Date"
            onChange={handleChange}
            holder="date"
            type="date"
            name="birthDate"
            onBlur={handleBlur}
          />
          <SelectInput
            label="Gender"
            value={formData.gender}
            onChange={handleChange}
            error={errors.gender}
            options={genders}
            name="gender"
            onBlur={handleBlur}
          />
        </FormSection>
        <FormSection title="Contact Info">
          <Input
            value={formData.email}
            error={errors.email}
            label="Email Address"
            onChange={handleChange}
            holder="joe@gmail.com.."
            type="email"
            name="email"
            onBlur={handleBlur}
          />
          <Input
            value={formData.phone}
            error={errors.phone}
            label="Phone Number"
            onChange={handleChange}
            holder="81 800 700.."
            type="tel"
            name="phone"
            onBlur={handleBlur}
          />
        </FormSection>
        <FormSection title="Education Information">
          <Input
            value={formData.university}
            error={errors.university}
            label="University / School"
            onChange={handleChange}
            holder="LIU.."
            name="university"
            onBlur={handleBlur}
          />
          <Input
            value={formData.major}
            error={errors.major}
            label="Major"
            onChange={handleChange}
            holder="Computer Science.."
            name="major"
            onBlur={handleBlur}
          />
        </FormSection>
        <FormSection title="Location Information">
          <SelectInput
            label="Nationality"
            value={formData.nationality}
            onChange={handleChange}
            error={errors.nationality}
            options={countries}
            name="nationality"
            onBlur={handleBlur}
          />
          <SelectInput
            label="Country of Residence"
            value={formData.residentCountry}
            onChange={handleChange}
            error={errors.residentCountry}
            options={countries}
            name="residentCountry"
            onBlur={handleBlur}
          />
        </FormSection>
      </FormSectionGroup>
      <FormSubmitBtn text={type ? "Update Volunteer" : "Add Volunteer"} />
    </form>
  );
};
export default VolunteerForm;
