import { useState } from "react";
import Volunteers from "../Volunteers/Volunteers";
import TeamVolunteerForm from "./TeamVolunteerForm";
// import VolunteerForm from "./VolunteerForm"; // The form component you'll create

const AddTeamVolunteer = ({ teamId, reFetchData, setActiveTab }) => {
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [showTable, setShowTable] = useState(true);

  const handleRowDoubleClick = (volunteerData) => {
    setSelectedVolunteer(volunteerData.row);
    console.log(volunteerData);
    setShowTable(false);
  };

  const handleBackToSelection = () => {
    setSelectedVolunteer(null);
    setShowTable(true);
  };

  return (
    <div>
      {showTable && (
        <>
          <h1 className="text-xl font-semibold text-gray-700 mb-3">
            Choose a Volunteer
            <span className="text-gray-400 text-xs font-normal ml-2">
              (Double click any row)
            </span>
          </h1>
          <Volunteers type="show" onRowDoubleClick={handleRowDoubleClick} />
        </>
      )}

      {selectedVolunteer && (
        <div className="mt-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-blue-900">
                ✓ Volunteer Selected
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
                  {selectedVolunteer.firstName} {selectedVolunteer.lastName}
                </span>
              </div>
              <div>
                <span className="text-sm text-blue-900  font-medium">
                  Email:
                </span>
                <span className="ml-2 text-blue-900">
                  {selectedVolunteer.email}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <TeamVolunteerForm
              teamId={teamId}
              volunteerId={selectedVolunteer.id}
              reFetchData={reFetchData}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTeamVolunteer;
