import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  CircularProgress,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  CheckCircleOutline,
  CalendarToday,
  CheckCircle,
} from "@mui/icons-material";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

const CompleteTaskAction = ({ data, onRefresh }) => {
  const navigate = useNavigate();

  // Local State
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [completionDate, setCompletionDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Toast State
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const taskId = data?.taskId || data?.id;

  const isCompleted = useMemo(() => {
    const field = data?.completed;
    if (!field) return false;
    if (typeof field === "string") {
      return field.toLowerCase() === "completed" || field === "YES";
    }
    if (field.type === "Buffer" && Array.isArray(field.data)) {
      return field.data[0] === 1 || field.data[0] === 49;
    }
    return field === true || field === 1 || field === "1";
  }, [data]);

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const handleConfirm = async () => {
    if (!taskId) return;
    setLoading(true);
    try {
      await axios.patch(`${BASE_URL}/tasks/${taskId}/complete`, {
        completionDate: completionDate,
        completed: 1,
        userId: 1001,
      });

      showToast("Task completed successfully!", "success");
      setShowConfirm(false);

      setTimeout(() => {
        navigate(`/tasks/${taskId}`);
      }, 1500);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to complete task.";
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  if (isCompleted) return null;

  return (
    <>
      {/* Primary Trigger Button */}
      <button
        onClick={() => setShowConfirm(true)}
        className="cursor-pointer group flex items-center gap-2 px-8 py-3.5 bg-[var(--color-main)] text-white font-black rounded-2xl shadow-lg shadow-[rgba(var(--color-main-rgb),0.3)] hover:brightness-110 transition-all active:scale-95"
      >
        <CheckCircleOutline className="text-xl group-hover:rotate-12 transition-transform" />
        Complete Task
      </button>

      {/* Unified Design Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop with Blur */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => !loading && setShowConfirm(false)}
          ></div>

          {/* Modal Content - Matching CertificateViewer */}
          <div className="relative bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            {/* Circular Icon Header */}
            <div className="w-20 h-20 bg-[var(--color-main)]/10 text-[var(--color-main)] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleOutline sx={{ fontSize: 40 }} />
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-2">
              Finalize Task?
            </h3>
            <p className="text-slate-500 font-medium mb-6 leading-relaxed">
              Confirm the completion date to finalize{" "}
              <span className="text-slate-900 font-bold">
                "{data?.taskTitle}"
              </span>
              .
            </p>

            {/* Content Area: Date Picker */}
            <div className="mb-8 text-left">
              <TextField
                fullWidth
                type="date"
                label="Completion Date"
                value={completionDate}
                onChange={(e) => setCompletionDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday className="text-slate-400" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                    backgroundColor: "#f8fafc",
                    "& fieldset": { borderColor: "#e2e8f0" },
                    "&:hover fieldset": { borderColor: "var(--color-main)" },
                    "&.Mui-focused fieldset": {
                      borderColor: "var(--color-main)",
                    },
                  },
                }}
              />
            </div>

            {/* Action Buttons - Identical to CertificateViewer */}
            <div className="flex gap-3">
              <button
                disabled={loading}
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-4 px-6 border-2 border-slate-100 text-slate-400 font-bold rounded-2xl hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={handleConfirm}
                className="flex-1 py-4 px-6 bg-[var(--color-main)] text-white font-bold rounded-2xl shadow-lg shadow-[rgba(var(--color-main-rgb),0.3)] hover:brightness-110 flex items-center justify-center gap-2 disabled:opacity-70 transition-all active:scale-95"
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <CheckCircle size={20} />
                )}
                {loading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
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
              toast.severity === "success" ? "var(--color-main)" : "#ef4444",
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CompleteTaskAction;
