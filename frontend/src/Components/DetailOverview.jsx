import { useOutletContext } from "react-router-dom";

// 1. Receive 'config' as a prop from the Route
const DetailOverview = ({ config }) => {
  // 2. Get 'data' from the Shell via Outlet context
  const { data } = useOutletContext();

  // Safety check: if config isn't passed yet, don't crash
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
      {config.sections.map((section, idx) => {
        // ... rest of your existing mapping logic ...
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
          >
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30">
              <h2 className="text-xs font-black text-main uppercase tracking-[0.15em]">
                {section.group}
              </h2>
            </div>
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
