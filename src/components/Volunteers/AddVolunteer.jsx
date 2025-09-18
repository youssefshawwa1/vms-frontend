import { Link } from "react-router-dom";
import VolunteerForm from "./VolunteerForm";
import { useLoading } from "../../contexts/LoadingContext";
import { useEffect } from "react";
const AddVolunteer = () => {
  const { hideLoading, isLoading } = useLoading();
  useEffect(() => {
    setTimeout(() => {
      hideLoading();
    }, 500);
  }, []);
  return (
    <>
      {!isLoading && (
        <div className="add-volunteer w-full ">
          <Link to="/volunteers" className="back-link">
            ← Back to Volunteers
          </Link>
          <div className="form-container  rounded-lg shadow-xl  p-4  max-w-250 m-auto m-5 mb-10">
            <h1 className="text-center text-3xl font-bold text-gray-700 mb-10">
              Add a volunteer page
            </h1>
            <VolunteerForm data="" />
          </div>
        </div>
      )}
    </>
  );
};
export default AddVolunteer;
