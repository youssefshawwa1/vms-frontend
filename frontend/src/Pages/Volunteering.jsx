import { useOverLay } from "../Contexts/OverLayContext";
import GenericTable from "../Components/Global/GenericTable";
import { useNavigate } from "react-router-dom";
import { volunteeringColumnsForVolunteering as columns } from "../tableConfig/volunteeringConfig";
const Volunteering = () => {
  const { hideLoading } = useOverLay();
  const navigate = useNavigate();

  hideLoading();
  const handleRowDoulbeClick = (row) => {
    navigate(`/volunteering/${row.teamVolunteerId}`);
  };
  const handleAddNew = () => {
    // navigate("/volunteering/add");
  };
  return (
    <div className="p-7 w-full">
      <GenericTable
        columns={columns}
        apiEndpoint={"/volunteering"}
        title={"Volunteering"}
        initialFilters={{
          items: [
            {
              id: 1,
              field: "active",
              operator: "is",
              value: 1,
            },
          ],
        }}
        searchPlaceholder="Search volunteering..."
        description="Explore volunteering rules data, click on a row to show more details"
        onRowDoubleClick={handleRowDoulbeClick}
        rowId="teamVolunteerId"
        // addNew={handleAddNew}
      />
    </div>
  );
};

export default Volunteering;
