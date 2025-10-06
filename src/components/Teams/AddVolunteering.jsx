import { useState } from "react";
import Teams from "./Teams";
import TeamVolunteerForm from "./TeamVolunteer/TeamVolunteerForm";
import Volunteers from "../Volunteers/Volunteers";

const AddVolunteering = ({ type, details, reFetch }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showTable, setShowTable] = useState(true);

  const handleRowDoubleClick = (params) => {
    setSelectedItem(params.row);
    setShowTable(false);
  };
  const handleBackToSelection = () => {
    setSelectedItem(null);
    setShowTable(true);
  };
  return (
    <div>
      {showTable && (
        <>
          <h1 className="text-xl font-semibold text-gray-700 mb-3 fadeIn">
            Choose a {type == "forTeam" ? "Volunteer" : "Team"}
            <span className="text-gray-400 text-xs font-normal ml-2">
              (Double click any row)
            </span>
          </h1>
          {type == "forTeam" ? (
            <Volunteers type="show" onRowDoubleClick={handleRowDoubleClick} />
          ) : (
            <Teams type="show" onRowDoubleClick={handleRowDoubleClick} />
          )}
        </>
      )}

      {selectedItem && (
        <div className="mt-4 fadeIn">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-blue-900">
                ✓ {type == "forTeam" ? "Volunteer" : "Team"} Selected
              </h3>
              <button
                onClick={handleBackToSelection}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
              >
                Change selection
              </button>
            </div>

            <div className="flex flex-wrap gap-4">
              <div>
                <span className="text-sm text-blue-900 font-medium">Name:</span>
                <span className="ml-2 text-blue-900">
                  {type == "forTeam"
                    ? `${selectedItem.firstName} ${selectedItem.lastName}`
                    : selectedItem.teamName}
                </span>
              </div>
              {type == "forTeam" && (
                <>
                  <div>
                    <span className="text-sm text-blue-900  font-medium">
                      Email:
                    </span>
                    <span className="ml-2 text-blue-900">
                      {selectedItem.email || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-blue-900  font-medium">
                      Major:
                    </span>
                    <span className="ml-2 text-blue-900">
                      {selectedItem.major || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-blue-900  font-medium">
                      Gender:
                    </span>
                    <span className="ml-2 text-blue-900">
                      {selectedItem.gender || "N/A"}
                    </span>
                  </div>
                </>
              )}
              {type != "forTeam" && (
                <div>
                  <span className="text-sm text-blue-900  font-medium">
                    Description:
                  </span>
                  <span className="ml-2 text-blue-900">
                    {selectedItem.description}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="mt-5">
            <TeamVolunteerForm
              volunteeringDetails={{
                volunteerId: details.volunteerId
                  ? details.volunteerId
                  : selectedItem.id,
                teamId: details.teamId ? details.teamId : selectedItem.id,
              }}
              callBack={reFetch}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default AddVolunteering;
