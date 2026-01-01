import { useOverLay } from "../Contexts/OverLayContext";
import GenericTable from "../Components/Global/GenericTable";
import { useNavigate } from "react-router-dom";
import { volunteerColumns as columns } from "../tableConfig/volunteerConfig";
function Volunteers() {
  const { hideLoading } = useOverLay();
  const navigate = useNavigate();

  hideLoading();
  const handleRowDoulbeClick = (row) => {
    navigate(`/volunteers/${row.volunteerId}`);
  };
  const handleAddNew = () => {
    navigate("/volunteers/create");
  };
  return (
    <GenericTable
      columns={columns}
      apiEndpoint={"/volunteers"}
      title={"Volunteers"}
      searchPlaceholder="Search Volunteers..."
      description="Explore volunteers data, click on a row to show more details"
      onRowDoubleClick={handleRowDoulbeClick}
      rowId="volunteerId"
      addNew={handleAddNew}
    />
  );
}

export default Volunteers;
