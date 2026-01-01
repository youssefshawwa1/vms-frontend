import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material";
import GenericForm from "../Components/GenericForm";

const GenericEditPage = ({
  config,
  apiEndpoint,
  title,
  redirectPath,
  description = "Modify only the fields you wish to change.",
}) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [smartConfig, setSmartConfig] = useState(config);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);

        // 1. Fetch Record and Roles in parallel
        const [recordRes, rolesRes] = await Promise.all([
          axios.get(`http://localhost:5000${apiEndpoint}/${id}`),
          axios.get(`http://localhost:5000/roles`),
        ]);

        const rawData = recordRes.data.data || recordRes.data;

        // Use a local variable to build the config updates synchronously
        let updatedConfig = [...config];

        // 2. Map Roles using the CORRECT keys from your backend JSON
        if (rolesRes.data && rolesRes.data.data) {
          const roles = rolesRes.data.data;
          const roleOptions = roles.map((r) => ({
            label: r.roleTitle, // Backend: roleTitle
            value: r.roleId, // Backend: roleId (usually a Number)
          }));

          updatedConfig = updatedConfig.map((field) =>
            field.name === "roleId" ? { ...field, options: roleOptions } : field
          );
        }

        // 3. Data Sanitization
        const sanitizedData = { ...rawData };

        updatedConfig.forEach((field) => {
          const value = sanitizedData[field.name];

          // Format Dates for <input type="date">
          if (field.type === "date" && value) {
            sanitizedData[field.name] = value.split("T")[0];
          }

          // Convert Buffers to Booleans
          if (value && typeof value === "object" && value.type === "Buffer") {
            sanitizedData[field.name] = value.data[0] === 1;
          }

          /* CRITICAL FIX: 
             If your GenericForm or Select component uses string comparisons, 
             ensure the initial value matches the option value type.
          */
          if (field.name === "roleId" && value !== undefined) {
            // If the dropdown isn't selecting, try: sanitizedData[field.name] = value;
            // Some UI kits require: String(value)
            sanitizedData[field.name] = value;
          }
        });

        // 4. Update state all at once to trigger a single re-render
        setSmartConfig(updatedConfig);
        setInitialData(sanitizedData);
      } catch (error) {
        console.error("Initialization Error:", error);
        showToast("Failed to load form data.", "error");
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [id, apiEndpoint, config]);

  const showToast = (message, severity = "error") => {
    setToast({ open: true, message, severity });
  };

  const getDirtyValues = (original, current) => {
    const dirtyValues = {};
    Object.keys(current).forEach((key) => {
      if (current[key] !== original[key]) {
        dirtyValues[key] = current[key];
      }
    });
    return dirtyValues;
  };

  const handleUpdate = async (formData) => {
    const changedFields = getDirtyValues(initialData, formData);

    if (Object.keys(changedFields).length === 0) {
      showToast("No changes detected.", "info");
      return;
    }

    setSubmitting(true);
    try {
      await axios.patch(`http://localhost:5000${apiEndpoint}/${id}`, {
        ...changedFields,
        userId: 1001,
      });

      showToast(`${title} updated successfully!`, "success");

      setTimeout(() => {
        navigate(`${redirectPath}/${id}`, { state: { refresh: true } });
      }, 1500);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || `Failed to update ${title}.`;
      showToast(errorMessage, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] w-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-main"></div>
      </div>
    );
  }

  return (
    <div className="w-full animate-slide-up">
      <div
        className={`relative transition-all duration-500 ${
          submitting ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        <GenericForm
          config={smartConfig}
          initialData={initialData}
          onSubmit={handleUpdate}
          title={`Edit ${title}`}
          description={description}
          buttonText={submitting ? "Saving..." : "Save Changes"}
        />
      </div>

      <Snackbar
        open={toast.open}
        autoHideDuration={5000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: "16px",
            fontWeight: "700",
            backgroundColor:
              toast.severity === "success"
                ? "var(--color-main)"
                : toast.severity === "info"
                ? "#3b82f6"
                : "#ef4444",
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default GenericEditPage;
