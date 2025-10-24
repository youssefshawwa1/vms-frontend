import React, { useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client"; // We need this to render imperatively
import html2pdf from "html2pdf.js";
import "../styles/fonts.css"; // Ensure this path is correct
import useFetching from "./useFetching";
import Certificate from "../Components/VolunteeringCertificates/Certificate";
// Import all assets here
/**
 * This is a private component *only* used by the hook.
 * It's responsible for rendering the template and running html2pdf
 * as soon as it's mounted.
 */
const cleanName = (name) => {
  return name.replace(/[\\/:\*?"<>|]/g, "_");
};
const CertificateRenderer = ({ data, onComplete }) => {
  const certificateRef = useRef(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  // This useEffect runs once on mount
  useEffect(() => {
    // Prevent double-runs and ensure ref is set
    if (hasGenerated || !certificateRef.current) {
      return;
    }
    setHasGenerated(true); // Mark as generated
    const element = certificateRef.current;

    const options = {
      margin: 0,
      filename: cleanName(
        `${data.fullName} ${data.type} ${data.issueDate}.pdf`
      ),
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 3,
        useCORS: true,
        width: 900,
        height: 600,
        backgroundColor: "#ffffff",
      },
      jsPDF: {
        unit: "px",
        format: [900, 600],
        orientation: "landscape",
      },
    };

    const runGenerator = async () => {
      try {
        await html2pdf().set(options).from(element).save();
      } catch (error) {
        console.error("PDF generation failed:", error);
      } finally {
        // Call the onComplete callback to clean up
        onComplete();
      }
    };

    runGenerator();
  }, [data, onComplete, hasGenerated]); // Dependencies

  return <Certificate ref={certificateRef} data={data} />;
};

export const useCertificateGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { fetchData } = useFetching();
  const fetchCertificate = async (id) => {
    const data = await fetchData(`certificates.php?id=${id}`);
    if (data) {
      return {
        certificateNumber: data.certificateNumber,
        fullName: data.fullDetails.volunteer.fullName,
        issueDate: data?.issueDate,
        certificateType: data.certificateType,
        customMessage: data.customMessage,
      };
    }
    return false;
  };
  const generateCertificate = async (id) => {
    if (isGenerating) return;
    setIsGenerating(true);
    const data = await fetchCertificate(id);
    if (!data) {
      setIsGenerating(false);
      return;
    }
    // 1. Create a container div
    const container = document.createElement("div");
    // Hide it
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.top = "-9999px";
    container.style.zIndex = "-1";
    document.body.appendChild(container);

    // 2. Create a React root in that container
    const root = createRoot(container);

    // 3. Define a cleanup function
    const onGenerationComplete = () => {
      // Unmount the React component
      root.unmount();
      // Remove the container from the DOM
      document.body.removeChild(container);
      // Reset loading state
      setIsGenerating(false);
    };

    // 4. Render the certificate component into the root
    root.render(
      <CertificateRenderer data={data} onComplete={onGenerationComplete} />
    );
  };

  return { generateCertificate, isGenerating };
};
