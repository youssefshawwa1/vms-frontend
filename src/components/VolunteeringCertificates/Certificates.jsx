import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useFetching from "../../Hooks/useFetching";
import CertificatesTab from "./CertificatesTab";

function Certificates({ type }) {
  const [certificates, setCertificates] = useState(null);
  const { fetchData } = useFetching();
  const [loaded, setLoaded] = useState(false);
  const [tasksFilter, setTasksFilter] = useState("current");
  const [reFetch, setRefetch] = useState(false);
  const main = useRef(null);
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchCertificates = async () => {
      const shouldFetch = () => {
        if (!certificates) return true;
      };
      if (shouldFetch()) {
        const data = await fetchData(`certificates.php`);
        setCertificates(data);
        setData(data);
        setLoaded(true);
      } else {
        return;
      }
    };

    fetchCertificates();
  }, [reFetch]);
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
            <CertificatesTab
              rows={data?.certificates || []}
              type="forCertificates"
            />
            {/* {console.log(tasks?.[tasksFilter]?.tasks)} */}
          </div>
        </div>
      )}
    </>
  );
}

export default Certificates;
