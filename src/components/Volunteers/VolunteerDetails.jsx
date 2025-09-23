// components/VolunteerDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLoading } from "../../contexts/LoadingContext";
const VolunteerDetail = () => {
  const { id } = useParams(); // This extracts the :id from the URL
  const [volunteer, setVolunteer] = useState({});
  const { hideLoading } = useLoading();
  useEffect(() => {
    const fetchVolunteer = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch(
          `http://localhost/vms/backend/api/volunteers.php?id=${id}`
        );
        if (!response.ok) {
          throw new Error("Volunteer not found");
        }
        const data = await response.json();
        setVolunteer(data.data);
      } catch (err) {
        console.log(err);
      } finally {
        hideLoading();
      }
    };

    fetchVolunteer();
  }, [id]);

  console.log(volunteer);
  return (
    <div className="volunteer-detail px-4">
      <Link to="/volunteers" className="back-link">
        ← Back to Volunteers
      </Link>

      <div className="volunteer-header"></div>

      <div className="volunteer-info">{volunteer.firstName}</div>
    </div>
  );
};

export default VolunteerDetail;
