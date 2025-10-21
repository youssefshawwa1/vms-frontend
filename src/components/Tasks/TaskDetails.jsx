import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetching from "../../Hooks/useFetching";
import Card from "../Global/Card";
import { useOverLay } from "../../Contexts/OverLayContext";
import { Edit, Cancel, CompleteDocument } from "../Global/Icons";
import TaskForm from "./TaskForm";
import CompleteTask from "./CompleteTask";
const TaskDetails = () => {
  const { showPopUp, hidePopUp } = useOverLay();
  const [taskDetails, setTaskDetails] = useState(null);
  const { fetchData } = useFetching();
  const { id } = useParams();
  const [cardData, setCardData] = useState(null);
  const [edit, setEdit] = useState(false);
  const [refetch, setReFetch] = useState(false);
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchVolunteeringData = async () => {
      const shouldFetch = !taskDetails;
      if (!shouldFetch) {
        return;
      }
      try {
        let taskData;

        if (shouldFetch) {
          taskData = await fetchData(`tasks.php?id=${id}`);
          console.log(taskData);
        }

        if (taskData) {
          setEdit(false);
          setTaskDetails(taskData);
          setData(taskData);
          setCardData({
            label: `${taskData.taskTitle} (${
              taskData.completed ? "Completed" : "In Progress"
            })`,
            description: taskData.taskDescription,
            lastItem: {
              label: "Task ID:",
              text: taskData.id,
            },
            sections: [
              {
                label: "Task Info",
                items: [
                  {
                    label: "Task Title:",
                    text: taskData.taskTitle,
                  },
                  {
                    label: "Volunteering Hours:",
                    text: taskData.volunteeringHours,
                  },
                  {
                    label: "Status: ",
                    text: taskData.completed ? "Completed" : "In Progress",
                  },
                  {
                    label: "Start Date:",
                    text: taskData.startDate,
                  },
                  {
                    label: "End Date:",
                    text: taskData.taskTitle,
                  },
                  {
                    label: "Completion Date:",
                    text: taskData.completionDate,
                  },
                ],
              },
              {
                label: "Volunteering Info",
                items: [
                  {
                    label: "Role Type:",
                    text: taskData.fullDetails.volunteering.role.roleTitle,
                  },
                  {
                    label: "Team:",
                    text: taskData.fullDetails.volunteering.team.teamName,
                  },
                  {
                    label: "Start Date:",
                    text: taskData.startDate,
                  },
                  {
                    label: "End Date:",
                    text: taskData.endDate,
                  },
                ],
              },
              {
                label: "Volunteer Info",
                items: [
                  {
                    label: "Full Name:",
                    text: taskData.fullDetails.volunteering.volunteer
                      .volunteerName,
                  },
                  {
                    label: "Email:",
                    text: taskData.fullDetails.volunteering.volunteer.email,
                  },
                  {
                    label: "Phone:",
                    text: taskData.fullDetails.volunteering.volunteer.phone,
                  },
                ],
              },
              {
                type: "last",
                items: [
                  {
                    type: "last",
                    label: "Inserted:",
                    text: taskData.createdAt,
                  },
                  {
                    type: "last",
                    label: "By:",
                    text: taskData.fullDetails.createdBy?.userName,
                  },
                  {
                    type: "last",
                    label: "Updated:",
                    text: taskData.fullDetails.updatedAt,
                  },
                  {
                    type: "last",
                    label: "By:",
                    text: taskData.fullDetails.updatedBy?.userName,
                  },
                ],
              },
            ],
          });
        }
      } catch (error) {
        console.log("Fetch error:", error);
      }
    };

    fetchVolunteeringData();
  }, [refetch]);

  const handleRefetch = () => {
    setEdit(!edit);
  };
  const handleComplete = () => {
    console.log(taskDetails);
    showPopUp(
      "Complete a Task",
      <CompleteTask
        data={{
          // fullName: taskDetails.taskTitle,
          taskTitle: taskDetails.taskTitle,

          taskDescription: taskDetails.taskDescription,
          volunteeringHours: taskDetails.volunteeringHours,
          startDate: taskDetails.startDate,
          endDate: taskDetails.endDate,
          taskId: taskDetails.id,
        }}
        callBack={() => {
          hidePopUp();
          setReFetch((prev) => !prev);
          setTaskDetails(null);
        }}
        onCancel={hidePopUp}
      />
    );
  };

  return (
    <div className="px-4 w-full mx-auto mb-10 fadeIn">
      <Link
        to="/volunteers"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        ← Back to Volunteers
      </Link>
      {/* {cardData && <Card data={cardData} />} */}
      {cardData?.lastItem && (
        <div className="bg-white rounded-lg shadow-md mb-6 border border-gray-200">
          <div className="fadeIn relative">
            {!edit && (
              <div className="fadeIn p-6">
                <div
                  className="absolute top-0 right-0 m-2 p-1 z-55 cursor-pointer"
                  onClick={() => setEdit(!edit)}
                >
                  <Edit />
                </div>
                {!data.completed && (
                  <div
                    className="absolute top-0 right-15 m-2 p-1 z-55 cursor-pointer"
                    onClick={() => handleComplete()}
                  >
                    <CompleteDocument />
                  </div>
                )}
                <Card data={cardData} />
              </div>
            )}
            {edit && (
              <div className="fadeIn p-6">
                <p className="text-red-400 text-xs pr-6 mb-4">
                  <span className="font-bold">Note:</span> if you need to change
                  the volunteering, you will have to end this task, or try to
                  delete it! It can't be deleted if there are tasks related to
                  it.
                </p>
                <div
                  className="absolute top-0 right-0 m-2 p-1 z-55 cursor-pointer"
                  onClick={() => setEdit(!edit)}
                >
                  <Cancel />
                </div>
                <TaskForm
                  type="update"
                  callBack={handleRefetch}
                  task={taskDetails}
                  teamVolunteerId={
                    taskDetails.fullDetails.volunteering.teamVolunteerId
                  }
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;
