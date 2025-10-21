import { useEffect, useState } from "react";
import { useOverLay } from "../../Contexts/OverLayContext";

const PopUp = () => {
  const { popUpConfig, hidePopUp } = useOverLay();
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    if (popUpConfig.isVisible) {
      setTimeout(() => {
        setShouldRender(true);
      }, 300);
    }
  }, [popUpConfig.isVisible]);

  const handleCancel = () => {
    setShouldRender(false);
    setTimeout(() => hidePopUp(), 300);
  };

  if (!popUpConfig.isVisible && !shouldRender) return null;

  return (
    <>
      {popUpConfig.isVisible && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center overlay ${
            shouldRender ? "fadeIn" : "fadeOut"
          }`}
        >
          {/* Backdrop */}
          <div className={`absolute inset-0 `} onClick={handleCancel} />

          {/* Modal */}
          <div
            className={`
        relative bg-white rounded-lg shadow-xl w-full max-w-xs
        ${shouldRender ? "fadeIn" : "fadeOut"}
      `}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-300">
              <h2 className="text-xl font-semibold text-gray-800">
                {popUpConfig.title}
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="p-0">{popUpConfig.content}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default PopUp;
