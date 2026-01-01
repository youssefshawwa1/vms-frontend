import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  InputAdornment,
} from "@mui/material";
import {
  PersonOutline,
  MailOutline,
  CalendarToday,
  ListAlt,
  CheckCircleOutline,
  PhoneOutlined,
  ToggleOnOutlined,
} from "@mui/icons-material";

const GenericForm = ({
  config,
  initialData = {},
  onSubmit,
  buttonText = "Save Changes",
  title = "Add",
  description = "Add New",
}) => {
  const [formData, setFormData] = useState(initialData || {});
  const [errors, setErrors] = useState({});

  // ✅ FIX: Track the last stringified version of data to prevent reference loops
  const lastDataRef = useRef(JSON.stringify(initialData));

  useEffect(() => {
    const incomingDataString = JSON.stringify(initialData);

    // Only update formData if the actual CONTENT of initialData has changed
    if (incomingDataString !== lastDataRef.current) {
      const sanitizedData = { ...initialData };
      config.forEach((field) => {
        if (field.type === "checkbox") {
          sanitizedData[field.name] = !!initialData[field.name];
        }
      });

      setFormData(sanitizedData);
      lastDataRef.current = incomingDataString;
    }
  }, [initialData, config]); // React will still check these, but the logic inside gates the update

  const getIcon = (fieldName, type) => {
    const name = fieldName.toLowerCase();
    if (name.includes("email"))
      return <MailOutline className="text-gray-400" />;
    if (name.includes("name"))
      return <PersonOutline className="text-gray-400" />;
    if (name.includes("date"))
      return <CalendarToday className="text-gray-400" />;
    if (name.includes("phone"))
      return <PhoneOutlined className="text-gray-400" />;
    if (name === "active" || type === "checkbox")
      return <ToggleOnOutlined className="text-gray-400" />;
    if (type === "select") return <ListAlt className="text-gray-400" />;
    return <CheckCircleOutline className="text-gray-400" />;
  };

  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    config.forEach((field) => {
      const value = formData[field.name];
      const rules = field.validation;

      if (rules?.required) {
        if (
          value === undefined ||
          value === null ||
          (typeof value === "string" && value.trim() === "") ||
          (field.type === "checkbox" && value === false)
        ) {
          tempErrors[field.name] = `${field.label} is required`;
          isValid = false;
        }
      }

      if (rules?.custom) {
        const customError = rules.custom(value, formData);
        if (customError) {
          tempErrors[field.name] = customError;
          isValid = false;
        }
      }
    });

    setErrors(tempErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const muiFieldStyle = {
    "& .MuiInputLabel-root.Mui-focused": { color: "var(--color-main)" },
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#f9fafb",
      borderRadius: "16px",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      "& fieldset": { borderColor: "transparent" },
      "&:hover": { backgroundColor: "#f3f4f6" },
      "&.Mui-focused": {
        backgroundColor: "#fff",
        "& fieldset": {
          borderColor: "var(--color-main)",
          borderWidth: "2px",
          boxShadow: "0 0 0 4px rgba(var(--color-main-rgb), 0.1)",
        },
      },
      "&.Mui-error": {
        backgroundColor: "#fff",
        "& fieldset": { borderColor: "#ef4444", borderWidth: "2px" },
      },
    },
    "& .MuiFormHelperText-root.Mui-error": {
      color: "#ef4444",
      fontWeight: "500",
      marginLeft: "14px",
    },
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full mx-auto p-10 bg-white rounded-[32px] shadow-2xl shadow-gray-200/60 border border-gray-100"
    >
      <div className="mb-10">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          {title}
        </h2>
        <p className="text-gray-500 mt-1 text-sm">{description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
        {config.map((field) => (
          <div key={field.name} className={field.gridSpan || "col-span-2"}>
            {field.type === "select" ? (
              <TextField
                select
                fullWidth
                name={field.name}
                label={field.label}
                value={formData[field.name] || ""}
                onChange={handleChange}
                error={!!errors[field.name]}
                helperText={errors[field.name]}
                sx={muiFieldStyle}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {getIcon(field.name, field.type)}
                    </InputAdornment>
                  ),
                }}
              >
                {field.options.map((opt) => (
                  <MenuItem
                    key={typeof opt === "object" ? opt.value : opt}
                    value={typeof opt === "object" ? opt.value : opt}
                    sx={{ borderRadius: "8px", m: "4px" }}
                  >
                    {typeof opt === "object" ? opt.label : opt}
                  </MenuItem>
                ))}
              </TextField>
            ) : field.type === "checkbox" ? (
              <div
                className={`group p-4 px-5 rounded-2xl border-2 transition-all duration-300 ${
                  errors[field.name]
                    ? "border-red-500 bg-red-50/30"
                    : "border-gray-100 bg-gray-50/30 hover:border-main/20 hover:bg-white"
                }`}
              >
                <FormControlLabel
                  className="w-full m-0"
                  control={
                    <Checkbox
                      name={field.name}
                      checked={!!formData[field.name]}
                      onChange={handleChange}
                      sx={{
                        color: errors[field.name] ? "#ef4444" : "#d1d5db",
                        "&.Mui-checked": { color: "var(--color-main)" },
                      }}
                    />
                  }
                  label={
                    <div className="flex flex-col ml-2">
                      <span
                        className={`font-bold text-sm ${
                          errors[field.name] ? "text-red-600" : "text-gray-700"
                        }`}
                      >
                        {field.label}
                      </span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                        {formData[field.name]
                          ? "Currently Active"
                          : "Inactive / Completed"}
                      </span>
                    </div>
                  }
                />
              </div>
            ) : (
              <TextField
                fullWidth
                type={field.type}
                name={field.name}
                label={field.label}
                value={formData[field.name] || ""}
                onChange={handleChange}
                error={!!errors[field.name]}
                helperText={errors[field.name]}
                sx={muiFieldStyle}
                InputLabelProps={field.type === "date" ? { shrink: true } : {}}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {getIcon(field.name, field.type)}
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-14 pt-8 border-t border-gray-50 flex items-center justify-between">
        <span className="text-gray-400 text-sm font-medium">
          Verify data before saving
        </span>
        <button
          type="submit"
          className="cursor-pointer group relative inline-flex items-center justify-center px-12 py-4 font-bold text-white transition-all duration-300 bg-main rounded-2xl hover:brightness-110 hover:shadow-2xl hover:shadow-main/40 active:scale-95 shadow-xl shadow-main/20"
        >
          <span className="relative flex items-center gap-2">
            {buttonText}
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </span>
        </button>
      </div>
    </form>
  );
};

export default GenericForm;
