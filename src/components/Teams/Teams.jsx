import Table from "../Table";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLoading } from "../../contexts/LoadingContext";

function Teams() {
  const [teams, setTeams] = useState([]);
  const { isLoading, showLoading, hideLoading, showMessage, hideMessage } =
    useLoading();
  useEffect(() => {
    // Fetch volunteers from your API
    showLoading();
    const fetchVolunteers = async () => {
      try {
        const response = await fetch(
          "http://localhost/vms/backend/api/teams.php"
        );
        if (response) {
          const resp = await response.json();
          if (resp.result) {
            setTeams(resp.data);
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
    { field: "teamName", headerName: "Team Name", width: 130 },
    {
      field: "description",
      headerName: "description",
      width: 500,
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
    {
      field: "view",
      headerName: "View",
      description: "This column is to View.",
      sortable: false,
      width: 100,
      // Use `valueGetter` to combine multiple values
      renderCell: (params) => {
        // This is the key function
        return (
          <Link
            className="bg-blue-400 w-full h-full p-4 text-white rounded-lg hover:bg-gray-400 focus:bg-gray-700  transition-color duration-200 ease-linear"
            variant="contained"
            size="small"
            to={`/teams/${params.id}`}
          >
            View
          </Link>
        );
      },
    },
  ];
  return (
    <>
      {!isLoading && (
        <div className=" h-full  grid grid-cols-1 w-full">
          <div className="py-10 flex justify-between">
            <div className="">All Teams</div>
            <div className="">
              <Link
                className="bg-yellow-200 w-70  h-full p-4 text-white rounded-lg hover:bg-yellow-300 focus:bg-yellow-400 transition-color duration-200 ease-linear font-bold shadow-xl"
                to="/teams/add"
              >
                Add a Team
              </Link>
            </div>
          </div>
          <div className="w-full p-4">
            <Table rows={teams} columns={columns} />
          </div>
        </div>
      )}
    </>
  );
}

export default Teams;
