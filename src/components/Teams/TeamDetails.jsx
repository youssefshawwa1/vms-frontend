// components/TeamDetails.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import TeamTabs from "./TeamTabs"; // Import the tabs component
import { useTeam } from "../../contexts/TeamContext";
import useFetching from "../Global/Helpers/useFetching";
import TeamForm from "./TeamForm";
import { Edit, Cancel } from "../Global/Icons";
import Card from "../Global/Card";
const TeamDetails = () => {
  const { fetchData } = useFetching();
  const {
    teamDetails,
    teamVolunteering,
    teamTasks,
    volunteeringFilter,
    tasksFilter,
    reFetch,
    reFetchData,
    setTeamDetails,
    setTeamVolunteering,
    setTeamTasks,
  } = useTeam();
  const { id } = useParams();

  useEffect(() => {
    const fetchTeam = async () => {
      if (teamTasks[tasksFilter] && teamVolunteering[volunteeringFilter]) {
        return;
      }
      const data = await fetchData(
        `teams.php?id=${id}&tasks=${tasksFilter}&volunteering=${volunteeringFilter}&team`
      );

      if (data) {
        setTeamDetails(data.details);
        setCardData({
          label: data.details.teamName,
          description: data.details.description,
          lastItem: {
            label: "Team ID:",
            text: data.details.id,
          },
          sections: [
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
        setTeamVolunteering({
          ...teamVolunteering,
          [volunteeringFilter]: data.teamVolunteering,
        });
        setTeamTasks({
          ...teamTasks,
          [tasksFilter]: data.teamTasks,
        });
      } else {
        console.log("error");
      }
    };

    fetchTeam();
  }, [reFetchData]);
  useEffect(() => {
    const fetchTeam = async () => {
      if (teamTasks[tasksFilter] || tasksFilter == "current") {
        return;
      }

      const data = await fetchData(`teams.php?id=${id}&tasks=${tasksFilter}`);
      console.log(data);
      if (data) {
        setTeamTasks({
          ...teamTasks,
          [tasksFilter]: data.teamTasks,
        });
      } else {
        console.log("error");
      }
    };

    fetchTeam();
  }, [tasksFilter]);

  useEffect(() => {
    const fetchTeam = async () => {
      if (
        teamVolunteering[volunteeringFilter] ||
        volunteeringFilter == "current"
      ) {
        return;
      }
      const data = await fetchData(
        `teams.php?id=${id}&volunteering=${volunteeringFilter}`
      );

      if (data) {
        setTeamVolunteering({
          ...teamVolunteering,
          [volunteeringFilter]: data.teamVolunteering,
        });
      } else {
        console.log("error");
      }
    };

    fetchTeam();
  }, [volunteeringFilter]);
  const [cardData, setCardData] = useState({});
  const [edit, setEdit] = useState(false);
  return (
    // <div className="teams-detail px-4 w-full max-w-6xl mx-auto mb-10">
    //   <Link
    //     to="/teams"
    //     className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
    //   >
    //     ← Back to Teams
    //   </Link>

    //   {teamDetails.id && (
    //     <>
    //       <TeamCard />
    //       <div className="mt-8">
    //         <TeamTabs />
    //       </div>
    //     </>
    //   )}
    // </div>

    <div className="teams-detail px-4 w-full mx-auto mx-auto mb-10 fadeIn">
      <Link
        to="/teams"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        ← Back to Teams
      </Link>

      {cardData.lastItem && (
        <>
          {/* <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200 relative fadeIn">
          <Card data={}/>
          </div> */}
          <div className="bg-white rounded-lg shadow-md  mb-6 border border-gray-200">
            <div className="fadeIn relative ">
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
                  <div
                    className="absolute top-0 right-0 m-2 p-1  z-55"
                    onClick={() => setEdit(!edit)}
                  >
                    <Cancel />
                  </div>
                  <TeamForm
                    type="update"
                    team={teamDetails}
                    reFetch={reFetch}
                  />
                </div>
              )}
            </div>
          </div>
          {/* <VolunteerCard /> */}
          <div className="mt-8 fadeIn">
            <TeamTabs />
          </div>
        </>
      )}
    </div>
  );
};

export default TeamDetails;
