import { useVolunteer } from "../../contexts/VolunteerContext";
import { Edit } from "../Global/Icons";
const VolunteerInfo = ({ handleEditAction }) => {
  const { volunteerDetails } = useVolunteer();
  return (
    <>
      <div
        className="absolute top-0 right-0 m-3 p-3 "
        onClick={handleEditAction}
      >
        {/* <LinkBtn text="Edit" /> */}
        <Edit />
      </div>

      <div className="border-b border-gray-500 pb-4 mb-4">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          {volunteerDetails.firstName} {volunteerDetails.lastName}
        </h2>
        {/* <p className="text-gray-600 mt-2">{volunteer.lastName}</p> */}
      </div>
      <div className="">
        <div className="mb-8">
          <div className="border-b border-gray-200 pb-2 mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Personal Information
            </h2>
            {/* <p className="text-gray-600 mt-2">{volunteer.lastName}</p> */}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2 ">
              <div className="flex items-center text-gray-900">
                <span className="font-medium w-24">First Name:</span>
                <span>{volunteerDetails.firstName}</span>
              </div>
              <div className="flex items-center text-gray-900">
                <span className="font-medium w-24">Last Name:</span>
                <span>{volunteerDetails.lastName}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-gray-900">
                <span className="font-medium w-24">Birth Date:</span>
                <span>
                  {new Date(volunteerDetails.birthDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center text-gray-900">
                <span className="font-medium w-24">By:</span>
                <span>{volunteerDetails.gender}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <div className="border-b border-gray-200 pb-2 mb-4">
            <h2 className="text-xl font-bold text-gray-800">Contact Info</h2>
            {/* <p className="text-gray-600 mt-2">{volunteer.lastName}</p> */}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2 ">
              <div className="flex items-center text-gray-900">
                <span className="font-medium w-24">Emaile:</span>
                <span>{volunteerDetails.email || "N/A"}</span>
              </div>
            </div>
            <div className="space-y-2 ">
              <div className="flex items-center text-gray-900">
                <span className="font-medium w-24">Phone:</span>
                <span>{volunteerDetails.phone || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <div className="border-b border-gray-200 pb-2 mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Education Information
            </h2>
            {/* <p className="text-gray-600 mt-2">{volunteer.lastName}</p> */}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2 ">
              <div className="flex items-center text-gray-900">
                <span className="font-medium w-24">University / School:</span>
                <span>{volunteerDetails.university || "N/A"}</span>
              </div>
            </div>
            <div className="space-y-2 ">
              <div className="flex items-center text-gray-900">
                <span className="font-medium w-24">Major:</span>
                <span>{volunteerDetails.major || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <div className="border-b border-gray-200 pb-2 mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Location Information
            </h2>
            {/* <p className="text-gray-600 mt-2">{volunteer.lastName}</p> */}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2 ">
              <div className="flex items-center text-gray-900">
                <span className="font-medium w-24">Nationality:</span>
                <span>{volunteerDetails.nationality || "N/A"}</span>
              </div>
            </div>
            <div className="space-y-2 ">
              <div className="flex items-center text-gray-900">
                <span className="font-medium w-24">Resident Country:</span>
                <span>{volunteerDetails.residentCountry || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VolunteerInfo;
