import { useOverLay } from "../Contexts/OverLayContext";
import GenericTable from "../Components/Global/GenericTable";
import { useNavigate } from "react-router-dom";
import { certificatesColumnsForCertificates as columns } from "../tableConfig/certificateConfig";

function Certificates() {
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
    <GenericTable
      columns={columns}
      apiEndpoint={"/certificates"}
      title={"Certificates"}
      searchPlaceholder="Search Certificates..."
      description="Explore certificates data, click on a row to show more details"
      onRowDoubleClick={handleRowDoulbeClick}
      rowId="certificateId"
      // addNew={handleAddNew}
    />
  );
}

export default Certificates;
