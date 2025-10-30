import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useFetching from "../../Hooks/useFetching";
import TasksTab from "./TasksTab";
import { useDocumentTitle } from "../../Hooks/useDocumentTitle";
function Tasks({ type }) {
  const [tasks, setTasks] = useState(null);
  const { fetchData } = useFetching();
  const [loaded, setLoaded] = useState(false);
  const [tasksFilter, setTasksFilter] = useState("current");
  const [reFetch, setRefetch] = useState(false);
  const main = useRef(null);
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchVolunteeringData = async () => {
      const shouldFetch = () => {
        if (!tasks) return true;
        if (!tasks[tasksFilter]) return true;
      };
      if (shouldFetch()) {
        const data = await fetchData(`tasks.php?type=${tasksFilter}`);
        setTasks((prev) => ({
          ...prev,
          [tasksFilter]: data,
        }));
        setData((prev) => ({
          ...prev,
          [tasksFilter]: data,
        }));
        setLoaded(true);
      } else {
        return;
      }
    };

    fetchVolunteeringData();
  }, [tasksFilter, reFetch]);
  useDocumentTitle(["Tasks"]);
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
                <Link
                  to="add"
                  className="w-full h-full text-center flex justify-center items-center"
                ></Link>
              </div>
            </div>
          )}

          <div className="w-full fadeIn">
            <TasksTab
              rows={data?.[tasksFilter]?.tasks || []}
              filter={tasksFilter}
              setFilter={setTasksFilter}
              reFetch={() => {
                setTasks(null);
                setRefetch((prev) => !prev);
              }}
              type="forTasks"
            />
            {/* {console.log(tasks?.[tasksFilter]?.tasks)} */}
          </div>
        </div>
      )}
    </>
  );
}

export default Tasks;
