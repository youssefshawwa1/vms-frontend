import { Link } from "react-router-dom";
import TeamForm from "./TeamForm";
import { useLoading } from "../../contexts/LoadingContext";
import { useEffect, useState } from "react";
const AddTeam = () => {
  const { hideLoading } = useLoading();
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      hideLoading();
      setFinished(true);
    }, 500);
  }, []);
  return (
    <>
      {finished && (
        <div className="add-teams h-full   px-4 max-w-6xl w-6xl mx-auto">
          <Link to="/teams" className="back-link">
            ← Back to Teams
          </Link>
          <div className="form-container  rounded-lg shadow-xl  p-4 w-full m-auto m-5 mb-10">
            <h1 className="text-center text-3xl font-bold text-gray-700 mb-10">
              Add a Team
            </h1>
            <TeamForm type="create" />
          </div>
        </div>
      )}
    </>
  );
};
export default AddTeam;
