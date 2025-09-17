// components/VolunteerDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const VolunteerDetail = () => {
  const { id } = useParams(); // This extracts the :id from the URL
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVolunteer = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await fetch(
          `http://localhost/fekra_volunteers/api/volunteers.php?id=${id}`
        );
        if (!response.ok) {
          throw new Error("Volunteer not found");
        }
        const data = await response.json();
        setVolunteer(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteer();
  }, [id]);

  if (loading)
    return <div className="loading">Loading volunteer details...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!volunteer) return <div className="not-found">Volunteer not found</div>;
  console.log(volunteer);
  return (
    <div className="volunteer-detail">
      <Link to="/volunteers" className="back-link">
        ← Back to Volunteers
      </Link>

      <div className="volunteer-header"></div>

      <div className="volunteer-info">{volunteer.data.firstName}</div>
    </div>
  );
};

export default VolunteerDetail;
