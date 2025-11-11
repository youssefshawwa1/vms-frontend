import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useVolunteering } from "../../Contexts/VolunteeringContext";
import useFetching from "../../Hooks/useFetching";
import Card from "../Global/Card";
import { Edit, Cancel } from "../Global/Icons";
import VolunteeringForm from "./VolunteeringForm";
import VolunteeringTabs from "./VolunteeringTabs";
import { useDocumentTitle } from "../../Hooks/useDocumentTitle";
const VolunteeringDetails = () => {
  const {
    volunteeringDetails,
    volunteeringTasks,
    tasksFilter,
    reFetch,
    reFetchData,
    setVolunteeringTasks,
    setVolunteeringDetails,
  } = useVolunteering();
  const { fetchData } = useFetching();
  const { id } = useParams();
  const [cardData, setCardData] = useState({});
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const fetchVolunteeringData = async () => {
      // Determine what needs to be fetched - matching TeamDetails pattern
      const shouldFetchAll = !(
        volunteeringTasks[tasksFilter] && volunteeringDetails
      );
      const shouldFetchTasks = !(
        volunteeringTasks[tasksFilter] || tasksFilter === "current"
      );
      const shouldFetchVolunteering = !volunteeringDetails;

      // If nothing needs to be fetched, exit early
      if (!shouldFetchAll && !shouldFetchTasks && !shouldFetchVolunteering) {
        return;
      }

      try {
        let volunteeringData, tasksData;

        // Fetch combined volunteering data if needed
        if (shouldFetchAll) {
          volunteeringData = await fetchData(
            `teamVolunteers.php?id=${id}&tasks=${tasksFilter}&volunteering`
          );
        }

        // Fetch tasks only if needed and not part of the combined fetch
        if (shouldFetchTasks && !shouldFetchAll) {
          tasksData = await fetchData(
            `teamVolunteers.php?id=${id}&tasks=${tasksFilter}`
          );
        }

        // Fetch volunteering only if needed and not part of the combined fetch
        if (shouldFetchVolunteering && !shouldFetchAll) {
          volunteeringData = await fetchData(
            `teamVolunteers.php?id=${id}&volunteering`
          );
        }

        // Use the data from the combined fetch if it happened, otherwise use individual fetches
        const finalData = volunteeringData || tasksData;
        if (!finalData) {
          console.log("Error: No data received");
          return;
        }

        // Update volunteering details and card data only if combined data was fetched
        if (volunteeringData) {
          setEdit(false);
          setVolunteeringDetails(volunteeringData.details);
          setCardData({
            label: volunteeringData.details.volunteerTitle,
            description: volunteeringData.details.description,
            lastItem: {
              label: "Volunteering ID:",
              text: volunteeringData.details.id,
            },
            sections: [
              {
                label: "Volunteering Info",
                items: [
                  {
                    label: "Role Type:",
                    text: volunteeringData.details.role?.roleTitle,
                  },
                  {
                    label: "Role Des:",
                    text: volunteeringData.details.role?.roleDescription,
                  },
                  {
                    label: "Team:",
                    text: volunteeringData.details.team?.teamName,
                  },
                  {
                    label: "Start Date:",
                    text: volunteeringData.details.startDate,
                  },
                  {
                    label: "End Date:",
                    text: volunteeringData.details.endDate,
                  },
                ],
              },
              {
                label: "Volunteer Information",
                items: [
                  {
                    label: "Name:",
                    text: volunteeringData.details.volunteer?.volunteerName,
                  },
                  {
                    label: "Email:",
                    text: volunteeringData.details.volunteer?.volunteerEmail,
                  },
                  {
                    label: "Phone:",
                    text: volunteeringData.details.volunteer?.volunteerPhone,
                  },
                ],
              },
              {
                type: "last",
                items: [
                  {
                    type: "last",
                    label: "Inserted:",
                    text: volunteeringData.details.createdAt,
                  },
                  {
                    type: "last",
                    label: "By:",
                    text: volunteeringData.details.createdBy?.userName,
                  },
                  {
                    type: "last",
                    label: "Updated:",
                    text: volunteeringData.details.updatedAt,
                  },
                  {
                    type: "last",
                    label: "By:",
                    text: volunteeringData.details.updatedBy?.userName,
                  },
                ],
              },
            ],
          });
        }

        // Update volunteering tasks state
        if (volunteeringData) {
          setVolunteeringTasks((prev) => ({
            ...prev,
            [tasksFilter]: volunteeringData.volunteeringTasks,
          }));
        } else if (tasksData) {
          setVolunteeringTasks((prev) => ({
            ...prev,
            [tasksFilter]: tasksData.volunteeringTasks,
          }));
        }
      } catch (error) {
        console.log("Fetch error:", error);
      }
    };

    fetchVolunteeringData();
  }, [reFetchData, tasksFilter]); // Added tasksFilter to dependencies

  const handleRefetch = () => {
    reFetch();
    setEdit(!edit);
  };
  useDocumentTitle([volunteeringDetails?.volunteerTitle, "Volunteering"]);
  return (
    <div className="px-4 w-full mx-auto mb-10  animate-slide-up">
      {cardData.lastItem && (
        <>
          <div className="bg-white rounded-lg shadow-md mb-6 border border-gray-200">
            <div className=" animate-slide-up relative">
              {!edit && (
                <div className=" animate-slide-up p-6">
                  <div
                    className="absolute top-0 right-0 m-2 p-1 z-55 cursor-pointer"
                    onClick={() => setEdit(!edit)}
                  >
                    <Edit />
                  </div>
                  <Card data={cardData} />
                </div>
              )}

              {edit && (
                <div className=" animate-slide-up p-6">
                  <p className="text-red-400 text-xs pr-6 mb-4">
                    <span className="font-bold">Note:</span> if you need to
                    change the team or the volunteer, you will have to end this
                    volunteering, or try to delete it! It can't be deleted if
                    there are tasks related to it.
                  </p>
                  <div
                    className="absolute top-0 right-0 m-2 p-1 z-55 cursor-pointer"
                    onClick={() => setEdit(!edit)}
                  >
                    <Cancel />
                  </div>
                  <VolunteeringForm
                    type="update"
                    volunteeringDetails={volunteeringDetails}
                    callBack={handleRefetch}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="mt-8  animate-slide-up">
            <VolunteeringTabs />
          </div>
        </>
      )}
    </div>
  );
};

export default VolunteeringDetails;
