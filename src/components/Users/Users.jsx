import Table from "../Global/Table";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useOverLay } from "../../Contexts/OverLayContext";
import { AddPerson } from "../Global/Icons";
import { View } from "../Global/Icons";
import useFetching from "../../Hooks/useFetching";
import { useAuth } from "../../Contexts/AuthContext";
function Users({ type, onRowDoubleClick }) {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const { isLoading } = useOverLay();
  const { fetchData } = useFetching();
  useEffect(() => {
    const fetchUsers = async () => {
      await fetchData("users.php", (users) => {
        setUsers(
          users.filter((item) => {
            console.log(
              `User: ${item.userName}     current user: ${user.username}`
            );
            return item.userName != user.username;
          })
        );
      });
    };

    fetchUsers();
  }, []);
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "userName", headerName: "Username", width: 100 },
    { field: "userEmail", headerName: "Email", width: 300 },
    {
      field: "status",
      headerName: "Status",
      width: 90,
      valueGetter: (value, row) => {
        return row.status ? "Active" : "Disactive";
      },
    },
  ];
  //temp permistion (role based)
  if (user.role.toLowerCase() == "admin") {
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
            <View />
          </Link>
        );
      },
    });
  }
  return (
    <>
      {!isLoading && (
        <div className=" h-full grid grid-cols-1 w-full px-4 mx-auto mb-10  animate-slide-up">
          {!type && user.role.toLowerCase() == "admin" && (
            <div className="py-10 flex justify-end">
              {/* <div className="">Add a Volunteer</div> */}
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
          <div className="w-full  animate-slide-up">
            <Table
              rows={users}
              columns={columns}
              onRowDoubleClick={onRowDoubleClick}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Users;
