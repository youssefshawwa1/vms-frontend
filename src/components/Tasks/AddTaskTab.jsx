import TaskForm from "./TaskForm";
// import VolunteerForm from "./VolunteerForm"; // The form component you'll create
const AddTaskTab = ({ selectedVolunteering, callBack, cancel, hide }) => {
  // const [showTable, setShowTable] = useState(true);

  // const handleRowDoubleClick = (volunteerData) => {
  //   setSelectedVolunteer(volunteerData.row);
  //   console.log(volunteerData);
  //   setShowTable(false);
  // };

  // const handleBackToSelection = () => {
  //   setSelectedVolunteer(null);
  //   setShowTable(true);
  // };
  // console.log(selectedVolunteering);
  return (
    selectedVolunteering && (
      <div className="fadeIn">
        <div className="mt-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3 border-b border-blue-900 pb-4">
              <h3 className="text-lg font-medium text-blue-900">
                Selected Volunteering
              </h3>
              <button
                onClick={cancel}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
              >
                Change selection
              </button>
            </div>

            <div className={"grid grid-cols-1" + !hide && "md:grid-cols-2"}>
              {!hide && (
                <div className="mb-4">
                  <h3 className="text-md font-medium text-blue-900 mb-2 ">
                    Volunteer Info:
                  </h3>

                  <div className="grid grid-cols-1 gap-1">
                    <div>
                      <div>
                        <span className="text-sm text-blue-900 font-medium">
                          Name:
                        </span>
                        <span className="ml-2 text-blue-900">
                          {`${selectedVolunteering.firstName || "N/A"} ${
                            selectedVolunteering.lastName || "N/A"
                          }`}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-blue-900  font-medium">
                        Email:
                      </span>
                      <span className="ml-2 text-blue-900">
                        {selectedVolunteering.email || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-blue-900  font-medium">
                        Phone:
                      </span>
                      <span className="ml-2 text-blue-900">
                        {selectedVolunteering.phone || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-md font-medium text-blue-900 mb-2 ">
                  Volunteering Info:
                </h3>
                <div className="grid grid-cols-1 gap-1">
                  <div>
                    <div className="">
                      <span className="text-sm text-blue-900 font-medium">
                        Title:
                      </span>
                      <span className="ml-2 text-blue-900">
                        {selectedVolunteering.volunteerTitle || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-blue-900  font-medium">
                      Type:
                    </span>
                    <span className="ml-2 text-blue-900">
                      {selectedVolunteering.roleTitle || "N/A"}
                      someData
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-blue-900  font-medium">
                      Start Date:
                    </span>
                    <span className="ml-2 text-blue-900">
                      {new Date(
                        selectedVolunteering.startDate
                      ).toLocaleDateString() || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-md font-medium text-blue-900 mb-2 w-full">
                Description:
              </h3>
              <div className="grid grid-cols-1 gap-1">
                <div>
                  <div className="">
                    <span className="ml-2 text-blue-900">
                      {selectedVolunteering.description || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5">
            {/* <TeamVolunteerForm
              volunteerId={selectedVolunteer.id}
              teamId={teamDetails.id}
              callBack={reFetch}
            /> */}
            <TaskForm
              teamVolunteerId={selectedVolunteering.id}
              callBack={callBack}
            />
          </div>
        </div>
      </div>
    )
  );
};

export default AddTaskTab;
