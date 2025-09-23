import { Link } from "react-router-dom";

const LinkBtn = (props) => {
  const style =
    "bg-yellow-200 w-70  h-full p-4 text-blue-900 rounded-lg hover:bg-yellow-300 focus:bg-yellow-400 transition-color duration-200 ease-linear font-bold shadow-xl";
  return (
    <>
      {props.to ? (
        <Link className={style} to={`${props.to}`}>
          {props.text}
        </Link>
      ) : (
        <Link className={style}>{props.text}</Link>
      )}
    </>
  );
};
export default LinkBtn;
