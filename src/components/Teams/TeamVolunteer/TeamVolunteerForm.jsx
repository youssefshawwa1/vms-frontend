import { useState, useEffect } from "react";
import useFetching from "../../Global/Helpers/useFetching";

const TeamVolunteerForm = ({ volunteerId, teamId, callBack }) => {
  const { fetchData, sendData } = useFetching();
  const [formData, setFormData] = useState({
    volunteerTitle: "",
    startDate: "",
    roleId: "",
    description: "",
  });
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      await fetchData("roles.php", setRoles);
    };
    fetchRoles();
  }, []);

  const [errors, setErrors] = useState({});
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length === 0) {
      const data = {
        action: "addVolunteer",
        data: {
          userId: 1001,
          teamId: teamId,
          volunteerId: volunteerId,
          volunteerTitle: formData.volunteerTitle,
          startDate: formData.startDate,
          roleId: formData.roleId,
          description: formData.description,
        },
      };
      await sendData("teams.php", data, callBack);
    } else {
      setErrors(formErrors);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.volunteerTitle.trim())
      newErrors.volunteerTitle = "Volunteer title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";

    if (!formData.roleId) newErrors.roleId = "Role type is required";
    return newErrors;
  };
  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <div className="sections-container grid sm:grid-cols-1  gap-11 justify">
        <div className="section">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b text-left ">
            Volunteering Information
          </h2>
          <div className=" grid sm:grid-cols-1 gap-6 md:grid-cols-2 ">
            <div className="grid grid-cols-1 sm:grid-cols-[30%_1fr] grid gap-2 md:grid-cols-1">
              <div>
                <label htmlFor="volunteerTitle">Volunteer Title:</label>
              </div>
              <div>
                <input
                  autoComplete="off"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-yellow-200 focus:border-yellow-200 outline-none transition 
                        ${
                          errors.volunteerTitle
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                  type="text"
                  name="volunteerTitle"
                  id="volunteerTitle"
                  value={formData.volunteerTitle}
                  onChange={handleChange}
                  placeholder="CEO.."
                />
                {errors.volunteerTitle && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.volunteerTitle}
                  </p>
                )}
                {/* <p className="mt-1 text-sm text-red-600">error</p> */}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[30%_1fr] grid gap-2 md:grid-cols-1">
              <div>
                <label htmlFor="roleId">Role Type:</label>
              </div>
              <div>
                <select
                  autoComplete="off"
                  id="roleId"
                  name="roleId"
                  value={formData.roleId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-yellow-200 focus:border-yellow-200 outline-none transition 
                    ${errors.roleId ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">Select Type</option>
                  {/* <option value="male">Male</option>
                  <option value="female">Female</option> */}
                  {roles.map((role) => {
                    return (
                      <option key={role.id} value={role.id}>
                        {role.roleTitle}
                      </option>
                    );
                  })}
                </select>
                {errors.roleId && (
                  <p className="mt-1 text-sm text-red-600">{errors.roleId}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[30%_1fr] grid gap-2 md:grid-cols-1">
              <div>
                <label htmlFor="description">Description:</label>
              </div>
              <div>
                <textarea
                  autoComplete="off"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-yellow-200 focus:border-yellow-200 outline-none transition 
                            ${
                              errors.description
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                  type="text"
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Some Description.."
                ></textarea>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[30%_1fr] grid gap-2 md:grid-cols-1">
              <div>
                <label htmlFor="startDate">Start Date:</label>
              </div>
              <div>
                <input
                  autoComplete="off"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-yellow-200 focus:border-yellow-200 outline-none transition 
                     ${errors.startDate ? "border-red-500" : "border-gray-300"}
                    `}
                  type="date"
                  name="startDate"
                  id="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.startDate}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add other fields similarly */}
      <div className="text-center p-4">
        <button
          className="bg-yellow-200 w-70  h-full p-4 text-white rounded-lg hover:bg-yellow-300 focus:bg-yellow-400 transition-color duration-200 ease-linear font-bold shadow-xl cursor-pointer"
          type="submit"
        >
          Submit
        </button>
      </div>
    </form>
  );
};
export default TeamVolunteerForm;
