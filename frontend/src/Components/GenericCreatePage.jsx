import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Snackbar, Alert } from "@mui/material";
import GenericForm from "../Components/GenericForm";

const GenericCreatePage = ({
  config,
  apiEndpoint,
  title,
  redirectPath,
  description = "Please fill out the form below.",
  paramMapping = {},
  extraPayload = {},
  clearOnSuccess = false,
}) => {
  const params = useParams();
  const navigate = useNavigate();

  const [smartConfig, setSmartConfig] = useState(config);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const hasInitialized = useRef(false);

  useEffect(() => {
    const initializeForm = async () => {
      if (hasInitialized.current) return;
      try {
        setLoading(true);
        const hasRoleIdField = config.some((field) => field.name === "roleId");
        if (hasRoleIdField) {
          const rolesRes = await api.get(`/roles`);
          if (rolesRes.data && rolesRes.data.data) {
            const roles = rolesRes.data.data;
            const roleOptions = roles.map((r) => ({
              label: r.roleTitle,
              value: r.roleId,
            }));
            const updatedConfig = config.map((field) =>
              field.name === "roleId"
                ? { ...field, options: roleOptions }
                : field
            );
            setSmartConfig(updatedConfig);
          }
        } else {
          setSmartConfig(config);
        }
        hasInitialized.current = true;
      } catch (error) {
        console.error("Initialization Error:", error);
        showToast("Failed to load form options.", "error");
      } finally {
        setLoading(false);
      }
    };
    initializeForm();
  }, [config, apiEndpoint]);

  const showToast = (message, severity = "error") => {
    setToast({ open: true, message, severity });
  };

  const handleCreate = async (formData) => {
    setSubmitting(true);
    try {
      let finalEndpoint = apiEndpoint;
      Object.keys(params).forEach((key) => {
        finalEndpoint = finalEndpoint.replace(`:${key}`, params[key]);
      });

      const mappedParams = {};
      Object.entries(paramMapping).forEach(([bodyKey, urlParamName]) => {
        if (params[urlParamName]) {
          mappedParams[bodyKey] = params[urlParamName];
        }
      });

      await api.post(finalEndpoint, {
        ...formData,
        ...mappedParams,
        ...extraPayload,
      });

      showToast(`${title} created successfully!`, "success");

      // ✅ SMART REDIRECT LOGIC:
      // If redirectPath is "/teams/:id", it converts to "/teams/123"
      if (redirectPath) {
        let finalRedirectPath = redirectPath;
        Object.keys(params).forEach((key) => {
          finalRedirectPath = finalRedirectPath.replace(`:${key}`, params[key]);
        });

        setTimeout(() => {
          navigate(finalRedirectPath);
        }, 1500);
      } else if (clearOnSuccess) {
        setFormKey((prev) => prev + 1);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || `Failed to create ${title}.`;
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
          key={formKey}
          config={smartConfig}
          onSubmit={handleCreate}
          title={`New ${title}`}
          description={description}
          buttonText={submitting ? "Saving..." : `Create ${title}`}
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

export default GenericCreatePage;
