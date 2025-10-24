import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef, // Import forwardRef
} from "react";
import html2pdf from "html2pdf.js";
import "../Pages/Certificate.css"; // Make sure this path is correct
// Imports your static assets
import upleftImage from "../assets/upleft.png";
import logoImage from "../assets/logo.png";
import ibrahimSignature from "../assets/ibrahim.png";
import alJalilahSignature from "../assets/al-jalilah.png";
import youssefSignature from "../assets/youssef.png";
import bottomrightImage from "../assets/bottomright.png";

// --- Define the Template Component ---
// We use forwardRef to pass the ref from the provider to the <div>
const CertificateTemplate = forwardRef(({ data }, ref) => (
  // Use absolute positioning to hide it instead of display:none
  // This ensures the element has dimensions for html2canvas
  <div
    style={{
      position: "absolute",
      left: "-9999px",
      top: "-9999px",
      zIndex: -1,
    }}
  >
    <div ref={ref} className="certificate">
      <img src={upleftImage} alt="upleft" className="upleft" />
      <div className="date">DATE: {data?.date || "SEPTEMBER 2025"}</div>

      <div className="header">
        <div className="logo">
          <img src={logoImage} alt="FEKRA Logo" />
        </div>
        <h1>CERTIFICATE</h1>
        <h2>OF ATTENDANCE</h2>
      </div>

      <div className="certify">THIS IS TO CERTIFY THAT</div>
      <div className="name">{data?.name || "Name Here"}</div>

      <div className="under">
        <div className="circle"></div>
        <div className="under-name"></div>
        <div className="circle"></div>
      </div>

      <div className="description">
        HAS ATTENDED THE "{data?.session || "NUTRITION FOR FOCUS AND ENERGY"}"
        SESSION <br />
        FACILITATED BY <strong>FEKRA</strong> ON{" "}
        {data?.sessionDate || "30/09/25"}.
      </div>

      <div className="signatures">
        {/* ... (Your three signature-block divs) ... */}
        <div className="signature-block">
          <div className="signature-name">
            <img className="signature" src={ibrahimSignature} alt="ibrahim" />
          </div>
          <div className="signature-line"></div>
          <div className="title">
            Ibrahim Mohammad <br />
            Founder
          </div>
        </div>

        <div className="signature-block">
          <div className="signature-name">
            <img
              className="signature"
              src={alJalilahSignature}
              alt="al-jalilah"
            />
          </div>
          <div className="signature-line"></div>
          <div className="title">
            Al-Jalilah Shreih <br />
            Founder
          </div>
        </div>

        <div className="signature-block">
          <div className="signature-name">
            <img className="signature" src={youssefSignature} alt="youssef" />
          </div>
          <div className="signature-line"></div>
          <div className="title">
            Youssef Shawwa <br />
            CEO
          </div>
        </div>
      </div>

      <img
        className="bottomright"
        src={bottomrightImage}
        alt="bottom right decoration"
      />
    </div>
  </div>
));

// --- Create the Context ---
const CertificateContext = createContext(null);

// --- Create the Provider Component ---
export const CertificateProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [triggerGeneration, setTriggerGeneration] = useState(false);
  const certificateRef = useRef(null);

  // This is the function other components will call
  const generateCertificate = useCallback(
    (certificateData) => {
      if (isGenerating) return; // Prevent simultaneous generations
      console.log("Setting data and triggering generation:", certificateData);
      setData(certificateData); // 1. Set the data
      setTriggerGeneration(true); // 2. Trigger the useEffect
    },
    [isGenerating]
  ); // Dependency on isGenerating

  // This effect runs *after* the component re-renders with new `data`
  useEffect(() => {
    // Only run if triggered and all elements are ready
    if (!triggerGeneration || !certificateRef.current || !data) {
      return;
    }

    // Reset the trigger
    setTriggerGeneration(false);
    setIsGenerating(true);

    const options = {
      margin: 0,
      filename: `${data.name || "certificate"}.pdf`,
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

    // Use an async IIFE to run the PDF generation
    (async () => {
      try {
        console.log("Generating PDF from ref:", certificateRef.current);
        const pdfBlob = await html2pdf()
          .set(options)
          .from(certificateRef.current)
          .output("blob");

        const blobUrl = URL.createObjectURL(pdfBlob);
        window.open(blobUrl, "_blank");

        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
        }, 1000);
      } catch (error) {
        console.error("PDF generation failed:", error);
      } finally {
        setIsGenerating(false);
        setData(null); // Clear data after generation
      }
    })();
  }, [data, triggerGeneration]); // This effect depends on data and the trigger

  // The value provided to consuming components
  const value = { generateCertificate, isGenerating };

  return (
    <CertificateContext.Provider value={value}>
      {children}
      {/* This is the magic! We render the hidden template here, 
        inside the provider, so it's always in the DOM. 
      */}
      <CertificateTemplate ref={certificateRef} data={data} />
    </CertificateContext.Provider>
  );
};

// --- Create the Consumer Hook ---
// This is what your components will use
export const useCertificateGenerator = () => {
  const context = useContext(CertificateContext);
  if (!context) {
    throw new Error(
      "useCertificateGenerator must be used within a CertificateProvider"
    );
  }
  return context;
};
