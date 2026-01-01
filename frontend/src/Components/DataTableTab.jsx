import { useParams, useOutletContext } from "react-router-dom";

const DataTableTab = ({ endpoint, columns }) => {
  const { id } = useParams();
  const { data: shellData } = useOutletContext(); // If you need data from the main fetch

  // Now you have:
  // 1. The ID from the URL
  // 2. The endpoint from the config (e.g., "tasks")
  // 3. The columns from the config

  return (
    <div className="p-4 bg-white rounded-xl border">
      <h3 className="mb-4 font-bold capitalize">{endpoint} List</h3>
      {/* Your table rendering logic here using 'columns' and a fetch to 'endpoint' */}
    </div>
  );
};
export default DataTableTab;
