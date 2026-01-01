import { useOutletContext } from "react-router-dom";

/**
 * DetailOverview Component
 * @param {Object} config - The field and section configuration
 * @param {Array} actions - Optional action components (like CompleteTaskAction)
 */
const DetailOverview = ({ config, actions = [] }) => {
  const context = useOutletContext();
  const data = context?.data;
  const onRefresh =
    context?.refreshData ||
    context?.onRefresh ||
    (() => window.location.reload());

  if (!data) {
    return <div className="p-6 text-slate-500">Loading data...</div>;
  }

  if (!config || !config.sections) {
    return <div className="p-6 text-slate-500">Loading configuration...</div>;
  }

  const formatValue = (value, type) => {
    if (value === null || value === undefined || value === "") return "—";
    switch (type) {
      case "date":
        return new Date(value).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      case "dateTime":
        return new Date(value).toLocaleString();
      case "boolean":
        return value ? "Yes" : "No";
      default:
        return value;
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-10 w-full">
      {/* --- QUICK ACTIONS HEADER --- */}
      {actions && actions.length > 0 && (
        <div className="flex justify-end items-center gap-3 px-2">
          {actions.map((ActionComponent, index) => (
            <ActionComponent key={index} data={data} onRefresh={onRefresh} />
          ))}
        </div>
      )}

      {/* --- DATA SECTIONS --- */}
      {config.sections.map((section, idx) => {
        // Check if the section has any fields with actual data to display
        const hasVisibleFields = section.fields.some(
          (f) =>
            data[f.path] !== null &&
            data[f.path] !== undefined &&
            data[f.path] !== ""
        );

        if (!hasVisibleFields) return null;

        return (
          <div
            key={idx}
            className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden w-full animate-slide-up"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            {/* Section Header */}
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30">
              <h2 className="text-xs font-black text-main uppercase tracking-[0.15em]">
                {section.group}
              </h2>
            </div>

            {/* Section Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-y-8 gap-x-10">
                {section.fields.map((field, fIdx) => {
                  const rawValue = data[field.path];

                  if (
                    rawValue === null ||
                    rawValue === undefined ||
                    rawValue === ""
                  )
                    return null;

                  return (
                    <div key={fIdx} className="flex flex-col gap-1.5 min-w-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {field.label}
                      </span>
                      <span className="text-slate-700 text-sm font-semibold break-words">
                        {formatValue(rawValue, field.type)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DetailOverview;
