import { useOverLay } from "../Contexts/OverLayContext";
import GenericTable from "../Components/Global/GenericTable";
import { useNavigate } from "react-router-dom";
import { teamsColumns as columns } from "../tableConfig/teamConfig";

function Teams() {
  const { hideLoading } = useOverLay();
  const navigate = useNavigate();

  hideLoading();
  const handleRowDoulbeClick = (row) => {
    navigate(`/teams/${row.teamId}`);
  };
  const handleAddNew = () => {
    navigate("/teams/create");
  };
  return (
    <GenericTable
      columns={columns}
      apiEndpoint={"/teams"}
      title={"Teams"}
      searchPlaceholder="Search Teams..."
      description="Explore teams data, click on a row to show more details"
      onRowDoubleClick={handleRowDoulbeClick}
      rowId="teamId"
      addNew={handleAddNew}
    />
  );
}

export default Teams;
