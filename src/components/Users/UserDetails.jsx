// components/TeamDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFetching from "../../Hooks/useFetching";
import { Edit, Cancel, Block, Activate } from "../Global/Icons";
import Card from "../Global/Card";
import { useDocumentTitle } from "../../Hooks/useDocumentTitle";
import { useOverLay } from "../../Contexts/OverLayContext";
import UserForm from "./UserForm";
const UserDetails = ({ userId }) => {
  const { showPopUp, hidePopUp } = useOverLay();
  const { fetchData, sendData } = useFetching();
  const [userData, setUserData] = useState(null);
  const { id } = useParams();
  const [cardData, setCardData] = useState({});
  const [edit, setEdit] = useState(false);
  useEffect(() => {
    const fetchTeamData = async () => {
      if (!userData) {
        await fetchData(`users.php?id=${userId ? userId : id}`, setUserData);
      }
      if (userData) {
        setCardData({
          label: userData.details.userName,
          lastItem: {
            label: "User ID:",
            text: userData.details.id,
          },
          sections: [
            {
              label: "User Information",
              items: [
                { label: "First Name:", text: userData.details.firstName },
                { label: "Last Name:", text: userData.details.lastName },
                { label: "Username:", text: userData.details.userName },
                { label: "Email:", text: userData.details.userEmail },
                {
                  label: "Status:",
                  text: userData.details.status ? "Active" : "Disactive",
                },
              ],
            },
            {
              type: "last",
              items: [
                {
                  type: "last",
                  label: "Created at:",
                  text: userData.details.createdAt,
                },
                {
                  type: "last",
                  label: "Updated at:",
                  text: userData.details.updatedAt,
                },
              ],
            },
          ],
        });
      }
    };

    fetchTeamData();
  }, [userData, userId]);
  useDocumentTitle([
    userId ? "Your Profile" : userData?.details?.userName || id,
    "User",
  ]);

  const handleSwitchStatus = (e) => {
    const handleSend = async () => {
      const d = {
        action: "deActivate",
        data: {
          userId: userData?.details?.id,
          status: !userData?.details?.status,
        },
      };
      await sendData("users.php", d, () => {
        setUserData(null);
        hidePopUp();
      });
    };

    showPopUp(
      `${userData?.details?.status ? "Deactivate" : "Activate"} User`,
      <>
        <div className="p-3 space-y-0">
          <p className="block text-sm font-medium text-gray-500 ">
            Do you really want to{" "}
            {userData?.details?.status ? "Deactivate" : "Activate"} this user:
            <br />
            <b>{userData?.details?.userName}</b>?
          </p>
        </div>
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-300">
          <button
            type="button"
            onClick={handleSend}
            className="px-4 py-2 bg-main text-white rounded-md hover:bg-main-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
          >
            Yes
          </button>
        </div>
      </>
    );
  };
  return (
    <div className="teams-detail px-4 w-full mx-auto mx-auto mb-10  animate-slide-up">
      {cardData.lastItem && (
        <>
          <div className="bg-white rounded-lg shadow-md  mb-6 border border-gray-200">
            <div className=" animate-slide-up relative ">
              {!edit && (
                <div className=" animate-slide-up p-6">
                  {userId && (
                    <div
                      className="absolute top-0 right-0 m-2 p-1 z-55"
                      onClick={() => setEdit(!edit)}
                    >
                      <Edit />
                    </div>
                  )}
                  {!userId && (
                    <div
                      className="absolute top-0 right-0 m-2 p-1 z-55"
                      onClick={handleSwitchStatus}
                    >
                      {userData?.details?.status ? <Block /> : <Activate />}
                    </div>
                  )}
                  <Card data={cardData} />
                </div>
              )}
              {edit && (
                <div className=" animate-slide-up p-6">
                  <div
                    className="absolute top-0 right-0 m-2 p-1  z-55"
                    onClick={() => setEdit(!edit)}
                  >
                    <Cancel />
                  </div>
                  <UserForm
                    type="updateProfile"
                    user={userData}
                    reFetch={() => {
                      setUserData(null);
                      setEdit(!edit);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          {/* <VolunteerCard /> */}
          {/* <div className="mt-8 fadeIn">
            <TeamTabs />
          </div> */}
        </>
      )}
    </div>
  );
};

export default UserDetails;
