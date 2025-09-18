import Table from "../Table";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLoading } from "../../contexts/LoadingContext";
function Volunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const { showLoading, hideLoading, isLoading } = useLoading();
  useEffect(() => {
    // Fetch volunteers from your API
    const fetchVolunteers = async () => {
      // showLoading();
      try {
        const response = await fetch(
          "http://192.168.0.5/vms/backend/api/volunteers.php"
        );
        if (response) {
          const resp = await response.json();
          if (resp.result) {
            setVolunteers(resp.data);
            setTimeout(() => {
              hideLoading();
            }, 100);
          } // console.log(await response.text());
          else if (!resp.result) {
            console.log("wowo");
            //show message error.
          }
        }
      } catch (error) {
        setTimeout(() => {
          //show message error, that there is a connection error with the server.
          console.log(error);
        }, 2000);
      }
    };

    fetchVolunteers();
  }, []);
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "firstName", headerName: "First name", width: 130 },
    { field: "lastName", headerName: "Last name", width: 130 },
    {
      field: "email",
      headerName: "Email",
      width: 300,
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
      width: 100,
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
            to={`/volunteers/${params.id}`}
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
          <div className="py-10 flex justify-end">
            <div className="">
              {/* <Box variant="contained" color="primary" size="large">
            Add a Volunteer
          </Box> */}
            </div>
            <div className="">
              <Link
                className="bg-yellow-200 w-70  h-full p-4 text-white rounded-lg hover:bg-yellow-300 focus:bg-yellow-400 transition-color duration-200 ease-linear font-bold shadow-xl"
                to="/volunteers/add"
              >
                Add a Volunteer
              </Link>
            </div>
          </div>
          <div className="w-full">
            <Table rows={volunteers} columns={columns} />
          </div>
        </div>
      )}
    </>
  );
}

export default Volunteers;
