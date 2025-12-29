import TabBtn from "./TabBtn";
const TabBtns = ({ btns, activeTab, setActiveTab }) => {
  return (
    <>
      {btns.map((btn, index) =>
        btn.hide ? (
          activeTab === btn.name && (
            <TabBtn
              btn={btn}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              key={index}
            />
          )
        ) : (
          <TabBtn
            btn={btn}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            key={index}
          />
        )
      )}
    </>
  );
};
export default TabBtns;
