import Table from "./Table";
const Tab = ({ columns, rows, filter, setFilter }) => {
  const filters = ["all", "current", "old"];

  return (
    <div>
      {/* Filter Controls */}
      <div className="mb-6 ">
        <label className="text-sm font-medium text-gray-700 mr-4">Show:</label>
        <div className="flex space-x-4 flex-col gap-2 sm:flex-row">
          {filters.map((f) => (
            <label
              key={f}
              className="inline-flex items-center text-blue-500 focus:ring-blue-500"
            >
              <input
                type="radio"
                name={`${filter}Filter`}
                value={f}
                checked={f === filter}
                onChange={(e) => setFilter(e.target.value)}
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 custom-radio "
              />
              <span className="ml-2 text-sm text-gray-700 capitalize">{f}</span>
            </label>
          ))}
        </div>
      </div>
      <Table columns={columns} rows={rows} />
    </div>
  );
};

export default Tab;
