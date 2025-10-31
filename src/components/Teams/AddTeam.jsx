import { Link } from "react-router-dom";
import TeamForm from "./TeamForm";
import { useOverLay } from "../../Contexts/OverLayContext";
import { useEffect, useState } from "react";
import { LoadingTime } from "../Global/Global";
import { useDocumentTitle } from "../../Hooks/useDocumentTitle";
const AddTeam = () => {
  const { hideLoading } = useOverLay();
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      hideLoading();
      setFinished(true);
    }, LoadingTime);
  }, []);
  useDocumentTitle(["Add new team"]);
  return (
    <>
      {finished && (
        <div className="add-teams h-full   px-4 max-w-6xl w-6xl mx-auto mb-10 fadeIn">
          <div className="form-container  rounded-lg shadow-xl  p-4 w-full m-auto m-5 mb-10">
            <h2 className="text-center text-3xl font-bold text-gray-700 mb-10">
              Add a Team
            </h2>
            <TeamForm />
          </div>
        </div>
      )}
    </>
  );
};
export default AddTeam;
