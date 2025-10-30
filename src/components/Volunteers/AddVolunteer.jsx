import { Link } from "react-router-dom";
import VolunteerForm from "./VolunteerForm";
import { useOverLay } from "../../Contexts/OverLayContext";
import { useEffect, useState } from "react";
import { useDocumentTitle } from "../../Hooks/useDocumentTitle";
const AddVolunteer = () => {
  const { hideLoading } = useOverLay();
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      hideLoading();
      setFinished(true);
    }, 500);
  }, []);
  useDocumentTitle(["Add new volunteer"]);
  return (
    <>
      {finished && (
        <div className="add-volunteer w-6xl mx-auto">
          <Link to="/volunteers" className="back-link">
            ← Back to Volunteers
          </Link>
          <div className="form-container  rounded-lg shadow-xl  p-4   mx-auto m-5 mb-10">
            <h1 className="text-center text-3xl font-bold text-gray-700 mb-10">
              Add a volunteer page
            </h1>
            <VolunteerForm />
          </div>
        </div>
      )}
    </>
  );
};
export default AddVolunteer;
