import { useState } from "react";
import VolunteerInfo from "./VolunteerInfo";
import { Cancel } from "../Global/Icons";
import VolunteerForm from "./VolunteerForm";
import { useVolunteer } from "../../contexts/VolunteerContext";
const VolunteerCard = () => {
  const { volunteerDetails, reFetch } = useVolunteer();
  const [edit, setEdit] = useState(false);
  const handleEditAction = () => {
    setEdit(!edit);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200 relative ">
      {/* Team Header */}
      {!edit && <VolunteerInfo handleEditAction={handleEditAction} />}
      {edit && (
        <>
          <div
            className="absolute top-0 right-0 m-2 p-3 "
            onClick={handleEditAction}
          >
            <Cancel />
          </div>
          <div className="my-4">
            <VolunteerForm
              type="update"
              volunteer={volunteerDetails}
              reFetch={reFetch}
            />
          </div>
        </>
      )}
      {/* Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border-t border-gray-500 pt-4 mt-4">
        {/* Created Information */}
        <div className="space-y-2">
          <div className="text-xs flex items-center text-gray-700">
            <span className="font-medium w-24">Inserted:</span>
            <span>
              {new Date(volunteerDetails.insertionDate).toLocaleDateString()}
            </span>
          </div>
          <div className="text-xs flex items-center text-gray-700">
            <span className="font-medium w-24">By:</span>
            <span className="text-blue-600">
              {volunteerDetails.createdBy.userName || "N/A"}
            </span>
          </div>
        </div>

        {/* Updated Information */}
        <div className="space-y-2">
          <div className="text-xs flex items-center text-gray-700">
            <span className="font-medium w-24">Updated:</span>
            <span>
              {new Date(volunteerDetails.updatedAt).toLocaleDateString()}
            </span>
          </div>
          <div className="text-xs flex items-center text-gray-700">
            <span className="font-medium w-24">By:</span>
            <span className="text-blue-600">
              {volunteerDetails.updatedBy.userName || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Team ID */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <span className="text-xs text-gray-500">
          Volunteer ID: {volunteerDetails.id}
        </span>
      </div>
    </div>
  );
};

export default VolunteerCard;
