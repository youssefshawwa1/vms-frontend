import { useLoading } from "../../../contexts/LoadingContext";
import { BiError } from "react-icons/bi";
import { GiConfirmed } from "react-icons/gi";
const Message = () => {
  const { messageText, messageType } = useLoading();
  return (
    <div className="overlay w-screen h-screen inset-0 flex fixed items-center justify-center z-50">
      <div className=" text-center w-40 h-25  p-4 relative h-40">
        {messageType == "Success" ? (
          <GiConfirmed size={90} className="text-yellow-300 absulote m-auto " />
        ) : (
          <BiError size={90} className="text-yellow-300 absulote m-auto" />
        )}
        <>
          {messageType} <br />
          {messageText}
        </>
      </div>
    </div>
  );
};

const Loading = () => {
  return (
    <div className="overlay w-screen h-screen inset-0 flex fixed items-center justify-center z-50">
      <div className="pinner w-25 h-25 border-t-4 border-yellow-300 rounded-full animate-spin "></div>
    </div>
  );
};
export { Loading, Message };
