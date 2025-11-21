import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetching from "../../Hooks/useFetching";
import Card from "../Global/Card";
import { Edit, Cancel, Download, Email } from "../Global/Icons";
import CertificateForm from "./CertificateForm";
import { useCertificateDownloader } from "../../Hooks/useCertificateDownloader";
import { useDocumentTitle } from "../../Hooks/useDocumentTitle";
import CertificateViewer from "./CertificateViewer";
import { useOverLay } from "../../Contexts/OverLayContext";
const CertificateDetails = () => {
  const { showPopUp, hidePopUp } = useOverLay();
  const { downloadCertificate, isLoading } = useCertificateDownloader();
  const [certificateDetails, setCertificateDetails] = useState(null);
  const { fetchData, sendData } = useFetching();
  const { id } = useParams();
  const [cardData, setCardData] = useState(null);
  const [edit, setEdit] = useState(false);
  const [refetch, setReFetch] = useState(false);
  const [data, setData] = useState(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
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
                    text: certificateData.volunteeringHours,
                  },
                  {
                    label: "Total Hours at Issue:",
                    text: certificateData.totalHoursAtIssue,
                  },
                  {
                    label: "Email Sent:",
                    text: certificateData.emailSendCount,
                  },
                  {
                    label: "Last Email Sent:",
                    text: certificateData.firstEmailSentAt,
                  },
                  {
                    label: "First Email Sent:",
                    text: certificateData.lastEmailSentAt,
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
                    text: certificateData.fullDetails.updatedBy?.userName,
                  },
                ],
              },
            ],
          });
        }
      } catch (error) {
        return;
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

    downloadCertificate({ certificateId: data.id, filename: fileName });
  };
  const handleSendByEmail = () => {
    const handleSend = async () => {
      setIsSendingEmail(true);
      const d = {
        action: "sendByEmail",
        data: {
          certificateId: data.id,
        },
      };
      await sendData("certificates.php", d, () => {
        handleRefetch();
        hidePopUp();
        setIsSendingEmail(false);
      });
    };
    showPopUp(
      "Send By Email",
      <>
        <div className="p-3 space-y-0">
          <p className="block text-sm font-medium text-gray-500 ">
            Do you really want to send this certificate to:
            <br />
            <b>{data.fullDetails.volunteer.email}</b>.
          </p>
          {data.emailSendCount > 0 && (
            <p className="block text-sm font-medium text-gray-500 ">
              Already sent: {data.emailSendCount} time
              {data.emailSendCount > 1 && "s"}.
            </p>
          )}
        </div>
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-300">
          <button
            type="button"
            onClick={handleSend}
            className="px-4 py-2 bg-main text-white rounded-md hover:bg-main-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
          >
            Send
          </button>
        </div>
      </>
    );
  };
  useDocumentTitle([certificateDetails?.certificateTitle, "Certificate"]);
  return (
    <div className="px-4 w-full mx-auto mb-10  animate-slide-up">
      {data && (
        <div className="bg-white rounded-lg shadow-md mb-6 border border-gray-200">
          <div className=" animate-slide-up relative">
            {!edit && (
              <div className=" animate-slide-up p-6">
                {canEdit() && (
                  <div
                    className="absolute top-0 right-0 m-2 p-1 z-55 cursor-pointer"
                    onClick={() => setEdit(!edit)}
                  >
                    <Edit />
                  </div>
                )}

                <div
                  className={`absolute top-0 right-12 m-2 p-1 z-55 cursor-pointer ${
                    isLoading && "animate-pulse"
                  }`}
                  onClick={() => {
                    handleDownload();
                  }}
                >
                  <Download />
                </div>
                <div
                  className={`absolute top-0 right-24 m-2 p-1 z-55 cursor-pointer ${
                    isSendingEmail && "animate-pulse"
                  }`}
                  onClick={() => {
                    handleSendByEmail();
                  }}
                >
                  <Email />
                </div>

                <Card data={cardData} />
              </div>
            )}
            {edit && canEdit() && (
              <div className=" animate-slide-up p-6">
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
