import { useState, useEffect } from "react";
import useFetching from "../../Hooks/useFetching";
// This component fetches the PDF from your PHP script
// and displays it in an iframe.
function CertificateViewer({ certificateId }) {
  const { fetchData } = useFetching();
  // pdfUrl will hold the temporary blob URL (e.g., "blob:http://...")
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Define the URL for your PHP endpoint

    // Create a variable to hold the blob URL so we can clean it up
    let objectUrl = null;

    const fetchPdf = async () => {
      try {
        // 2. Fetch the PDF

        const response = await fetchData(
          `certificates.php?id=${certificateId}&action=view`,
          null,
          true
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch PDF: ${response.statusText}`);
        }
        const pdfBlob = await response.blob();

        // 4. Create a temporary URL for this blob
        // This creates a special URL that points to the data
        // in the browser's memory.
        objectUrl = URL.createObjectURL(pdfBlob);

        // 5. Set this temporary URL in our state
        setPdfUrl(objectUrl);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPdf();

    // 6. Cleanup Function (This is very important!)
    // This function runs when the component is unmounted.
    return () => {
      if (objectUrl) {
        // We must revoke the URL to prevent memory leaks
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [certificateId]); // Re-run this whole effect if the certificateId changes

  // --- Render Logic ---

  if (isLoading) {
    return <div className="text-center">Loading certificate...</div>;
  }

  if (error) {
    return <div className="text-center">Error</div>;
  }

  return (
    <iframe
      className="certificate-iframe"
      src={pdfUrl}
      width="100%"
      height="700px" // Set a good height
      title="Certificate Viewer"
      style={{
        border: "1px solid #ffffffff",
      }}
    />
  );
}

export default CertificateViewer;
