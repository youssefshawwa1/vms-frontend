const SelectionCard = ({ data }) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium text-blue-900">
          {data.title || "N/A"}
        </h3>
        <button
          onClick={data.cancel.onClick}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
        >
          {data.cancel.title || "N/A"}
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        {data.items.map((item, index) => {
          return (
            <div key={index}>
              <span className="text-sm text-blue-900  font-medium">
                {item.label || "N/A"}:
              </span>
              <span className="ml-2 text-blue-900">{item.text || "N/A"}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default SelectionCard;
