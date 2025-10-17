import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="">
      <nav className="navigation text-center bg-yellow-100">
        <Link className="p-4" to="/">
          Home
        </Link>
        <Link className="p-4" to="/volunteers">
          About
        </Link>
        <Link className="p-4" to="/teams">
          Contact
        </Link>
      </nav>
    </header>
  );
};
export default Header;
