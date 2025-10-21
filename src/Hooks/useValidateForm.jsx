import { useState } from "react";

const useValidateForm = (initialData, validationRules) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };
  const clearFieldError = (field) => {
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };
  const validateField = (name, value) => {
    if (validationRules[name]) {
      const error = validationRules[name](value, formData);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
      return !error;
    }
    return true;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach((name) => {
      const error = validationRules[name](formData[name], formData);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });
    setErrors(newErrors);
    return isValid;
  };
  const resetForm = () => {
    setFormData(initialData);
    setErrors({});
    setTouched({});
  };

  const updateField = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    validateField,
    updateField,
    resetForm,
    setFormData,
    clearFieldError,
  };
};

const validators = {
  required:
    (message = "This field is required") =>
    (value) =>
      !value || value.toString().trim() === "" ? message : "",

  email:
    (message = "Email is required", message1 = "Invalid email format") =>
    (value) => {
      if (!value) {
        return message;
      }
      return value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? message1 : "";
    },

  minLength:
    (min, message = `Must be at least ${min} characters`) =>
    (value) =>
      value && value.length < min ? message : "",

  maxLength:
    (max, message = `Must be less than ${max} characters`) =>
    (value) =>
      value && value.length > max ? message : "",

  pattern:
    (regex, message = "Invalid format") =>
    (value) =>
      value && !regex.test(value) ? message : "",

  match:
    (fieldName, message = "Fields do not match") =>
    (value, formData) =>
      value !== formData[fieldName] ? message : "",
  requiredAndLengthRange:
    (
      minLength,
      maxLength,
      message1 = `This field is required`,
      message2 = `Must be at least ${minLength} Characters!!`,
      message3 = `Must be at max ${maxLength} Characters!!`
    ) =>
    (value) => {
      if (!value) return message1;
      else if (value.length < minLength) return message2;
      else if (value.length > maxLength) return message3;
      return "";
    },
  futureDate:
    (
      message = `This field is required`,
      message1 = `Can't be in the future!`
    ) =>
    (value) => {
      if (!value) return message;
      else if (new Date(value) >= new Date()) return message1;
      return "";
    },
  date:
    (
      date,
      message = `This field is required`,
      message1 = `Can't be before Start Date!`
    ) =>
    (value) => {
      if (!value) return message;
      else if (new Date(value) <= new Date(date)) return message1;
      return "";
    },
  dateWithStartEnd:
    (
      date,
      message = `This field is required`,
      message2 = "Can't be in the future!",
      message1 = `Can't be before Start Date!`
    ) =>
    (value) => {
      if (!value) return message;
      else if (new Date(value) < new Date(date)) return message1;
      else if (new Date(value) > new Date()) return message2;
      return "";
    },
  phone:
    (
      minLength = 8,
      maxLength = 16,
      message1 = `This field is required`,
      message2 = `Must be at least ${minLength} numbers`,
      message3 = `Must be at max ${maxLength} numbers`, // Fixed: should be maxLength
      message4 = `Phone number can only contain numbers and optional + at beginning`
    ) =>
    (value) => {
      if (!value) return message1;

      // Remove any spaces for length calculation
      const cleanValue = value.toString().replace(/\s/g, "");

      // Check if starts with + followed by numbers, or just numbers
      const phoneRegex = /^\+?[0-9]+$/;

      if (!phoneRegex.test(cleanValue)) {
        return message4;
      }

      // Check length (excluding the + if present)
      const lengthWithoutPlus = cleanValue.startsWith("+")
        ? cleanValue.length - 1
        : cleanValue.length;

      if (lengthWithoutPlus < minLength) return message2;
      if (lengthWithoutPlus > maxLength) return message3;

      return "";
    },
};
export { useValidateForm, validators };
// utils/validators.js
