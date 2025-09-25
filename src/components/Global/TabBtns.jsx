import TabBtn from "./TabBtn";
const TabBtns = ({ btns, activeTab, setActiveTab }) => {
  return (
    <>
      {btns.map((btn, index) => (
        <TabBtn
          btn={btn}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          key={index}
        />
      ))}
    </>
  );
};
export default TabBtns;
