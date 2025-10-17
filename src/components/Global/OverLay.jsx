import { useOverLay } from "../../Contexts/OverLayContext";
import { BiError } from "react-icons/bi";
import { GiConfirmed } from "react-icons/gi";
const Message = () => {
  const { messageText, messageType } = useOverLay();

  return (
    <div
      className={`overlay w-screen h-screen inset-0 flex fixed items-center justify-center z-100 `}
    >
      <div className=" text-center w-screen  p-4 relative h-40 items-center justify-center self-center">
        {messageType == "Success" ? (
          <GiConfirmed size={90} className="text-yellow-300 absulote m-auto " />
        ) : (
          <BiError size={90} className="text-yellow-300 absulote m-auto" />
        )}
        <div className="w-full">
          <h2 className="text-yellow-300 text-xl font-bold">{messageType}</h2>
          <p className="text-gray-300 font-medium">{messageText}</p>
        </div>
      </div>
    </div>
  );
};

const Loading = () => {
  return (
    <div
      className={`overlay w-screen h-screen inset-0 flex fixed items-center justify-center z-100`}
    >
      <div
        className={`pinner w-25 h-25 border-t-4 border-yellow-300 rounded-full animate-spin 
        `}
      ></div>
    </div>
  );
};
export { Loading, Message };
