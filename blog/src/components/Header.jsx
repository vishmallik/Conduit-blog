import { Link, NavLink } from "react-router-dom";

export default function Header(props) {
  return (
    <header className=" bg-amber-400">
      <div
        className="container-md flex justify-between 
      items-center py-8 text-white"
      >
        <Link to="/" className="text-4xl font-black">
          Conduit
        </Link>
        <nav>
          {props.isLoggedIn ? (
            <AuthHeader user={props.user} />
          ) : (
            <NoAuthHeader />
          )}
        </nav>
      </div>
    </header>
  );
}

function NoAuthHeader() {
  return (
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
  );
}
function AuthHeader(props) {
  return (
    <ul className="flex text-lg">
      <li className="px-4 hover:text-orange-700">
        <NavLink to="/" exact activeClassName="active-link">
          <i className="fas fa-home px-2"></i>
          Home
        </NavLink>
      </li>
      <li className="px-4 hover:text-orange-700">
        <NavLink to="/editor" activeClassName="active-link">
          <i className="fas fa-pen-to-square  px-2"></i>
          New Post
        </NavLink>
      </li>
      <li className="pl-4 hover:text-orange-700">
        <NavLink to="/settings" activeClassName="active-link">
          <i className="fas fa-gear  px-2"></i>
          Settings
        </NavLink>
      </li>
      <li className="pl-4 hover:text-orange-700">
        {console.log(props, "AuthHeader")}
        <NavLink
          to={`/profile/@${props.user.username}`}
          activeClassName="active-link"
        >
          <i className="fas fa-user px-2"></i>
          <p className="inline-block">{props.user.username}</p>
        </NavLink>
      </li>
    </ul>
  );
}
