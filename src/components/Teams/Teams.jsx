import Table from "../Table";
import { useState, useEffect } from "react";
import { useLoading } from "../../contexts/LoadingContext";
import LinkBtn from "../LinkBtn";
function Teams() {
  const [teams, setTeams] = useState([]);
  const { isLoading, showLoading, hideLoading, showMessage, hideMessage } =
    useLoading();
  useEffect(() => {
    // Fetch volunteers from your API
    showLoading();
    const fetchTeams = async () => {
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

    fetchTeams();
  }, []);
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "teamName", headerName: "Team Name", width: 130 },
    {
      field: "description",
      headerName: "description",
      width: 700,
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
          // <Link
          //   className="bg-blue-400 w-full h-full p-4 text-white rounded-lg hover:bg-gray-400 focus:bg-gray-700  transition-color duration-200 ease-linear"
          //   variant="contained"
          //   size="small"
          //   to={`${params.id}`}
          // >
          //   View
          // </Link>
          <LinkBtn to={`${params.id}`} text="View" />
        );
      },
    },
  ];
  return (
    <>
      {!isLoading && (
        <div className=" h-full  grid grid-cols-1 px-4 max-w-6xl mx-auto">
          <div className="py-10 flex justify-between">
            <div className="">All Teams</div>
            <div className="">
              <LinkBtn to="add" text="Add a Team" />
            </div>
          </div>
          <div className="w-full">
            <Table rows={teams} columns={columns} />
          </div>
        </div>
      )}
    </>
  );
}

export default Teams;
