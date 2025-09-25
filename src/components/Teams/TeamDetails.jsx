// components/TeamDetails.jsx
import { useState, useEffect } from "react";
import { useParams, Link, href } from "react-router-dom";
import { useLoading } from "../../contexts/LoadingContext";
import TeamCard from "./TeamCard";
import TeamTabs from "./TeamTabs"; // Import the tabs component
import { useTeam } from "../../contexts/TeamContext";
import useFetching from "../Global/Helpers/useFetching";
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
    setVolunteeringFilter,
    setTasksFilter,
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
        console.log(data);
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
  return (
    <div className="teams-detail px-4 w-full max-w-6xl mx-auto mb-10">
      <Link
        to="/teams"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        ← Back to Teams
      </Link>

      {teamDetails.id && (
        <>
          <TeamCard />
          <div className="mt-8">
            <TeamTabs />
          </div>
        </>
      )}
    </div>
  );
};

export default TeamDetails;
