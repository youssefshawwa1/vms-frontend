import Table from "../Global/Table";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLoading } from "../../contexts/LoadingContext";
import { MdReadMore } from "react-icons/md";
import { AddPerson } from "../Global/Icons";
import useFetching from "../Global/Helpers/useFetching";
function Volunteers({ type, onRowDoubleClick }) {
  const [volunteers, setVolunteers] = useState([]);
  const { isLoading } = useLoading();
  const { fetchData } = useFetching();
  useEffect(() => {
    const fetchVolunteers = async () => {
      await fetchData("volunteers.php", setVolunteers);
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
          <Link
            to={`${params.id}`}
            className="w-full h-full text-center flex justify-center items-center"
          >
            <MdReadMore className="text-yellow-400 text-4xl cursor-pointer hover:text-yellow-500 transition-colors" />
          </Link>
        );
      },
    });
  }
  return (
    <>
      {!isLoading && (
        <div className=" h-full grid grid-cols-1 w-full px-4 max-w-6xl mx-auto mb-10">
          {!type && (
            <div className="py-10 flex justify-between">
              <div className="">Add a Volunteer</div>
              <div className="">
                {/* <LinkBtn to="volunteers/add" text="Add a Volunteer" /> */}
                <Link
                  to="add"
                  className="w-full h-full text-center flex justify-center items-center"
                >
                  <AddPerson />
                </Link>
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
