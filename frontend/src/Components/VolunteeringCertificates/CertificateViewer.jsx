import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Button,
} from "@mui/material";
import { Download } from "@mui/icons-material";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

const CertificateViewer = ({ data }) => {
  const { id } = useParams(); // Get ID from URL /certificates/:id/view
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Determine the ID: URL param takes priority, fallback to prop data
  const certificateId = id || data?.certificateId || data?.id;

  useEffect(() => {
    const fetchImage = async () => {
      // If we still don't have an ID, we can't fetch
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
        console.error("Preview Fetch Error:", err);
        setError("Failed to load certificate preview.");
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [certificateId]); // Re-run if ID changes

  const handleDownload = () => {
    if (!previewData) return;
    const { imageInfo, preview } = previewData.image;
    const link = document.createElement("a");
    link.href = `data:${imageInfo.imageType};base64,${preview}`;
    link.download = `${imageInfo.fileName || "certificate"}.jpg`;
    link.click();
  };

  if (loading)
    return (
      <Box className="flex flex-col items-center justify-center p-20">
        <CircularProgress sx={{ color: "var(--color-main)" }} />
        <Typography sx={{ mt: 2, fontWeight: 700, color: "text.secondary" }}>
          Generating Preview...
        </Typography>
      </Box>
    );

  if (error || !previewData)
    return (
      <Box className="p-10 text-center text-red-500 font-bold">
        {error || "No preview available for this certificate."}
      </Box>
    );

  const { imageInfo, preview } = previewData.image;

  return (
    <Box className="animate-slide-up">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Certificate Preview
        </Typography>
        <Button
          startIcon={<Download />}
          onClick={handleDownload}
          sx={{
            color: "var(--color-main)",
            fontWeight: 700,
            "&:hover": { backgroundColor: "rgba(var(--color-main-rgb), 0.05)" },
          }}
        >
          Download JPG
        </Button>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          backgroundColor: "#f3f4f6",
          borderRadius: "24px",
          display: "flex",
          justifyContent: "center",
          border: "1px solid #e5e7eb",
          minHeight: "400px",
          alignItems: "center",
        }}
      >
        <img
          src={`data:${imageInfo.imageType};base64,${preview}`}
          alt="Certificate"
          style={{
            maxWidth: "100%",
            height: "auto",
            borderRadius: "8px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          }}
        />
      </Paper>
    </Box>
  );
};

export default CertificateViewer;
