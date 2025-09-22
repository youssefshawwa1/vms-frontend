const Loading = () => {
  return (
    <div className="overlay w-screen h-screen inset-0 flex fixed items-center justify-center z-50">
      <div className="pinner w-25 h-25 border-t-4 border-yellow-300 rounded-full animate-spin "></div>
    </div>
  );
};
export default Loading;
