// import CertificateForm from "./CertificateForm";
import { useEffect, useState } from "react";
import CertificateForm from "./CertificateForm";
import { Cancel } from "../Global/Icons";
const AddCertificate = ({
  selectedVolunteering,
  callBack,
  cancel,
  hide,
  selectedVolunteeringHide,
  ref,
  whenVisible,
}) => {
  const [fadeIn, setFadeIn] = useState(false);
  const [show, setShow] = useState(false);
  const [data, setData] = useState({});
  useEffect(() => {
    if (selectedVolunteering) {
      setData({
        ...selectedVolunteering,
      });
      setShow(true);
      setFadeIn(true);
    } else {
      setFadeIn(false);
      setTimeout(() => {
        setShow(false);
      }, 500);
    }
  }, [selectedVolunteering]);
  return (
    <>
      {show && (
        <div className={`${fadeIn ? "animate-slide-up" : "fadeOut"}`} ref={ref}>
          <div className="mt-4">
            {!selectedVolunteeringHide && (
              <div className=" rounded-lg p-4">
                <div className="flex items-center justify-between mb-3 border-b border-blue-900 pb-4">
                  <h3 className="text-lg font-medium">Details</h3>
                  <button
                    onClick={cancel}
                    className="text-sm font-medium underline"
                  >
                    <Cancel />
                  </button>
                </div>

                <div className={"grid grid-cols-1" + !hide && "md:grid-cols-2"}>
                  <div className="mb-4">
                    <h3 className="text-md font-medium  mb-2 ">
                      Hours Details:
                    </h3>

                    <div className="grid grid-cols-1 gap-1">
                      <div>
                        <div>
                          <span className="text-sm  font-medium">
                            Total Hours:
                          </span>
                          <span className="ml-2 ">
                            {`${data?.totalHours || "N/A"} Hr`}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-sm  font-medium">
                          Issued Hours:
                        </span>
                        <span className="ml-2 ">
                          {`${data?.issuedHours || "N/A"} Hr`}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm  font-medium">
                          Current Hours:
                        </span>
                        <span className="ml-2 ">
                          {`${
                            data?.currentHours || "N/A"
                          } Hr (Maximum that can be Issued)`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-5">
              <CertificateForm
                volunteerrDetails={{
                  id: data?.id,
                  currentHours: data?.currentHours,
                }}
                callBack={callBack}
              />
              {whenVisible ? whenVisible() : ""}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddCertificate;
