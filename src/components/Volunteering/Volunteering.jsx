import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useFetching from "../../Hooks/useFetching";
import VolunteeringTab from "../Teams/VolunteeringTab";
import AddTaskTab from "../Tasks/AddTaskTab";
import { useDocumentTitle } from "../../Hooks/useDocumentTitle";
function Volunteering({ type }) {
  const [volunteering, setVolunteering] = useState(null);
  const { fetchData } = useFetching();
  const [loaded, setLoaded] = useState(false);
  const [selectedVolunteering, setSelectedVolunteering] = useState(null);
  const addTaskSection = useRef(null);
  const main = useRef(null);
  const [volunteeringFilter, setVolunteeringFilter] = useState("current");
  useEffect(() => {
    const fetchVolunteeringData = async () => {
      const shouldFetch = () => {
        if (!volunteering) return true;
        if (!volunteering[volunteeringFilter]) return true;
      };
      if (shouldFetch()) {
        const data = await fetchData(
          `teamVolunteers.php?type=${volunteeringFilter}`
        );
        setVolunteering((prev) => ({
          ...prev,
          [volunteeringFilter]: data,
        }));
        console.log("yes you should fetch");
      } else {
        console.log("no you shouldn't");
      }

      setLoaded(true);
    };

    fetchVolunteeringData();
  }, [volunteeringFilter]);
  useDocumentTitle(["Volunteerings"]);
  return (
    <>
      {loaded && (
        <div
          className=" h-full grid grid-cols-1 w-full px-4 mx-auto mb-10 fadeIn"
          ref={main}
        >
          {!type && (
            <div className="py-10 flex justify-between">
              <div className="">Add a Volunteer</div>
              <div className="">
                {/* <LinkBtn to="volunteers/add" text="Add a Volunteer" /> */}
                <Link
                  to="add"
                  className="w-full h-full text-center flex justify-center items-center"
                ></Link>
              </div>
            </div>
          )}
          <div className="w-full fadeIn">
            <VolunteeringTab
              rows={volunteering?.[volunteeringFilter]?.volunteering || []}
              filter={volunteeringFilter}
              setFilter={setVolunteeringFilter}
              handleAddTask={(row) => {
                setSelectedVolunteering(row);
                setTimeout(() => {
                  addTaskSection.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "end",
                  });
                }, 200);
              }}
              handleAddTeamVolunteer={(dd) => {
                console.log(dd);
              }}
              type="all"
            />
          </div>

          <AddTaskTab
            cancel={() => {
              setSelectedVolunteering(null);
              main.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
            hide={true}
            selectedVolunteering={selectedVolunteering}
            ref={addTaskSection}
          />
        </div>
      )}
    </>
  );
}

export default Volunteering;
