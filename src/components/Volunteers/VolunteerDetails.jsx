// components/VolunteerDetail.jsx
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import VolunteerCard from "./VolunteerCard";
import VolunteerTabs from "./VolunteerTabs";
import { useVolunteer } from "../../contexts/VolunteerContext";
import useFetching from "../Global/Helpers/useFetching";
import { useLoading } from "../../contexts/LoadingContext";
const VolunteerDetail = () => {
  const { id } = useParams(); // This extracts the :id from the URL
  const { isLoading } = useLoading();
  const { fetchData } = useFetching();
  const {
    volunteerDetails,
    volunteerTeams,
    volunteerTasks,
    volunteerVolunteering,
    volunteerHours,
    volunteerCertificates,
    // Message states
    setVolunteerDetails,
    setVolunteerTeams,
    setVolunteerTasks,
    setVolunteerVolunteering,
    setVolunteerHours,
    setVolunteerCertificates,
    teamsFilter,
    volunteeringFilter,
    tasksFilter,
    reFetch,
    reFetchData,
    setTeamsFilter,
    setVolunteeringFilter,
    setTasksFilter,
  } = useVolunteer();
  useEffect(() => {
    const fetchVolunteer = async () => {
      if (
        volunteerTasks[tasksFilter] &&
        volunteerVolunteering[volunteeringFilter] &&
        volunteerTeams[teamsFilter]
      ) {
        return;
      }
      const data = await fetchData(
        `volunteers.php?id=${id}&tasks=${teamsFilter}&volunteering=${volunteeringFilter}&teams=${tasksFilter}&volunteer`
      );

      if (data) {
        setVolunteerDetails(data.details);
        setVolunteerTasks({
          ...volunteerTasks,
          [tasksFilter]: data.volunteerTasks,
        });
        setVolunteerTeams({
          ...volunteerTeams,
          [teamsFilter]: data.volunteerTeams,
        });
        setVolunteerVolunteering({
          ...volunteerVolunteering,
          [volunteeringFilter]: data.volunteering,
        });
      } else {
        console.log("error");
      }
    };

    fetchVolunteer();
  }, [reFetchData]);
  useEffect(() => {
    const fetchVolunteer = async () => {
      if (volunteerTeams[teamsFilter] || teamsFilter == "current") {
        return;
      }
      const data = await fetchData(
        `volunteers.php?id=${id}&teams=${teamsFilter}`
      );

      if (data) {
        setVolunteerTeams({
          ...volunteerTeams,
          [teamsFilter]: data.volunteerTeams,
        });
      }
    };

    fetchVolunteer();
  }, [teamsFilter]);

  useEffect(() => {
    const fetchVolunteer = async () => {
      if (
        volunteerVolunteering[volunteeringFilter] ||
        volunteeringFilter == "current"
      ) {
        return;
      }
      const data = await fetchData(
        `volunteers.php?id=${id}&volunteering=${volunteeringFilter}`
      );

      if (data) {
        setVolunteerVolunteering({
          ...volunteerVolunteering,
          [volunteeringFilter]: data.volunteering,
        });
      }
    };

    fetchVolunteer();
  }, [volunteeringFilter]);

  useEffect(() => {
    const fetchVolunteer = async () => {
      if (volunteerTasks[tasksFilter] || tasksFilter == "current") {
        return;
      }
      const data = await fetchData(
        `volunteers.php?id=${id}&tasks=${tasksFilter}`
      );

      if (data) {
        setVolunteerTasks({
          ...volunteerTasks,
          [tasksFilter]: data.volunteerTasks,
        });
      }
    };

    fetchVolunteer();
  }, [tasksFilter]);
  return (
    <div className="teams-detail px-4 w-full max-w-6xl mx-auto mx-auto mb-10">
      <Link
        to="/volunteers"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        ← Back to Volunteers
      </Link>

      {volunteerDetails.id && (
        <>
          <VolunteerCard />
          <div className="mt-8">
            <VolunteerTabs />
          </div>
        </>
      )}
    </div>
  );
};

export default VolunteerDetail;
