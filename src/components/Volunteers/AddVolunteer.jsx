import { Link } from "react-router-dom";
import VolunteerForm from "./VolunteerForm";
const AddVolunteer = () => {
  return (
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
  );
};
export default AddVolunteer;
// $volunteer->firstName = $request->data->firstName ?? "";
// $volunteer->lastName = $request->data->lastName ?? "";
// $volunteer->birthDate = $request->data->birthDate ?? "";
// $volunteer->major = $request->data->major ?? "";
// $volunteer->university = $request->data->university ?? "";
// $volunteer->createdBy["userId"] = $request->data->userId ?? "";
// $volunteer->phone = $request->data->phone ?? "";
// $volunteer->email = $request->data->email ?? "";
// $volunteer->volunteerId = $request->data->volunteerId ?? "";
