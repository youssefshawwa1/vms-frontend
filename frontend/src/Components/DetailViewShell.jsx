import { useParams, useNavigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import {
  HiArrowLeft,
  HiOutlineMail,
  HiOutlineIdentification,
} from "react-icons/hi";

const DetailViewShell = ({ config, fetchFn, idName }) => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Helper to sanitize data.
   */
  const sanitizeData = (obj) => {
    if (!obj || typeof obj !== "object") return obj;
    const sanitized = Array.isArray(obj) ? [] : {};

    for (const key in obj) {
      const value = obj[key];
      if (
        value &&
        typeof value === "object" &&
        value.type === "Buffer" &&
        Array.isArray(value.data)
      ) {
        const isTrue = value.data[0] === 1;
        sanitized[key] = isTrue ? "YES" : "NO";
      } else if (typeof value === "object" && value !== null) {
        sanitized[key] = sanitizeData(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  };

  useEffect(() => {
    const getData = async () => {
      const hasRefreshSignal = location.state?.refresh;

      if (
        data &&
        (data.id === params.id || data.volunteerId === params.id) &&
        !hasRefreshSignal
      ) {
        return;
      }

      try {
        setLoading(true);
        const response = await fetchFn(params);
        const rawResult = response.data?.data || response.data || response;
        const cleanResult = sanitizeData(rawResult);

        setData(cleanResult);
        setError(null);

        if (hasRefreshSignal) {
          navigate(location.pathname, { replace: true, state: {} });
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load details. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [params.id, fetchFn, location.state, navigate, location.pathname]);

  /**
   * FIXED: Smart Tab Highlighting
   * Sorts tabs by path length to ensure "volunteering/add" matches
   * before "volunteering".
   */
  const activeTabPath = useMemo(() => {
    const pathSegments = location.pathname.split(params.id);
    const rawRelative = pathSegments[1] || "";
    // Normalize path: Remove leading/trailing slashes
    const relativePath = rawRelative.replace(/^\//, "").replace(/\/$/, "");

    // Sort tabs by length (descending) to match the most specific path first
    const sortedTabs = [...config.tabs].sort(
      (a, b) => b.path.length - a.path.length
    );

    const match = sortedTabs.find((tab) => {
      const tabPath = tab.path.replace(/^\//, "").replace(/\/$/, "");

      if (tabPath === "") {
        return relativePath === "";
      }

      // Exact match OR starts with path + folder separator
      // (prevents "volunteering" from matching "volunteering-list")
      return relativePath === tabPath || relativePath.startsWith(tabPath + "/");
    });

    return match ? match.path : "";
  }, [location.pathname, config.tabs, params.id]);

  if (loading && !data)
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] w-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-main"></div>
        <p className="mt-4 text-slate-400 text-sm font-medium italic">
          Preparing data...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="m-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg w-full">
        {error}
      </div>
    );

  if (!data)
    return <div className="p-6 text-slate-500 w-full">Record not found.</div>;

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col animate-in fade-in duration-500">
      <div className="px-4 py-6 md:px-8 w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-main transition-colors mb-6 group"
        >
          <HiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium uppercase tracking-tight">
            Back to List
          </span>
        </button>

        {/* Header Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-sm w-full">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-3">
                {data[config.titleField]} {data.lastName || ""}
              </h1>

              <div className="flex flex-wrap gap-x-8 gap-y-3 items-center text-slate-500">
                {data[config.subTitleField] && (
                  <div className="flex items-center gap-2">
                    <HiOutlineMail className="text-lg text-main" />
                    <span className="text-sm font-medium">
                      {data[config.subTitleField]}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <HiOutlineIdentification className="text-lg text-main" />
                  <span className="text-sm font-medium">
                    ID: {data[idName] || data.id}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          {config.tabs.length > 0 && (
            <div className="flex flex-col md:flex-row md:gap-8 mt-8 border-l-2 md:border-l-0 md:border-b border-slate-100">
              {config.tabs.map((tab) => {
                const isActive = activeTabPath === tab.path;
                return (
                  <button
                    key={tab.label}
                    onClick={() => navigate(tab.path === "" ? "." : tab.path)}
                    className={`
                      py-3 md:pb-3 md:pt-0 px-4 md:px-0
                      text-sm font-bold transition-all relative whitespace-nowrap text-left
                      ${
                        isActive
                          ? "text-main bg-main/5 md:bg-transparent"
                          : "text-slate-400 hover:text-slate-600 hover:bg-slate-50 md:hover:bg-transparent"
                      }
                    `}
                  >
                    {tab.label}
                    {isActive && (
                      <>
                        <div className="absolute left-[-2px] top-0 h-full w-[3px] bg-main rounded-full md:hidden" />
                        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-main rounded-full hidden md:block" />
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Child Content Area */}
        <div className="w-full">
          <Outlet key={location.pathname} context={{ data, config }} />
        </div>
      </div>
    </div>
  );
};

export default DetailViewShell;
