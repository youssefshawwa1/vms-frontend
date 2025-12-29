import { useState } from "react";
import useFetching from "../../Hooks/useFetching";
const CompleteTask = ({ data, callBack }) => {
  const { sendData } = useFetching();
  const [completionDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showDate, setShowDate] = useState(false);
  const [error, setError] = useState({ show: false });
  console.log(data);
  const handleAddEndDate = () => {
    setShowDate(true);
  };
  const handleSubmit = async () => {
    if (new Date(completionDate) < new Date(data.startDate)) {
      setError({
        show: true,
        text: "Inserted Date is before the start Date!",
      });
    } else if (new Date(completionDate) > new Date()) {
      setError({
        show: true,
        text: "Completion Date, must be today or earlier!",
      });
    } else {
      const d = {
        action: "completeTask",
        data: {
          userId: 1001,
          taskId: data?.id,
          completionDate: completionDate,
          teamVolunteerId: data?.teamVolunteerId,
        },
      };

      await sendData("teamVolunteers.php", d, callBack);
    }
  };
  return (
    <>
      <div className="p-3 space-y-0">
        <div className="grid grid-cols-2 sm:grid-cols-2 ">
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Task Title
            </label>
            <p className="mt-1 text-gray-900 font-semibold">
              {data?.taskTitle}
            </p>
          </div>

          <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-500">
              Task Description
            </label>
            <p className="mt-1 text-gray-900 whitespace-pre-wrap font-semibold">
              {data?.taskDescription}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">
              Volunteering Hours
            </label>
            <p className="mt-1 text-gray-900 font-semibold">
              {data?.volunteeringHours} Hr
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">
              Start Date
            </label>
            <p className="mt-1 text-gray-900 font-semibold">
              {new Date(data?.startDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">
              End Date
            </label>
            <p className="mt-1 text-gray-900 font-semibold">
              {new Date(data?.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        {/* End Date Section */}
        <div className="pt-4 grid grid-cols-1">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-500">
              Completion Date
            </label>
            {!showDate && (
              <button
                type="button"
                onClick={handleAddEndDate}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                + Custome Date
              </button>
            )}
          </div>

          {showDate ? (
            <div className="space-y-2">
              <input
                type="date"
                value={completionDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setError({
                    show: false,
                  });
                }}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                  ${error.show ? "border-red-500" : "border-gray-300"}`}
              />
              <button
                type="button"
                onClick={() => {
                  setShowDate(false);
                  setEndDate(new Date().toISOString().split("T")[0]);
                }}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Use today's date instead
              </button>
            </div>
          ) : (
            <p className="text-gray-900 mt-1 font-semibold">
              {completionDate} (Today)
            </p>
          )}

          {error.show && (
            <p className="mt-1 text-sm text-red-600">{error.text}</p>
          )}
        </div>
      </div>

      {/* Action Buttons - Only show if there's a submit handler */}

      <div className="flex justify-end space-x-3 p-6 border-t border-gray-300">
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 bg-main text-white rounded-md hover:bg-main-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
        >
          Confirm
        </button>
      </div>
    </>
  );
};
export default CompleteTask;
