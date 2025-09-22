import { useState } from "react";
import { useLoading } from "../../contexts/LoadingContext";
const VolunteerForm = (props) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    major: "",
    university: "",
    phone: "",
    email: "",
    gender: "",
    nationality: "",
    residentCountry: "",
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
          firstName: formData.firstName,
          lastName: formData.lastName,
          birthDate: formData.birthDate,
          major: formData.major,
          university: formData.university,
          phone: formData.phone,
          email: formData.email,
          gender: formData.gender,
          nationality: formData.nationality,
          residentCountry: formData.residentCountry,
          userId: 1001,
        },
      };
      try {
        const response = await fetch(
          "http://192.168.0.2/vms/backend/api/volunteers.php",
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
              firstName: "",
              lastName: "",
              birthDate: "",
              major: "",
              university: "",
              phone: "",
              email: "",
              gender: "",
              nationality: "",
              residentCountry: "",
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

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.birthDate) newErrors.birthDate = "Birth date is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.university.trim())
      newErrors.university = "University Or School is required";
    if (!formData.major.trim()) newErrors.major = "Major is required.";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.nationality)
      newErrors.nationality = "Nationality is required";
    if (!formData.residentCountry)
      newErrors.residentCountry = "Resident country is required";

    return newErrors;
  };
  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <div className="sections-container grid sm:grid-cols-1  gap-11 justify">
        <div className="section">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b text-left ">
            Personal Information
          </h2>
          <div className=" grid sm:grid-cols-1 gap-6 md:grid-cols-2 ">
            <div className="grid grid-cols-1 sm:grid-cols-[30%_1fr] grid gap-2 md:grid-cols-1">
              <div>
                <label htmlFor="firstName">First Name:</label>
              </div>
              <div>
                <input
                  autoComplete="off"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-yellow-200 focus:border-yellow-200 outline-none transition 
                        ${
                          errors.firstName
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John.."
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firstName}
                  </p>
                )}
                {/* <p className="mt-1 text-sm text-red-600">error</p> */}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[30%_1fr] grid gap-2 md:grid-cols-1">
              <div>
                <label htmlFor="lastName">Last Name:</label>
              </div>
              <div>
                <input
                  autoComplete="off"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-yellow-200 focus:border-yellow-200 outline-none transition 
                            ${
                              errors.lastName
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe.."
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[30%_1fr] grid gap-2 md:grid-cols-1">
              <div>
                <label htmlFor="birthDate">Birth Date:</label>
              </div>
              <div>
                <input
                  autoComplete="off"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-yellow-200 focus:border-yellow-200 outline-none transition 
                     ${errors.birthDate ? "border-red-500" : "border-gray-300"}
                    `}
                  type="date"
                  name="birthDate"
                  id="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                />
                {errors.birthDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.birthDate}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[30%_1fr] grid gap-2 md:grid-cols-1">
              <div>
                <label htmlFor="gender">Gender:</label>
              </div>
              <div>
                <select
                  autoComplete="off"
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-yellow-200 focus:border-yellow-200 outline-none transition 
                    ${errors.gender ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="section">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b text-left ">
            Contact Info
          </h2>
          <div className=" grid sm:grid-cols-1 gap-6 md:grid-cols-1">
            <div className="grid grid-cols-1 sm:grid-cols-[30%_1fr] grid gap-2 md:grid-cols-1">
              <div>
                <label htmlFor="email">Email Address:</label>
              </div>
              <div>
                <input
                  autoComplete="off"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-yellow-200 focus:border-yellow-200 outline-none transition 
                    ${errors.email ? "border-red-500" : "border-gray-300"}`}
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@example.com.."
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[30%_1fr] grid gap-2 md:grid-cols-1">
              <div>
                <label htmlFor="phone">Phone Number</label>
              </div>
              <div>
                <input
                  autoComplete="off"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-yellow-200 focus:border-yellow-200 outline-none transition 
                    ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="70 702 700"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="section">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b text-left ">
            Education Information
          </h2>
          <div className=" grid sm:grid-cols-1 gap-6 md:grid-cols-2">
            <div className="grid grid-cols-1 sm:grid-cols-[30%_1fr] grid gap-2 md:grid-cols-1">
              <div>
                <label htmlFor="university">University / School:</label>
              </div>
              <div>
                <input
                  autoComplete="off"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-yellow-200 focus:border-yellow-200 outline-none transition 
                    ${
                      errors.university ? "border-red-500" : "border-gray-300"
                    }`}
                  type="text"
                  name="university"
                  id="university"
                  value={formData.university}
                  onChange={handleChange}
                  placeholder="Lebanese University.."
                />
                {errors.university && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.university}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[30%_1fr] grid gap-2 md:grid-cols-1">
              <div>
                <label htmlFor="major">Major:</label>
              </div>
              <div>
                <input
                  autoComplete="off"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-yellow-200 focus:border-yellow-200 outline-none transition 
                    ${errors.major ? "border-red-500" : "border-gray-300"}`}
                  type="text"
                  name="major"
                  id="major"
                  value={formData.major}
                  onChange={handleChange}
                  placeholder="Computer Scince"
                />
                {errors.major && (
                  <p className="mt-1 text-sm text-red-600">{errors.major}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="section">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b text-left ">
            Location Information
          </h2>
          <div className=" grid sm:grid-cols-1 gap-6 md:grid-cols-2">
            <div className="grid grid-cols-1 sm:grid-cols-[30%_1fr] grid gap-2 md:grid-cols-1">
              <div>
                <label htmlFor="nationality">Nationality:</label>
              </div>
              <div>
                <select
                  autoComplete="off"
                  id="nationality"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-yellow-200 focus:border-yellow-200 outline-none transition 
                    ${
                      errors.nationality ? "border-red-500" : "border-gray-300"
                    }`}
                >
                  <option value="">Select nationality</option>
                  <option value="lb">Lebanon</option>
                  <option value="sy">Syria</option>
                  <option value="ps">Palestine</option>
                  <option value="other">Other</option>
                </select>
                {errors.nationality && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.nationality}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[30%_1fr] grid gap-2 md:grid-cols-1">
              <div>
                <label htmlFor="residentCountry">Country of Residence:</label>
              </div>
              <div>
                <select
                  autoComplete="off"
                  id="residentCountry"
                  name="residentCountry"
                  value={formData.residentCountry}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-yellow-200 focus:border-yellow-200 outline-none transition 
                    ${
                      errors.residentCountry
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                >
                  <option value="">Select nationality</option>
                  <option value="lb">Lebanon</option>
                  <option value="sy">Syria</option>
                  <option value="ps">Palestine</option>
                  <option value="other">Other</option>
                </select>
                {errors.residentCountry && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.residentCountry}
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
export default VolunteerForm;
