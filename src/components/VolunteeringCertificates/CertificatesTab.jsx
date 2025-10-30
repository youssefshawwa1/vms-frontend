import { View, AddDocument, Download } from "../Global/Icons";
import { Link } from "react-router-dom";
import { useOverLay } from "../../Contexts/OverLayContext";
import { useEffect } from "react";
import Table from "../Global/Table";
import { useCertificateDownloader } from "../../Hooks/useCertificateDownloader";
const CertificatesTab = ({
  rows,
  type,
  whenVisible,
  handleAddCertificate,
  details,
}) => {
  const { downloadCertificate } = useCertificateDownloader();
  const { hideLoading } = useOverLay();

  // $cleanName . "_" . $cleanType . "_" . $cleanNum . "_" . $cleanDate . ".pdf";
  const handleDownload = (params) => {
    console.log(params);
    console.log(details);
    const fileName =
      params?.row?.name ||
      details.name +
        "_" +
        params.certificateType +
        "_" +
        params.row.certificateNumber +
        "_" +
        params.row.issueDate;
    console.log(fileName);
    downloadCertificate({ certificateId: params.id, filename: fileName });
  };

  useEffect(() => {
    hideLoading();
  }, []);
  let columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "certificateNumber", headerName: "Number", width: 130 },
  ];

  if (type == "forCertificates") {
    columns.push(
      { field: "name", headerName: "Volunteer Name:", width: 130 },
      {
        field: "email",
        headerName: "Email",
        width: 100,
      },
      {
        field: "phone",
        headerName: "Phone",
        width: 100,
      }
    );
  }
  columns.push(
    { field: "certificateTitle", headerName: "Title:", width: 130 },
    {
      field: "issueDate",
      headerName: "Issue Date",
      width: 100,
      valueGetter: (value, row) => {
        return new Date(row.issueDate).toLocaleString();
      },
    }
  );
  if (type == "forVolunteer") {
    columns.push(
      {
        field: "certificateDescription",
        headerName: "Description",
        width: 100,
      },
      {
        field: "customMessage",
        headerName: "Appearing Description",
        width: 100,
      },
      {
        field: "totalHoursAtIssue",
        headerName: "At Issue Hours",
        width: 100,
      }
    );
  }
  columns.push(
    {
      field: "volunteeringHours",
      headerName: "Hours",
      width: 100,
      valueGetter: (value, row) => {
        return row.volunteeringHours || "N/A";
      },
    },
    {
      field: "certificateType",
      headerName: "Type",
      width: 100,
      valueGetter: (value, row) => {
        return row.certificateType.toUpperCase();
      },
    },
    {
      field: "certificateKind",
      headerName: "Kind",
      width: 100,
      valueGetter: (value, row) => {
        return row.certificateKind == "withHours" ? "Hour Based" : "Normal";
      },
    },
    {
      field: "download",
      headerName: "Download",
      // description: "This column is to Add a task.",
      sortable: false,
      width: 80,
      // Use `valueGetter` to combine multiple values
      renderCell: (params) => {
        // This is the key function

        return (
          <button
            onClick={() => {
              handleDownload(params);
            }}
            className="w-full h-full text-center flex justify-center items-center"
          >
            <Download />
          </button>
        );
      },
    },

    {
      field: "view",
      headerName: "View",
      // description: "This column is to Add a task.",
      sortable: false,
      width: 80,
      // Use `valueGetter` to combine multiple values
      renderCell: (params, row) => {
        // This is the key function

        return (
          <Link
            to={`/certificates/${params.id}`}
            onClick={() => {
              // handleAddTask(params.row);
            }}
            className="w-full h-full text-center flex justify-center items-center"
          >
            <View />
          </Link>
        );
      },
    }
  );
  return (
    <div className="relative">
      {handleAddCertificate && (
        <div className="  rounded-lg p-4">
          <div className="flex items-center justify-between mb-3 border-b border-blue-900 pb-4">
            <h3 className="text-lg font-medium ">Details</h3>
          </div>
          <div className={"grid grid-cols-1"}>
            <div className="mb-4">
              <h3 className="text-md font-medium  mb-2 ">Certificates:</h3>
              <div className="grid grid-cols-1 gap-1">
                <div>
                  <div>
                    <span className="text-sm  font-medium">
                      Total Certificates:
                    </span>
                    <span className="ml-2">{`${rows.length || "N/A"}`}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-md font-medium mb-2 ">Hours Details:</h3>
              <div className="grid grid-cols-1 gap-1">
                <div>
                  <div>
                    <span className="text-sm  font-medium">Total Hours:</span>
                    <span className="ml-2 ">
                      {`${details?.totalHours || "N/A"} Hr`}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-sm  font-medium">Issued Hours:</span>
                  <span className="ml-2">
                    {`${details?.issuedHours || "N/A"} Hr`}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium">Current Hours:</span>
                  <span className="ml-2">
                    {`${
                      details?.currentHours || "N/A"
                    } Hr (Maximum that can be Issued)`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Table rows={rows} columns={columns} />
      {handleAddCertificate && (
        <div className="absolute top-0 right-0" onClick={handleAddCertificate}>
          <AddDocument />
        </div>
      )}
      {whenVisible ? whenVisible() : ""}
    </div>
  );
};
export default CertificatesTab;
