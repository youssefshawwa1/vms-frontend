import { useState } from "react";
import Teams from "../Teams/Teams";
import TeamVolunteerForm from "../Teams/TeamVolunteer/TeamVolunteerForm";
import { useVolunteer } from "../../contexts/VolunteerContext";
// import VolunteerForm from "./VolunteerForm"; // The form component you'll create
const AddToTeam = () => {
  const { volunteerDetails, reFetch } = useVolunteer();
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showTable, setShowTable] = useState(true);

  const handleRowDoubleClick = (teamData) => {
    setSelectedTeam(teamData.row);
    console.log(teamData);
    setShowTable(false);
  };

  const handleBackToSelection = () => {
    setSelectedTeam(null);
    setShowTable(true);
  };

  return (
    <div>
      {showTable && (
        <>
          <h1 className="text-xl font-semibold text-gray-700 mb-3">
            Choose a Team
            <span className="text-gray-400 text-xs font-normal ml-2">
              (Double click any row)
            </span>
          </h1>
          <Teams type="show" onRowDoubleClick={handleRowDoubleClick} />
        </>
      )}

      {selectedTeam && (
        <div className="mt-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-blue-900">
                ✓ Team Selected
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
                  {selectedTeam.teamName}
                </span>
              </div>
              <div>
                <span className="text-sm text-blue-900  font-medium">
                  Description:
                </span>
                <span className="ml-2 text-blue-900">
                  {selectedTeam.description}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <TeamVolunteerForm
              teamId={selectedTeam.id}
              volunteerId={volunteerDetails.id}
              callBack={reFetch}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddToTeam;
