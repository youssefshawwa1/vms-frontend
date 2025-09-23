// components/TeamDetails.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLoading } from "../../contexts/LoadingContext";
import TeamCard from "./TeamCard";
import TeamTabs from "./TeamTabs"; // Import the tabs component

const TeamDetails = () => {
  const { id } = useParams();
  const [team, setTeam] = useState({});
  const { hideLoading, isLoading } = useLoading();
  const [teamVolunteers, setTeamVolunteers] = useState({
    all: null,
    current: null,
    old: null,
  });
  const [teamTasks, setTeamTasks] = useState({
    all: null,
    current: null,
    old: null,
  });
  const [volunteerFilter, setVolunteerFilter] = useState("current");
  const [taskFilter, setTaskFilter] = useState("current");
  const [refetch, setRefetch] = useState(false);
  useEffect(() => {
    const fetchTeam = async () => {
      if (
        teamVolunteers[volunteerFilter] != null &&
        teamTasks[taskFilter] != null
      ) {
        return;
      }

      try {
        const response = await fetch(
          `http://localhost/vms/backend/api/teams.php?id=${id}&tasks=${taskFilter}&volunteers=${volunteerFilter}`
        );
        if (response) {
          const data = await response.json();

          setTeam(data.data.details);
          setTeamVolunteers({
            ...teamVolunteers,
            [volunteerFilter]: data.data.teamVolunteers,
          });
          setTeamTasks({
            ...teamTasks,
            [taskFilter]: data.data.teamTasks,
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        hideLoading();
      }
    };

    fetchTeam();
  }, [taskFilter, volunteerFilter, refetch]);
  const handleRefetch = () => {
    setTeamVolunteers({});
    setTeamTasks({});
    setVolunteerFilter("current");
    setTaskFilter("current");
    setRefetch(!refetch);
  };
  return (
    <div className="teams-detail px-4 w-full mx-auto">
      <Link
        to="/teams"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        ← Back to Teams
      </Link>

      {team.id ? (
        <>
          <TeamCard team={team} />
          <div className="mt-8">
            <TeamTabs
              teamTasks={teamTasks[taskFilter]}
              teamVolunteers={teamVolunteers[volunteerFilter]}
              volunteersFilter={setVolunteerFilter}
              tasksFilter={setTaskFilter}
              volunteersType={volunteerFilter}
              tasksType={taskFilter}
              teamId={team.id}
              reFetchData={handleRefetch}
            />
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Loading team details...
        </div>
      )}
    </div>
  );
};

export default TeamDetails;
