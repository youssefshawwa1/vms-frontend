import { useOverLay } from "../Contexts/OverLayContext";
import GenericTable from "../Components/Global/GenericTable";
import { useNavigate } from "react-router-dom";
import { usersColumnsForAdmin as columns } from "../config/userConfig";

function Users() {
  const { hideLoading } = useOverLay();
  const navigate = useNavigate();

  hideLoading();
  const handleRowDoulbeClick = (row) => {
    // navigate(`/teams/${row.teamId}`);
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
        addNew={handleAddNew}
      />
    </div>
  );
}

export default Users;
