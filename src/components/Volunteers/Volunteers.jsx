import Table from "../Table";
import LinkBtn from "../LinkBtn";
import { useState, useEffect } from "react";
import { useLoading } from "../../contexts/LoadingContext";

function Volunteers({ type, onRowDoubleClick }) {
  const [volunteers, setVolunteers] = useState([]);
  const { isLoading, showLoading, hideLoading, showMessage, hideMessage } =
    useLoading();
  useEffect(() => {
    // Fetch volunteers from your API
    showLoading();
    const fetchVolunteers = async () => {
      try {
        const response = await fetch(
          "http://localhost/vms/backend/api/volunteers.php"
        );
        if (response) {
          const resp = await response.json();
          if (resp.result) {
            setVolunteers(resp.data);
            setTimeout(() => {
              hideLoading();
            }, 1000);
          } // console.log(await response.text());
          else {
            setTimeout(() => {
              hideLoading();
              showMessage(resp.message, "Internal Error");
            }, 1000);

            //show message error.
          }
        }
      } catch (error) {
        setTimeout(() => {
          hideLoading();
          //show message error, that there is a connection error with the server.
          showMessage("Server can't be Reached!", "Connection Error");
        }, 1000);
      } finally {
        setTimeout(() => {
          hideMessage();
        }, 3000);
      }
    };

    fetchVolunteers();
  }, []);
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "firstName", headerName: "First name", width: 100 },
    { field: "lastName", headerName: "Last name", width: 100 },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      sortable: true,
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 100,
      sortable: true,
    },
    {
      field: "birthDate",
      headerName: "Birth Date",
      width: 100,
      sortable: true,
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 80,
      sortable: true,
    },
    {
      field: "major",
      headerName: "Major",
      width: 100,
      sortable: true,
    },
    {
      field: "university",
      headerName: "University",
      width: 100,
      sortable: true,
    },
    // {
    //   field: "delete",
    //   headerName: "Delete",
    //   description: "This column is to delete.",
    //   sortable: false,
    //   width: 100,
    //   // Use `valueGetter` to combine multiple values
    //   renderCell: (params) => {
    //     // This is the key function

    //     return (
    //       <Button
    //         // onClick={handleClick}
    //         variant="contained"
    //         color="error"
    //         size="small"
    //       >
    //         Delete
    //       </Button>
    //     );
    //   },
    // },
  ];
  if (!type) {
    columns.push({
      field: "view",
      headerName: "View",
      description: "This column is to View.",
      sortable: false,
      width: 100,
      // Use `valueGetter` to combine multiple values
      renderCell: (params) => {
        // This is the key function
        return (
          // </Link>
          <LinkBtn to={`/volunteers/${params.id}`} text="View" />
        );
      },
    });
  }
  return (
    <>
      {!isLoading && (
        <div className=" h-full  grid grid-cols-1 w-full px-4 max-w-6xl mx-auto">
          {!type && (
            <div className="py-10 flex justify-between">
              <div className="">Add a Volunteer</div>
              <div className="">
                <LinkBtn to="/volunteers/add" text="Add a Volunteer" />
              </div>
            </div>
          )}
          <div className="w-full">
            <Table
              rows={volunteers}
              columns={columns}
              onRowDoubleClick={onRowDoubleClick}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Volunteers;
