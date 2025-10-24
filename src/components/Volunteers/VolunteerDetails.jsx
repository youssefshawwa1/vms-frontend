// components/VolunteerDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import VolunteerForm from "./VolunteerForm";
import VolunteerTabs from "./VolunteerTabs";

import { useVolunteer } from "../../Contexts/VolunteerContext";
import useFetching from "../../Hooks/useFetching";
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
    const fetchVolunteerData = async () => {
      // Determine what needs to be fetched
      const shouldFetchAll = !(
        volunteerTasks[tasksFilter] &&
        volunteerVolunteering[volunteeringFilter] &&
        volunteerTeams[teamsFilter]
      );
      const shouldFetchTeams = !(
        volunteerTeams[teamsFilter] || teamsFilter === "current"
      );
      const shouldFetchVolunteering = !(
        volunteerVolunteering[volunteeringFilter] ||
        volunteeringFilter === "current"
      );
      const shouldFetchCertificates = !volunteerCertificates;

      const shouldFetchTasks = !(
        volunteerTasks[tasksFilter] || tasksFilter === "current"
      );

      // If nothing needs to be fetched, exit early
      if (
        !shouldFetchAll &&
        !shouldFetchTeams &&
        !shouldFetchVolunteering &&
        !shouldFetchTasks &&
        !shouldFetchCertificates
      ) {
        return;
      }

      try {
        let allData, teamsData, volunteeringData, tasksData, certificatesData;

        // Fetch all volunteer data if needed
        if (shouldFetchAll) {
          allData = await fetchData(
            `volunteers.php?id=${id}&tasks=${tasksFilter}&volunteering=${volunteeringFilter}&teams=${teamsFilter}&volunteer&certificates`
          );
        }

        // Fetch individual data only if needed and not already covered by the allData fetch
        if (shouldFetchTeams && !shouldFetchAll) {
          teamsData = await fetchData(
            `volunteers.php?id=${id}&teams=${teamsFilter}`
          );
        }
        if (shouldFetchVolunteering && !shouldFetchAll) {
          volunteeringData = await fetchData(
            `volunteers.php?id=${id}&volunteering=${volunteeringFilter}`
          );
        }
        if (shouldFetchTasks && !shouldFetchAll) {
          tasksData = await fetchData(
            `volunteers.php?id=${id}&tasks=${tasksFilter}`
          );
        }
        if (shouldFetchCertificates && !shouldFetchAll) {
          certificatesData = await fetchData(
            `volunteers.php?id=${id}&certificates`
          );
        }
        const finalData =
          allData ||
          teamsData ||
          volunteeringData ||
          tasksData ||
          certificatesData;
        if (!finalData) {
          console.log("Error: No data received");
          return;
        }

        // Update main volunteer details and card data only if we fetched all data
        if (allData) {
          setEdit(false);
          setVolunteerDetails(allData.details);
          setCardData({
            label: `${allData.details.firstName} ${allData.details.lastName}`,
            lastItem: {
              label: "Volunteer ID:",
              text: allData.details.id,
            },
            sections: [
              {
                label: "Personal Information",
                items: [
                  { label: "First Name:", text: allData.details.firstName },
                  { label: "Last Name:", text: allData.details.lastName },
                  { label: "Birth Date:", text: allData.details.birthDate },
                  { label: "Gender:", text: allData.details.gender },
                ],
              },
              {
                label: "Contact Info",
                items: [
                  { label: "Email:", text: allData.details.email },
                  { label: "Phone:", text: allData.details.phone },
                ],
              },
              {
                label: "Education Information",
                items: [
                  {
                    label: "University / School:",
                    text: allData.details.university,
                  },
                  { label: "Major:", text: allData.details.major },
                ],
              },
              {
                label: "Location Information",
                items: [
                  { label: "Nationality:", text: allData.details.nationality },
                  {
                    label: "Resident Country:",
                    text: allData.details.residentCountry,
                  },
                ],
              },
              {
                type: "last",
                items: [
                  {
                    type: "last",
                    label: "Inserted:",
                    text: allData.details.insertionDate,
                  },
                  {
                    type: "last",
                    label: "By:",
                    text: allData.details.createdBy.userName,
                  },
                  {
                    type: "last",
                    label: "Updated:",
                    text: allData.details.updatedAt,
                  },
                  {
                    type: "last",
                    label: "By:",
                    text: allData.details.updatedBy.userName,
                  },
                ],
              },
            ],
          });
          setVolunteerTasks((prev) => ({
            ...prev,
            [tasksFilter]: allData.volunteerTasks,
          }));
          setVolunteerTeams((prev) => ({
            ...prev,
            [teamsFilter]: allData.volunteerTeams,
          }));
          setVolunteerVolunteering((prev) => ({
            ...prev,
            [volunteeringFilter]: allData.volunteering,
          }));
          setVolunteerCertificates(allData.certificates);
          setVolunteerHours(allData.volunteeringHours);
        }

        if (tasksData) {
          setVolunteerTasks((prev) => ({
            ...prev,
            [tasksFilter]: tasksData.volunteerTasks,
          }));
        }
        if (teamsData) {
          setVolunteerTeams((prev) => ({
            ...prev,
            [teamsFilter]: teamsData.volunteerTeams,
          }));
        }
        if (volunteeringData) {
          setVolunteerVolunteering((prev) => ({
            ...prev,
            [volunteeringFilter]: volunteeringData.volunteering,
          }));
        }
        if (certificatesData) {
          setVolunteerCertificates(certificatesData.certificates);
          setVolunteerHours(certificatesData.volunteeringHours);
        }
      } catch (error) {
        console.log("Fetch error:", error);
      }
    };

    fetchVolunteerData();
  }, [reFetchData, teamsFilter, volunteeringFilter, tasksFilter]);
  const [edit, setEdit] = useState(false);

  return (
    <div className=" px-5 w-full mx-auto mb-10 fadeIn">
      <Link
        to="/volunteers"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        ← Back to Volunteers
      </Link>

      {cardData.lastItem && (
        <>
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
          <div className="mt-8 fadeIn">
            <VolunteerTabs />
          </div>
        </>
      )}
    </div>
  );
};

export default VolunteerDetail;
