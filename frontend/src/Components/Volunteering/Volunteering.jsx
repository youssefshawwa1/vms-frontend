import { useOverLay } from "../../Contexts/OverLayContext";
import GenericTable from "../Global/GenericTable";
import { useNavigate } from "react-router-dom";
import { volunteeringColumnsForVolunteering as columns } from "../Global/Columns";
const Volunteering = () => {
  const { hideLoading } = useOverLay();
  const navigate = useNavigate();

  hideLoading();
  const handleRowDoulbeClick = (row) => {
    navigate(`/volunteers/${row.volunteerId}`);
  };
  const handleAddNew = () => {
    navigate("/volunteers/add");
  };
  return (
    <GenericTable
      columns={columns}
      apiEndpoint={"/volunteering"}
      title={"Volunteering"}
      searchPlaceholder="Search volunteering..."
      description="Explore volunteering rules data, click on a row to show more details"
      onRowDoubleClick={handleRowDoulbeClick}
      rowId="teamVolunteerId"
      addNew={handleAddNew}
    />
  );
};

export default Volunteering;
