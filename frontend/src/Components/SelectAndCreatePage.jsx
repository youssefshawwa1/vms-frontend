import React, { useState } from "react";
import GenericTable from "../Components/Global/GenericTable";
import GenericCreatePage from "./GenericCreatePage";
import { Person, Close, PersonAddAlt1 } from "@mui/icons-material";

const SelectAndCreatePage = ({
  tableEndpoint,
  tableColumns,
  tableTitle,
  rowIdKey = "volunteerId",
  createConfig,
  createApiEndpoint,
  createTitle,
  paramMapping = {},
  selectMappingKey,
  clearOnSuccess = true,
  redirectPath, // 👈 1. Added this to receive the prop from your config
}) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSelect = (row) => setSelectedItem(row);
  const handleCancel = () => setSelectedItem(null);

  if (selectedItem) {
    return (
      <div className="animate-slide-up">
        {/* Selection Indicator Banner */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between p-6 bg-main/5 border border-main/10 rounded-[24px] gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-main flex items-center justify-center text-white shadow-lg shadow-main/20">
              <Person fontSize="large" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-main/60">
                Active Selection
              </p>
              <h3 className="text-xl font-black text-gray-900">
                {selectedItem.firstName} {selectedItem.lastName}
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                ID: {selectedItem[rowIdKey]}
              </p>
            </div>
          </div>

          <button
            onClick={handleCancel}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-red-500 border border-red-100 rounded-2xl font-bold text-sm hover:bg-red-50 hover:border-red-200 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Close sx={{ fontSize: 18 }} />
            Cancel & Change Volunteer
          </button>
        </div>

        <GenericCreatePage
          title={createTitle}
          config={createConfig}
          apiEndpoint={createApiEndpoint}
          clearOnSuccess={clearOnSuccess}
          paramMapping={paramMapping}
          redirectPath={redirectPath} // 👈 2. Passing it down here
          extraPayload={{ [selectMappingKey]: selectedItem[rowIdKey] }}
          description={`Assigning ${selectedItem.firstName} to this team.`}
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6 p-4 bg-main/5 rounded-2xl border border-main/10 flex items-center gap-3">
        <PersonAddAlt1 className="text-main" />
        <p className="text-sm text-gray-700 font-medium">
          <strong className="text-main">Step 1:</strong> Search and{" "}
          <strong>double-click</strong> a volunteer from the list below to
          proceed.
        </p>
      </div>

      <GenericTable
        columns={tableColumns}
        apiEndpoint={tableEndpoint}
        title={tableTitle}
        searchPlaceholder="Search Volunteers..."
        description="Explore volunteers data, click on a row to show more details"
        onRowDoubleClick={handleSelect}
        rowId={rowIdKey}
        pageSizeOptions={[7, 10, 25]}
      />
    </div>
  );
};

export default SelectAndCreatePage;
