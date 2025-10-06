import { useParams } from "react-router-dom";
import { useOverLay } from "../../../contexts/OverLayContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useVolunteering } from "../../../contexts/VolunteeringContext";
import useFetching from "../../Global/Helpers/useFetching";
import Card from "../../Global/Card";
import { Edit, Cancel } from "../../Global/Icons";
import TeamVolunteerForm from "./TeamVolunteerForm";
const TeamVolunteer = () => {
  const {
    volunteeringDetails,
    volunteeringTasks,
    tasksFilter,
    reFetch,
    reFetchData,
    setTasksFilter,
    setVolunteeringTasks,
    setVolunteeringDetails,
  } = useVolunteering();
  const { fetchData } = useFetching();
  const { tvId } = useParams();
  const [cardData, setCardData] = useState([]);
  console.log("Team Volunteer ID:", tvId);
  useEffect(() => {
    const fetchVolunteering = async () => {
      if (volunteeringTasks[tasksFilter]) {
        return;
      }
      const data = await fetchData(
        `teamVolunteers.php?id=${tvId}&tasks=${tasksFilter}&volunteering`
      );
      if (data) {
        console.log(data);
        setVolunteeringDetails(data.details);
        setVolunteeringTasks({
          ...volunteeringTasks,
          [tasksFilter]: data.volunteeringTasks,
        });
        setCardData({
          label: data.details.volunteerTitle,
          description: data.details.description,
          lastItem: {
            label: "Volunteering ID:",
            text: data.details.id,
          },
          sections: [
            {
              label: "Volunteering Info",
              items: [
                {
                  label: "Role Type:",
                  text: data.details.role.roleTitle,
                },
                {
                  label: "Role Des:",
                  text: data.details.role.roleDescription,
                },
                {
                  label: "Team:",
                  text: data.details.team.teamName,
                },
                {
                  label: "Start Date:",
                  text: data.details.startDate,
                },
                {
                  label: "End Date:",
                  text: data.details.endDate,
                  // type: "date",
                },
              ],
            },
            {
              label: "Volunteer Information",
              items: [
                {
                  label: "Name:",
                  text: data.details.volunteer.volunteerName,
                },
                {
                  label: "Email:",
                  text: data.details.volunteer.volunteerEmail,
                },
                {
                  label: "Phone:",
                  text: data.details.volunteer.volunteerPhone,
                },
              ],
            },
            {
              type: "last",
              items: [
                {
                  type: "last",
                  label: "Inserted:",
                  text: data.details.createdAt,
                },
                {
                  type: "last",
                  label: "By:",
                  text: data.details.createdBy.userName,
                },
                {
                  type: "last",
                  label: "Updated:",
                  text: data.details.updatedAt,
                },
                {
                  type: "last",
                  label: "By:",
                  text: data.details.updatedBy.userName,
                },
              ],
            },
          ],
        });
      } else {
        console.log("error");
      }
    };
    fetchVolunteering();
  }, []);
  const [edit, setEdit] = useState(false);
  return (
    <div className="teams-detail px-4 w-full mx-auto mx-auto mb-10 fadeIn">
      <Link
        to="/volunteers"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        ← Back to Volunteers
      </Link>

      {cardData.lastItem && (
        <div className="bg-white rounded-lg shadow-md  mb-6 border border-gray-200">
          <div className="fadein relative">
            {!edit && (
              <div className="fadeIn p-6">
                <div
                  className="absolute top-0 right-0 m-2 p-1 z-55"
                  onClick={() => setEdit(!edit)}
                >
                  <Edit />
                </div>
                <Card data={cardData} />
              </div>
            )}

            {edit && (
              <div className="fadeIn p-6">
                <p className="text-red-400 text-xs pr-6">
                  <span className="font-bold">Note:</span> if you need to change
                  the team or the volunteer, you will have to end this
                  volunteering. Or try to delete it!
                </p>
                <div
                  className="absolute top-0 right-0 m-2 p-1  z-55"
                  onClick={() => setEdit(!edit)}
                >
                  <Cancel />
                </div>
                <TeamVolunteerForm
                  type="update"
                  volunteeringDetails={volunteeringDetails}
                  reFetch={reFetch}
                />
              </div>
            )}
          </div>
          <div className="mt-8 fadeIn">{/* <VolunteerTabs /> */}</div>
        </div>
      )}
    </div>
  );
};

export default TeamVolunteer;
