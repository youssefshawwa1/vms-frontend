import LinkBtn from "../LinkBtn";
const TeamCard = ({ team }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200 relative">
      {/* Team Header */}
      <div className="absolute top-0 right-0 m-3 p-3 ">
        <LinkBtn to="edit" text="Edit" />
      </div>

      <div className="border-b border-gray-200 pb-4 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{team.teamName}</h2>
        <p className="text-gray-600 mt-2">{team.description}</p>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        {/* Created Information */}
        <div className="space-y-2">
          <div className="flex items-center text-gray-700">
            <span className="font-medium w-24">Created:</span>
            <span>{new Date(team.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <span className="font-medium w-24">By:</span>
            <span className="text-blue-600">
              {team.createdBy.userName || "N/A"}
            </span>
          </div>
        </div>

        {/* Updated Information */}
        <div className="space-y-2">
          <div className="flex items-center text-gray-700">
            <span className="font-medium w-24">Updated:</span>
            <span>{new Date(team.updatedAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <span className="font-medium w-24">By:</span>
            <span className="text-blue-600">
              {team.updatedBy.userName || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Team ID */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <span className="text-xs text-gray-500">Team ID: {team.id}</span>
      </div>
    </div>
  );
};

export default TeamCard;
