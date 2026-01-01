import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CircularProgress, Snackbar, Alert } from "@mui/material";
import {
  PictureAsPdf,
  Image as ImageIcon,
  Mail,
  CheckCircle,
} from "@mui/icons-material";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

const CertificateViewer = ({ data }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState(null);

  // --- TOAST STATE (Same as CompleteTask) ---
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const certificateId = id || data?.certificateId || data?.id;

  useEffect(() => {
    const fetchImage = async () => {
      if (!certificateId) return;
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/certificates/${certificateId}/preview`
        );
        if (response.data.success) {
          setPreviewData(response.data.data);
        }
      } catch (err) {
        setError("Failed to load certificate preview.");
      } finally {
        setLoading(false);
      }
    };
    fetchImage();
  }, [certificateId]);

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const getSafeFileName = () => {
    const baseName =
      previewData?.image?.imageInfo?.fileName || `certificate_${certificateId}`;
    return baseName.replace(/\//g, "-");
  };

  const handleDownloadJPG = () => {
    if (!previewData) return;
    const { imageInfo, preview } = previewData.image;
    const link = document.createElement("a");
    link.href = `data:${imageInfo.imageType};base64,${preview}`;
    link.download = `${getSafeFileName()}.jpg`;
    link.click();
  };

  const handleDownloadPDF = async () => {
    if (!certificateId) return;
    try {
      setPdfLoading(true);
      const response = await axios.get(
        `${BASE_URL}/certificates/${certificateId}/pdf`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `${getSafeFileName()}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setPdfLoading(false);
    }
  };

  const handleSendEmail = async () => {
    try {
      setEmailLoading(true);
      const response = await axios.post(
        `${BASE_URL}/certificates/${certificateId}/send`
      );

      if (response.data.success) {
        showToast("Certificate sent successfully!", "success");
        setShowConfirm(false);

        // Redirect after toast is visible
        setTimeout(() => {
          navigate(`/certificates/${certificateId}`);
        }, 1500);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send email.";
      showToast(msg, "error");
    } finally {
      setEmailLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <CircularProgress
          sx={{ color: "var(--color-main)" }}
          size={50}
          thickness={4}
        />
        <p className="text-slate-500 font-bold animate-pulse text-lg tracking-tight">
          Generating Preview...
        </p>
      </div>
    );

  const { imageInfo, preview } = previewData.image;

  return (
    <div className="animate-slide-up duration-700 max-w-6xl mx-auto p-4 lg:p-0 relative">
      {/* 1. Header & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Certificate Preview
          </h2>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-[0.2em]">
            {imageInfo.fileName}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleDownloadJPG}
            className="cursor-pointer group flex items-center gap-2 px-4 py-2.5 border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:border-[var(--color-main)] hover:text-[var(--color-main)] transition-all duration-300"
          >
            <ImageIcon className="text-lg" />
            JPG
          </button>

          <button
            disabled={pdfLoading}
            onClick={handleDownloadPDF}
            className="cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-slate-800 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {pdfLoading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <PictureAsPdf className="text-lg" />
            )}
            PDF
          </button>

          <button
            onClick={() => setShowConfirm(true)}
            className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-[var(--color-main)] text-white font-bold rounded-2xl shadow-lg shadow-[rgba(var(--color-main-rgb),0.3)] hover:brightness-110 transition-all active:scale-95"
          >
            <Mail className="text-lg" />
            Send by Email
          </button>
        </div>
      </div>

      {/* 2. Main Preview Area */}
      <div className="relative bg-white border border-slate-200 rounded-[2.5rem] p-4 md:p-10 shadow-xl shadow-slate-200/50 flex items-center justify-center min-h-[500px] overflow-hidden">
        <img
          src={`data:${imageInfo.imageType};base64,${preview}`}
          alt="Preview"
          className="max-w-full h-auto rounded-md shadow-2xl ring-1 ring-black/5"
        />
      </div>

      {/* 3. Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => !emailLoading && setShowConfirm(false)}
          ></div>

          <div className="relative bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className="w-20 h-20 bg-[var(--color-main)]/10 text-[var(--color-main)] rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail sx={{ fontSize: 40 }} />
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-2">
              Send Certificate?
            </h3>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
              This will send the certificate to the registered email address
              associated with this record.
            </p>

            <div className="flex gap-3">
              <button
                disabled={emailLoading}
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-4 px-6 border-2 border-slate-100 text-slate-400 font-bold rounded-2xl hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={emailLoading}
                onClick={handleSendEmail}
                className="flex-1 py-4 px-6 bg-[var(--color-main)] text-white font-bold rounded-2xl shadow-lg shadow-[rgba(var(--color-main-rgb),0.3)] hover:brightness-110 flex items-center justify-center gap-2 disabled:opacity-70 active:scale-95 transition-all"
              >
                {emailLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <CheckCircle size={20} />
                )}
                {emailLoading ? "Sending..." : "Yes, Send"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Unified Toast Notification */}
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
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

      <div className="mt-8 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
        Secure Digital Preview • ID {certificateId}
      </div>
    </div>
  );
};

export default CertificateViewer;
