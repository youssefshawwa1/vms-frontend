// components/VolunteerDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import VolunteerForm from "./VolunteerForm";
import VolunteerTabs from "./VolunteerTabs";
import { useVolunteer } from "../../contexts/VolunteerContext";
import useFetching from "../Global/Helpers/useFetching";
import Card from "../Global/Card";
import { Edit, Cancel } from "../Global/Icons";
const VolunteerDetail = () => {
  const { id } = useParams(); // This extracts the :id from the URL
  const { fetchData } = useFetching();
  const [cardData, setCardData] = useState({});
  const {
    volunteerDetails,
    volunteerTeams,
    volunteerTasks,
    volunteerVolunteering,
    volunteerHours,
    volunteerCertificates,
    // Message states
    setVolunteerDetails,
    setVolunteerTeams,
    setVolunteerTasks,
    setVolunteerVolunteering,
    setVolunteerHours,
    setVolunteerCertificates,
    teamsFilter,
    volunteeringFilter,
    tasksFilter,
    reFetchData,
    reFetch,
  } = useVolunteer();
  useEffect(() => {
    const fetchVolunteer = async () => {
      if (
        volunteerTasks[tasksFilter] &&
        volunteerVolunteering[volunteeringFilter] &&
        volunteerTeams[teamsFilter]
      ) {
        return;
      }
      const data = await fetchData(
        `volunteers.php?id=${id}&tasks=${teamsFilter}&volunteering=${volunteeringFilter}&teams=${tasksFilter}&volunteer`
      );

      if (data) {
        setEdit(false);
        setVolunteerDetails(data.details);
        setCardData({
          label: data.details.firstName + " " + data.details.lastName,
          lastItem: {
            label: "Volunteer ID:",
            text: data.details.id,
          },
          sections: [
            {
              label: "Personal Information",
              items: [
                {
                  label: "First Name:",
                  text: data.details.firstName,
                },
                {
                  label: "Last Name:",
                  text: data.details.lastName,
                },
                {
                  label: "Birth Date:",
                  text: data.details.birthDate,
                },
                {
                  label: "Gender:",
                  text: data.details.gender,
                  // type: "date",
                },
              ],
            },
            {
              label: "Contact Info",
              items: [
                {
                  label: "Email:",
                  text: data.details.email,
                },
                {
                  label: "Phone:",
                  text: data.details.phone,
                },
              ],
            },
            {
              label: "Education Information",
              items: [
                {
                  label: "University / School:",
                  text: data.details.university,
                },
                {
                  label: "Major:",
                  text: data.details.major,
                },
              ],
            },
            {
              label: "Location Information",
              items: [
                {
                  label: "Nationality:",
                  text: data.details.nationality,
                },
                {
                  label: "Resident Country:",
                  text: data.details.residentCountry,
                },
              ],
            },
            {
              type: "last",
              items: [
                {
                  type: "last",
                  label: "Inserted:",
                  text: data.details.insertionDate,
                },
                {
                  type: "last",
                  label: "By:",
                  text: data.details.createdBy.userName,
                },
                {
                  type: "last",
                  label: "Updated:",
                  text: data.details.updatedAt,
                },
                {
                  type: "last",
                  label: "By:",
                  text: data.details.updatedBy.userName,
                },
              ],
            },
          ],
        });
        setVolunteerTasks({
          ...volunteerTasks,
          [tasksFilter]: data.volunteerTasks,
        });
        setVolunteerTeams({
          ...volunteerTeams,
          [teamsFilter]: data.volunteerTeams,
        });
        setVolunteerVolunteering({
          ...volunteerVolunteering,
          [volunteeringFilter]: data.volunteering,
        });
      } else {
        console.log("error");
      }
    };

    fetchVolunteer();
  }, [reFetchData]);
  useEffect(() => {
    const fetchVolunteer = async () => {
      if (volunteerTeams[teamsFilter] || teamsFilter == "current") {
        return;
      }
      const data = await fetchData(
        `volunteers.php?id=${id}&teams=${teamsFilter}`
      );

      if (data) {
        setVolunteerTeams({
          ...volunteerTeams,
          [teamsFilter]: data.volunteerTeams,
        });
      }
    };

    fetchVolunteer();
  }, [teamsFilter]);

  useEffect(() => {
    const fetchVolunteer = async () => {
      if (
        volunteerVolunteering[volunteeringFilter] ||
        volunteeringFilter == "current"
      ) {
        return;
      }
      const data = await fetchData(
        `volunteers.php?id=${id}&volunteering=${volunteeringFilter}`
      );

      if (data) {
        setVolunteerVolunteering({
          ...volunteerVolunteering,
          [volunteeringFilter]: data.volunteering,
        });
      }
    };

    fetchVolunteer();
  }, [volunteeringFilter]);

  useEffect(() => {
    const fetchVolunteer = async () => {
      if (volunteerTasks[tasksFilter] || tasksFilter == "current") {
        return;
      }
      const data = await fetchData(
        `volunteers.php?id=${id}&tasks=${tasksFilter}`
      );

      if (data) {
        setVolunteerTasks({
          ...volunteerTasks,
          [tasksFilter]: data.volunteerTasks,
        });
      }
    };

    fetchVolunteer();
  }, [tasksFilter]);
  const [edit, setEdit] = useState(false);

  return (
    <div className="teams-detail px-4 w-full mx-auto mx-auto mb-10 fadeIn">
      <Link
        to="/volunteers"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        ← Back to Volunteers
      </Link>

      {cardData.lastItem && (
        <>
          {/* <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200 relative fadeIn">
          <Card data={}/>
          </div> */}
          <div className="bg-white rounded-lg shadow-md  mb-6 border border-gray-200">
            <div className="fadeIn relative ">
              {!edit && (
                <div className="fadeIn p-6">
                  <div
                    className="absolute top-0 right-0 m-2 p-1 z-55"
                    onClick={() => setEdit(!edit)}
                  >
                    <Edit />
                  </div>
                  <Card data={cardData} />
                </div>
              )}
              {edit && (
                <div className="fadeIn p-6">
                  <div
                    className="absolute top-0 right-0 m-2 p-1  z-55"
                    onClick={() => setEdit(!edit)}
                  >
                    <Cancel />
                  </div>
                  <VolunteerForm
                    type="update"
                    volunteer={volunteerDetails}
                    reFetch={reFetch}
                  />
                </div>
              )}
            </div>
          </div>
          {/* <VolunteerCard /> */}
          <div className="mt-8 fadeIn">
            <VolunteerTabs />
          </div>
        </>
      )}
    </div>
  );
};

export default VolunteerDetail;
