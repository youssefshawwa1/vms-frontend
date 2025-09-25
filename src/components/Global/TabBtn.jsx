const TabBtn = ({ activeTab, setActiveTab, btn }) => {
  return (
    <button
      className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
        activeTab === `${btn.name}`
          ? "border-main text-main"
          : "border-transparent text-main-500 hover:text-main"
      }`}
      onClick={() => setActiveTab(btn.name)}
    >
      {btn.title}
    </button>
  );
};
export default TabBtn;
