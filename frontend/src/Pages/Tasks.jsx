import { useOverLay } from "../Contexts/OverLayContext";
import GenericTable from "../Components/Global/GenericTable";
import { useNavigate } from "react-router-dom";
import {
  tasksColumnsForTasks as columns,
  getRowClassName,
  columnsStyles,
} from "../tableConfig/taskConfig";
const Tasks = () => {
  const { hideLoading } = useOverLay();
  const navigate = useNavigate();

  hideLoading();
  const handleRowDoulbeClick = (row) => {
    // navigate(`/tasks/${row.volunteerId}`);
  };
  const handleAddNew = () => {
    // navigate("/tasks/add");
  };

  return (
    <GenericTable
      getRowClassName={getRowClassName}
      customStyles={columnsStyles}
      columns={columns}
      apiEndpoint={"/tasks"}
      title={"Tasks"}
      initialFilters={{
        items: [
          {
            id: 1,
            field: "completed",
            operator: "is",
            value: false,
          },
        ],
      }}
      searchPlaceholder="Search tasks..."
      description="Explore tasks rules data, click on a row to show more details"
      onRowDoubleClick={handleRowDoulbeClick}
      rowId="taskId"
      addNew={handleAddNew}
    />
  );
};

export default Tasks;
