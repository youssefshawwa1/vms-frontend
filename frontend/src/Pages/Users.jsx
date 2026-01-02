import GenericTable from "../Components/Global/GenericTable";
import { useNavigate } from "react-router-dom";
import { usersColumnsForAdmin as columns } from "../config/userConfig";
import { useAuth } from "../Contexts/AuthContext";
function Users() {
  const { user } = useAuth();
  const navigate = useNavigate();
  console.log(user);
  const handleRowDoulbeClick = (row) => {
    navigate(`/users/${row.userId}`);
  };
  const handleAddNew = () => {
    // navigate("/teams/add");
  };
  return (
    <div className="p-7 w-full">
      <GenericTable
        columns={columns}
        apiEndpoint={"/users"}
        title={"Users"}
        searchPlaceholder="Search Users..."
        description="Explore Users data, click on a row to show more details"
        onRowDoubleClick={handleRowDoulbeClick}
        rowId="userId"
        addNew={user?.userRole == "Admin" ? handleAddNew : null}
      />
    </div>
  );
}

export default Users;
