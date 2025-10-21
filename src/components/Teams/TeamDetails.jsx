// components/TeamDetails.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import TeamTabs from "./TeamTabs";
import { useTeam } from "../../Contexts/TeamContext";
import useFetching from "../../Hooks/useFetching";
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
    const fetchTeamData = async () => {
      // Determine what needs to be fetched
      const shouldFetchTeam = !(
        teamTasks[tasksFilter] && teamVolunteering[volunteeringFilter]
      );
      const shouldFetchTasks = !(
        teamTasks[tasksFilter] || tasksFilter === "current"
      );
      const shouldFetchVolunteering = !(
        teamVolunteering[volunteeringFilter] || volunteeringFilter === "current"
      );

      // If nothing needs to be fetched, exit early
      if (!shouldFetchTeam && !shouldFetchTasks && !shouldFetchVolunteering) {
        return;
      }

      try {
        let teamData, tasksData, volunteeringData;

        // Fetch combined team data if needed
        if (shouldFetchTeam) {
          teamData = await fetchData(
            `teams.php?id=${id}&tasks=${tasksFilter}&volunteering=${volunteeringFilter}&team`
          );
        }
        // Fetch tasks only if needed and not part of the combined fetch
        if (shouldFetchTasks && !shouldFetchTeam) {
          tasksData = await fetchData(
            `teams.php?id=${id}&tasks=${tasksFilter}`
          );
        }
        // Fetch volunteering only if needed and not part of the combined fetch
        if (shouldFetchVolunteering && !shouldFetchTeam) {
          volunteeringData = await fetchData(
            `teams.php?id=${id}&volunteering=${volunteeringFilter}`
          );
        }

        // Use the data from the combined fetch if it happened, otherwise use individual fetches
        const finalTeamData = teamData || tasksData || volunteeringData;
        if (!finalTeamData) {
          console.log("Error: No data received");
          return;
        }

        // Update state for team details and card data only if combined data was fetched
        if (teamData) {
          setTeamDetails(teamData.details);
          setCardData({
            label: teamData.details.teamName,
            description: teamData.details.description,
            lastItem: {
              label: "Team ID:",
              text: teamData.details.id,
            },
            sections: [
              {
                type: "last",
                items: [
                  {
                    type: "last",
                    label: "Inserted:",
                    text: teamData.details.createdAt,
                  },
                  {
                    type: "last",
                    label: "By:",
                    text: teamData.details.createdBy.userName,
                  },
                  {
                    type: "last",
                    label: "Updated:",
                    text: teamData.details.updatedAt,
                  },
                  {
                    type: "last",
                    label: "By:",
                    text: teamData.details.updatedBy.userName,
                  },
                ],
              },
            ],
          });
        }

        // Update teamVolunteering state
        if (teamData) {
          setTeamVolunteering((prev) => ({
            ...prev,
            [volunteeringFilter]: teamData.teamVolunteering,
          }));
        } else if (volunteeringData) {
          setTeamVolunteering((prev) => ({
            ...prev,
            [volunteeringFilter]: volunteeringData.teamVolunteering,
          }));
        }

        // Update teamTasks state
        if (teamData) {
          setTeamTasks((prev) => ({
            ...prev,
            [tasksFilter]: teamData.teamTasks,
          }));
        } else if (tasksData) {
          setTeamTasks((prev) => ({
            ...prev,
            [tasksFilter]: tasksData.teamTasks,
          }));
        }
      } catch (error) {
        console.log("Fetch error:", error);
      }
    };

    fetchTeamData();
  }, [reFetchData, tasksFilter, volunteeringFilter]);
  const [cardData, setCardData] = useState({});
  const [edit, setEdit] = useState(false);
  const handleRefetch = () => {
    reFetch();
    setEdit(!edit);
  };
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
                    reFetch={handleRefetch}
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
