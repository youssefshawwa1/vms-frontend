import { useState } from "react";
import Teams from "./Teams";
import VolunteeringForm from "../Volunteering/VolunteeringForm";
import Volunteers from "../Volunteers/Volunteers";
import SelectionCard from "../Global/SelectionCard";
const AddVolunteering = ({ type, details, reFetch, whenVisible }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showTable, setShowTable] = useState(true);
  const handleBackToSelection = () => {
    setSelectedItem(null);
    setShowTable(true);
  };
  const handleRowDoubleClick = (params) => {
    setSelectedItem({
      id: params.row.id,
      title: `✓ ${type == "forTeam" ? "Volunteer" : "Team"} Selected`,
      cancel: {
        title: "Change Selection",
        onClick: handleBackToSelection,
      },
      items: [
        ...(type === "forTeam"
          ? [
              {
                label: "Name",
                text: `${params.row.firstName} ${params.row.lastName}`,
              },
              {
                label: "Email",
                text: params.row.email,
              },
              {
                label: "Major",
                text: params.row.major,
              },
              {
                label: "Gender",
                text: params.row.gender,
              },
              {
                label: "Email",
                text: params.row.email,
              },
            ]
          : []),
        ...(type === "forVolunteer"
          ? [
              {
                label: "Name",
                text: params.row.teamName,
              },

              {
                label: "Description",
                text: params.row.description,
              },
            ]
          : []),
      ],
    });
    setShowTable(false);
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
          {whenVisible ? whenVisible() : ""}
        </>
      )}

      {selectedItem && (
        <div className="mt-4 fadeIn">
          <SelectionCard data={selectedItem} />
          <div className="mt-5">
            <VolunteeringForm
              volunteeringDetails={{
                volunteer: {
                  volunteerId: details?.volunteerId || selectedItem.id,
                },
                team: {
                  teamId: details?.teamId || selectedItem.id,
                },
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
