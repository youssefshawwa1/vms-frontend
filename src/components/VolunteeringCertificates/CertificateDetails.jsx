import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetching from "../../Hooks/useFetching";
import Card from "../Global/Card";
import { Edit, Cancel, Download } from "../Global/Icons";
import CertificateForm from "./CertificateForm";
import { useCertificateDownloader } from "../../Hooks/useCertificateDownloader";
import { useDocumentTitle } from "../../Hooks/useDocumentTitle";
import CertificateViewer from "./CertificateViewer";
const CertificateDetails = () => {
  const { downloadCertificate, isLoading } = useCertificateDownloader();
  const [certificateDetails, setCertificateDetails] = useState(null);
  const { fetchData } = useFetching();
  const { id } = useParams();
  const [cardData, setCardData] = useState(null);
  const [edit, setEdit] = useState(false);
  const [refetch, setReFetch] = useState(false);
  const [data, setData] = useState(null);
  const canEdit = () => {
    const certificateDate = new Date(data.issueDate);
    const currentDate = new Date();
    const diffTime = currentDate - certificateDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };
  useEffect(() => {
    const fetchCertificateData = async () => {
      const shouldFetch = !certificateDetails;
      if (!shouldFetch) {
        return;
      }
      try {
        let certificateData;

        if (shouldFetch) {
          certificateData = await fetchData(`certificates.php?id=${id}`);
        }
        if (certificateData) {
          setEdit(false);
          setCertificateDetails(certificateData);
          setData(certificateData);
          console.log(certificateData);
          setCardData({
            label: certificateData.certificateTitle,
            description: certificateData.certificateDescription,
            lastItem: {
              label: "Certificate ID:",
              text: certificateData.certificateNumber,
            },
            sections: [
              {
                label: "Certificate Info",
                row: true,
                items: [
                  {
                    label: "Appearing Description: ",
                    text: certificateData.customMessage,
                  },
                  {
                    label: "Certificate Type: ",
                    text: certificateData.certificateType.toUpperCase(),
                  },
                  {
                    label: "Certificate Kind: ",
                    text:
                      certificateData.certificateKind == "withHours"
                        ? "Hours Based"
                        : "Normal",
                  },
                  {
                    label: "Issue Date:",
                    text: certificateData.issueDate,
                  },
                  {
                    label: "Volunteering Hours:",
                    text: `${certificateData.volunteeringHours || "N/A"} Hr`,
                  },
                  {
                    label: "Total Hours at Issue:",
                    text: `${certificateData.volunteeringHours || "N/A"} Hr`,
                  },
                ],
              },
              {
                label: "Volunteer Info",
                items: [
                  {
                    label: "Full Name:",
                    text: certificateData.fullDetails.volunteer.fullName,
                  },
                  {
                    label: "Email:",
                    text: certificateData.fullDetails.volunteer.email,
                  },
                  {
                    label: "Phone:",
                    text: certificateData.fullDetails.volunteer.phone,
                  },
                ],
              },
              {
                type: "last",
                items: [
                  {
                    type: "last",
                    label: "Issued At:",
                    text: certificateData.issueDate,
                  },
                  {
                    type: "last",
                    label: "By:",
                    text: certificateData.fullDetails.createdBy.userName,
                  },
                  {
                    type: "last",
                    label: "Updated:",
                    text: certificateData.updatedAt,
                  },
                  {
                    type: "last",
                    label: "By:",
                    text:
                      certificateData.fullDetails.updatedBy?.userName || "N/A",
                  },
                ],
              },
            ],
          });
        }
      } catch (error) {
        console.log("Fetch error:", error);
      }
    };

    fetchCertificateData();
  }, [refetch]);

  const handleRefetch = () => {
    setCertificateDetails(null);
    setEdit((prev) => !prev);
    setReFetch((prev) => !prev);
  };
  const handleDownload = () => {
    const fileName =
      data.fullDetails.volunteer.fullName +
      "_" +
      data.certificateType +
      "_" +
      data.certificateNumber +
      "_" +
      data.issueDate;
    console.log(fileName);
    downloadCertificate({ certificateId: data.id, filename: fileName });
  };
  useDocumentTitle([certificateDetails?.certificateTitle, "Certificate"]);
  return (
    <div className="px-4 w-full mx-auto mb-10 fadeIn">
      <Link
        to="/volunteers"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        ← Back to Volunteers
      </Link>
      {data && (
        <div className="bg-white rounded-lg shadow-md mb-6 border border-gray-200">
          <div className="fadeIn relative">
            {!edit && (
              <div className="fadeIn p-6">
                {canEdit() && (
                  <div
                    className="absolute top-0 right-0 m-2 p-1 z-55 cursor-pointer"
                    onClick={() => setEdit(!edit)}
                  >
                    <Edit />
                  </div>
                )}
                {
                  <div
                    className={`absolute top-0 right-15 m-2 p-1 z-55 cursor-pointer ${
                      isLoading && "animate-pulse"
                    }`}
                    onClick={() => {
                      handleDownload();
                    }}
                  >
                    <Download />
                  </div>
                }
                <Card data={cardData} />
                {/* <Certificate data={data} ref={null} /> */}
              </div>
            )}
            {edit && canEdit() && (
              <div className="fadeIn p-6">
                <p className="text-red-400 text-xs pr-6 mb-4">
                  <span className="font-bold">Note:</span> If you are chaning
                  the volunteering hours, they will be changed also to the
                  volunteer. You are allowed to update certificate, in 7 days
                  after the issue date.
                </p>
                <div
                  className="absolute top-0 right-0 m-2 p-1 z-55 cursor-pointer"
                  onClick={() => setEdit(!edit)}
                >
                  <Cancel />
                </div>
                <CertificateForm
                  volunteerrDetails={{
                    id: data.fullDetails.volunteer.volunteerId,
                  }}
                  certificateDetails={data}
                  callBack={handleRefetch}
                />
              </div>
            )}
          </div>
        </div>
      )}
      {data && !edit && (
        <div className="my-10">
          <CertificateViewer certificateId={data.id} />
        </div>
      )}
    </div>
  );
};

export default CertificateDetails;
