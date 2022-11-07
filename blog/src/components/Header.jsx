import { Link, NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className=" bg-amber-400">
      <div className="container-md flex justify-between items-center py-8 text-white">
        <Link to="/" className="text-4xl font-black">
          Conduit
        </Link>
        <nav>
          <ul className="flex text-lg">
            <li className="px-4 hover:text-orange-700">
              <NavLink to="/" exact activeClassName="active-link">
                Home
              </NavLink>
            </li>
            <li className="px-4 hover:text-orange-700">
              <NavLink to="/login" activeClassName="active-link">
                Sign In
              </NavLink>
            </li>
            <li className="pl-4 hover:text-orange-700">
              <NavLink to="/register" activeClassName="active-link">
                Sign Up
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
