import { useState } from "react";
import useFetching from "./useFetching";

export const useCertificateDownloader = () => {
  const { fetchData } = useFetching();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  //   /**
  //    * Triggers the download of a certificate.
  //    * @param {object} params
  //    * @param {string|number} params.certificateId - The ID of the certificate to download.
  //    * @param {string} params.filename - The desired filename (e.g., "my_certificate.pdf").
  //    */
  const cleanName = (name) => {
    // I added \s to the list of characters to replace
    let cleanedName = name.replace(/[\\/:\*?"<>|\s]/g, "_");
    cleanedName = cleanedName.replace(/_+/g, "_");
    return cleanedName;
  };
  const downloadCertificate = async ({
    certificateId,
    filename = "certificate.pdf",
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Fetch the PDF.
      // We assume your `fetchData` with 'true' as the third param
      // returns the raw response object.
      const response = await fetchData(
        `certificates.php?id=${certificateId}&action=view`,
        null,
        true
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.statusText}`);
      }

      // 2. Get the response as a Blob
      const pdfBlob = await response.blob();

      // 3. Create a temporary URL for this blob
      const objectUrl = URL.createObjectURL(pdfBlob);

      // --- The "Memory Link Trick" ---

      // 4. Create a new, invisible link element
      const link = document.createElement("a");
      link.style.display = "none";

      // 5. Set the href to the blob URL
      link.href = objectUrl;

      // 6. Set the download attribute to the desired filename
      const cleanFileName = cleanName(filename) + ".pdf";
      link.download = cleanFileName;

      // 7. Add the link to the body and click it
      document.body.appendChild(link);
      link.click();

      // 8. Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error("Download failed:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Return the state and the function for your components to use
  return { isLoading, error, downloadCertificate };
};
