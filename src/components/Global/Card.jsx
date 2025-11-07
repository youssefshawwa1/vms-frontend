import { useEffect, useState } from "react";

const Card = ({ data }) => {
  const [onlyOne, setOnlyOne] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (data.sections.length === 1) {
      setOnlyOne(true);
    }
    setReady(true);
  }, []);

  return (
    <>
      {ready && (
        // <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
        <div>
          <CardHeader label={data.label} description={data.description} />
          <div>
            {data.sections.map((section, index) =>
              section.type ? (
                <CardSection
                  key={index}
                  section={section}
                  type={section.type}
                  onlyOne={onlyOne}
                  row={section?.row}
                />
              ) : (
                <CardSection key={index} section={section} />
              )
            )}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <span className="text-xs text-gray-500 ">
                {data.lastItem.label} {data.lastItem.text}
              </span>
            </div>
          </div>
        </div>
        // </div>
      )}
    </>
  );
};

const CardHeader = ({ label, description }) => {
  return (
    <div className="border-b border-gray-500 pb-4 mb-4">
      <h2 className="text-2xl font-bold text-gray-800 text-left">{label}</h2>
      {description && <p className="text-gray-600 mt-2">{description}</p>}
    </div>
  );
};

const CardItem = ({ label, text, type }) => {
  const style = `grid grid-cols-1 gap-4 sm:flex items-center ${
    type ? "text-xs text-gray-700" : "text-gray-900"
  }`;

  const getDisplayValue = () => {
    if (text == null || text == "") return "N/A";
    if (typeof text === "string") {
      const date = new Date(text);
      if (!isNaN(date.getTime())) {
        return date.toLocaleString();
      }
    }
    return text.toString();
  };

  return (
    <div className="space-y-2">
      <div className={style}>
        <span className="font-medium ">{label}:</span>
        <span>{getDisplayValue()}</span>
      </div>
    </div>
  );
};
// import CardHeader from "./CardHeader";
// import CardItem from "./CardItem";
const CardSection = ({ section, type, onlyOne }) => {
  let style = "";
  if (type) {
    style =
      "grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm border-t border-gray-500 pt-4 mt-12 ";
  } else {
    style = `grid grid-cols-1 gap-4 text-sm ${
      !section.row && "sm:grid-cols-2"
    }`;
  }
  if (onlyOne) {
    style += "border-none ";
  }
  return (
    <div className="mb-8 grid">
      {!type && <CardSectionHeader title={section.label} />}
      <div className={style}>
        {section.items.map((item, index) =>
          item.type ? (
            <CardItem
              key={index}
              label={item.label}
              text={item.text}
              type={item.type}
            />
          ) : (
            <CardItem key={index} label={item.label} text={item.text} />
          )
        )}
      </div>
    </div>
  );
};
// grid grid-cols-1 md:grid-cols-2 gap-4 text-sm
const CardSectionHeader = ({ title }) => {
  return (
    <div className="border-b border-gray-200 pb-2 mb-4">
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
    </div>
  );
};
export { CardHeader, CardItem, CardSection, CardSectionHeader };
export default Card;
