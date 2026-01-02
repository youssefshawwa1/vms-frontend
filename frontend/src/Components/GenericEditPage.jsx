import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Snackbar, Alert, CircularProgress, Box } from "@mui/material";
import GenericForm from "../Components/GenericForm";
const GenericEditPage = ({
  config,
  apiEndpoint,
  title,
  redirectPath,
  description = "Modify only the fields you wish to change.",
  getRoles = false,
  useWithoutId = false,
}) => {
  const { id: paramId } = useParams();

  const navigate = useNavigate();
  // --- State Management ---
  const id = useWithoutId ? "" : `/${paramId}`;
  const [initialData, setInitialData] = useState(null);
  const [smartConfig, setSmartConfig] = useState(config);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = (message, severity = "error") => {
    setToast({ open: true, message, severity });
  };

  // --- Data Sanitization Helper ---
  const sanitizeRecord = useCallback((rawData, currentConfig) => {
    const sanitized = { ...rawData };

    currentConfig.forEach((field) => {
      const value = sanitized[field.name];

      // 1. Format Dates for HTML5 Input (YYYY-MM-DD)
      if (field.type === "date" && value) {
        sanitized[field.name] = value.split("T")[0];
      }

      // 2. Convert MySQL/Postgres Bit/Buffer to Boolean
      if (value && typeof value === "object" && value.type === "Buffer") {
        sanitized[field.name] = value.data[0] === 1;
      }

      // 3. Ensure numeric IDs are preserved
      if (field.name === "roleId" && value !== undefined) {
        sanitized[field.name] = value;
      }
    });

    return sanitized;
  }, []);

  // --- Initialization Logic ---
  useEffect(() => {
    const initializePage = async () => {
      try {
        setLoading(true);

        const [recordRes, rolesRes] = await Promise.all([
          api.get(`${apiEndpoint}${id}`),
          getRoles ? api.get(`/roles`) : Promise.resolve(null),
        ]);

        const rawData = recordRes.data.data || recordRes.data;
        let updatedConfig = [...config];

        if (getRoles && rolesRes?.data?.data) {
          const roleOptions = rolesRes.data.data.map((r) => ({
            label: r.roleTitle,
            value: r.roleId,
          }));

          updatedConfig = updatedConfig.map((field) =>
            field.name === "roleId" ? { ...field, options: roleOptions } : field
          );
        }

        const cleanedData = sanitizeRecord(rawData, updatedConfig);

        setSmartConfig(updatedConfig);
        setInitialData(cleanedData);
      } catch (error) {
        console.error("Initialization Error:", error);
        showToast("Failed to load data. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, [id, apiEndpoint, config, getRoles, sanitizeRecord]);

  // --- Dirty Checking Logic (Updated to ignore empty values) ---
  const getDirtyValues = (original, current) => {
    const dirtyValues = {};
    Object.keys(current).forEach((key) => {
      const curValue = current[key];
      const orgValue = original[key];

      // 1. Only proceed if the value is actually different from the original
      if (curValue !== orgValue) {
        // 2. Filter out null, undefined, or empty strings ("")
        // Note: we allow 'false' and '0' because they are valid data inputs.
        const isEmpty =
          curValue === "" || curValue === null || curValue === undefined;

        if (!isEmpty) {
          dirtyValues[key] = curValue;
        }
      }
    });
    return dirtyValues;
  };

  // --- Submit Handler ---
  const handleUpdate = async (formData) => {
    const changedFields = getDirtyValues(initialData, formData);

    // If no fields changed, or all changes were just clearing fields to empty
    if (Object.keys(changedFields).length === 0) {
      showToast("No valid changes detected.", "info");
      return;
    }

    // --- FIX: Convert Booleans to Integers (0 or 1) to prevent MySQL Buffer errors ---
    const sanitizedFields = Object.keys(changedFields).reduce((acc, key) => {
      const val = changedFields[key];
      acc[key] = typeof val === "boolean" ? (val ? 1 : 0) : val;
      return acc;
    }, {});

    setSubmitting(true);
    try {
      await api.patch(`${apiEndpoint}${id}`, {
        ...sanitizedFields,
      });

      showToast(`${title} updated successfully!`, "success");

      setTimeout(() => {
        navigate(`${redirectPath}/${id}`, { state: { refresh: true } });
      }, 1200);
    } catch (error) {
      const msg = error.response?.data?.message || `Failed to update ${title}.`;
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center min-h-[50vh] w-full">
        <CircularProgress sx={{ color: "var(--color-main, #f59e0b)" }} />
      </Box>
    );
  }

  return (
    <div className="w-full animate-slide-up">
      <div
        className={
          submitting ? "opacity-60 pointer-events-none transition-opacity" : ""
        }
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
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          onClose={() => setToast({ ...toast, open: false })}
          sx={{
            width: "100%",
            borderRadius: "12px",
            fontWeight: 600,
            backgroundColor:
              toast.severity === "success"
                ? "var(--color-main, #f59e0b)"
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
