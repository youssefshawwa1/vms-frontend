import React, { useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import "../styles/fonts.css";
import "./Certificate.css";

// Import images statically
import upleftImage from "../assets/upleft.png";
import logoImage from "../assets/logo.png";
import ibrahimSignature from "../assets/ibrahim.png";
import alJalilahSignature from "../assets/al-jalilah.png";
import youssefSignature from "../assets/youssef.png";
import bottomrightImage from "../assets/bottomright.png";

const Certificate = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const certificateRef = useRef(null);

  const generatePDF = async () => {
    if (!certificateRef.current) return;

    setIsGenerating(true);

    const options = {
      margin: 0,
      filename: "certificate.pdf",
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

    try {
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
    }
  };

  return (
    <div className="w-full">
      <div style={{ display: "none" }}>
        <div ref={certificateRef} className="certificate">
          <img src={upleftImage} alt="upleft" className="upleft" />
          <div className="date">DATE: SEPTEMBER 2025</div>

          <div className="header">
            <div className="logo">
              <img src={logoImage} alt="FEKRA Logo" />
            </div>
            <h1>CERTIFICATE</h1>
            <h2>OF ATTENDANCE</h2>
          </div>

          <div className="certify">THIS IS TO CERTIFY THAT</div>
          <div className="name">Name Here</div>

          <div className="under">
            <div className="circle"></div>
            <div className="under-name"></div>
            <div className="circle"></div>
          </div>
          <div className="description">
            HAS ATTENDED THE "NUTRITION FOR FOCUS AND ENERGY" SESSION <br />
            FACILITATED BY <strong>FEKRA</strong> ON 30/09/25.
          </div>

          <div className="signatures">
            <div className="signature-block">
              <div className="signature-name">
                <img
                  className="signature"
                  src={ibrahimSignature}
                  alt="ibrahim's signature"
                />
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
                  alt="al-jalilah's signature"
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
                <img
                  className="signature"
                  src={youssefSignature}
                  alt="youssef's signature"
                />
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

      <button onClick={generatePDF} className="btn" disabled={isGenerating}>
        {isGenerating ? "Generating PDF..." : "View Certificate PDF"}
      </button>
    </div>
  );
};

export default Certificate;
