import { useState } from "react";
import { useLoading } from "../../contexts/LoadingContext";
const TeamForm = (props) => {
  const [formData, setFormData] = useState({
    teamName: "",
    description: "",
  });
  //   const { isLoading, setIsLoading } = useState(true);
  const {
    showLoading,
    hideLoading,
    showMessage,
    hideMessage,
    isMessageVisible,
  } = useLoading();
  const [errors, setErrors] = useState({});
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length === 0) {
      showLoading();
      const data = {
        action: "create",
        data: {
          userId: 1001,
          teamName: formData.teamName,
          description: formData.description,
        },
      };
      try {
        const response = await fetch(
          "http://localhost/vms/backend/api/teams.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        const res = await response.json();

        if (res.result) {
          setTimeout(() => {
            hideLoading();
            showMessage(res.message, "Success");
            setFormData({
              teamName: "",
              description: "",
            });
          }, 1000);
          // setTimeout(() => {

          // }, 2000);
        } else {
          setTimeout(() => {
            showMessage(res.message, "Internal Error");
            hideLoading();
          }, 1000);
        }
      } catch (error) {
        setTimeout(() => {
          hideLoading();
          showMessage("Server can't be Reached!", "Connection Error");
        }, 1000);
      } finally {
        setTimeout(() => {
          hideMessage();
        }, 2000);
      }
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

    if (!formData.teamName.trim()) newErrors.teamName = "Team name is required";

    if (!formData.description.trim())
      newErrors.description = "Description is required!";

    return newErrors;
  };
  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <div className="sections-container grid sm:grid-cols-1  gap-11 justify">
        <div className="section">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b text-left ">
            Team Information
          </h2>
          <div className=" grid sm:grid-cols-1 gap-6 md:grid-cols-2 ">
            <div className="grid grid-cols-1 sm:grid-cols-[30%_1fr] grid gap-2 md:grid-cols-1">
              <div>
                <label htmlFor="teamName">Team Name:</label>
              </div>
              <div>
                <input
                  autoComplete="off"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-yellow-200 focus:border-yellow-200 outline-none transition 
                        ${
                          errors.teamName ? "border-red-500" : "border-gray-300"
                        }`}
                  type="text"
                  name="teamName"
                  id="teamName"
                  value={formData.teamName}
                  onChange={handleChange}
                  placeholder="Logistics..."
                />
                {errors.teamName && (
                  <p className="mt-1 text-sm text-red-600">{errors.teamName}</p>
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
                  placeholder="this team is for logistics....s"
                ></textarea>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description}
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
export default TeamForm;
