import { useParams } from "react-router-dom";
import { useLoading } from "../../../contexts/LoadingContext";
import { useEffect } from "react";
export default function TeamVolunteer() {
  const { id, tvId } = useParams();
  const { hideLoading } = useLoading();
  console.log("Team ID:", id);
  console.log("Team Volunteer ID:", tvId);
  useEffect(() => {
    hideLoading();
  }, []);
  return (
    <div>
      <h1>Team Volunteer Details</h1>
      <p>Team: {id}</p>
      <p>Volunteer: {tvId}</p>
    </div>
  );
}
