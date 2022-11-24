import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default class Header extends React.Component {
  state = {
    menu: false,
  };
  static contextType = UserContext;
  handleMenuUpdate = () => {
    this.setState({
      menu: !this.state.menu,
    });
  };
  render() {
    let { menu } = this.state;
    return (
      <header className="bg-amber-400">
        <div
          className="sm:container-md container-mobile mx-auto 
      flex items-center justify-between py-4 text-white sm:py-8 "
        >
          <Link to="/" className="text-4xl font-black">
            Conduit
          </Link>
          <nav>
            <i
              className={`fas fa-bars cursor-pointer text-xl text-white hover:text-red-400 lg:hidden ${
                menu && "hidden"
              }`}
              onClick={this.handleMenuUpdate}
            ></i>

            {this.context.isLoggedIn ? (
              <AuthHeader
                handleMenuUpdate={this.handleMenuUpdate}
                menu={menu}
              />
            ) : (
              <NoAuthHeader
                handleMenuUpdate={this.handleMenuUpdate}
                menu={menu}
              />
            )}
          </nav>
        </div>
      </header>
    );
  }
}

function NoAuthHeader(props) {
  return (
    <ul
      className={`text-lg sm:flex  ${
        props.menu
          ? "fixed top-0 left-0 right-0 bottom-0 z-10 flex min-h-full flex-col overflow-hidden bg-amber-400 pt-16 text-center text-2xl"
          : "hidden"
      }`}
    >
      <i
        className={`fas fa-xmark absolute top-6 right-7 z-20 cursor-pointer text-2xl text-white hover:text-red-400 sm:hidden ${
          props.menu ? "inline-block" : "hidden"
        }`}
        onClick={props.handleMenuUpdate}
      ></i>
      <li
        className={`hover:text-orange-700 sm:px-4 ${props.menu && "py-4"}`}
        onClick={props.menu ? props.handleMenuUpdate : null}
      >
        <NavLink to="/" exact activeClassName="active-link">
          Home
        </NavLink>
      </li>
      <li
        className={`hover:text-orange-700 sm:px-4 ${props.menu && "py-4"}`}
        onClick={props.menu ? props.handleMenuUpdate : null}
      >
        <NavLink to="/login" activeClassName="active-link">
          Sign In
        </NavLink>
      </li>
      <li
        className={`hover:text-orange-700 sm:pl-4 ${props.menu && "py-4"}`}
        onClick={props.menu ? props.handleMenuUpdate : null}
      >
        <NavLink to="/register" activeClassName="active-link">
          Sign Up
        </NavLink>
      </li>
    </ul>
  );
}
function AuthHeader(props) {
  let { user } = useContext(UserContext);
  return (
    <ul
      className={`text-lg lg:flex  ${
        props.menu
          ? "fixed top-0 left-0 right-0 bottom-0 z-10 flex min-h-full flex-col overflow-hidden bg-amber-400 pt-16 text-center text-2xl"
          : "hidden"
      }`}
    >
      <i
        className={`fas fa-xmark absolute top-6 right-7 z-20 cursor-pointer text-xl text-white hover:text-red-400 sm:hidden ${
          props.menu ? "inline-block" : "hidden"
        }`}
        onClick={props.handleMenuUpdate}
      ></i>
      <li
        className={`hover:text-orange-700 sm:px-4 ${props.menu && "py-4"}`}
        onClick={props.menu ? props.handleMenuUpdate : null}
      >
        <NavLink to="/" exact activeClassName="active-link">
          <i className="fas fa-home px-2"></i>
          Home
        </NavLink>
      </li>
      <li
        className={`hover:text-orange-700 sm:px-4 ${props.menu && "py-4"}`}
        onClick={props.menu ? props.handleMenuUpdate : null}
      >
        <NavLink to="/editor" activeClassName="active-link">
          <i className="fas fa-pen-to-square  px-2"></i>
          New Post
        </NavLink>
      </li>
      <li
        className={`hover:text-orange-700 sm:pl-4 ${props.menu && "py-4"}`}
        onClick={props.menu ? props.handleMenuUpdate : null}
      >
        <NavLink to="/settings" activeClassName="active-link">
          <i className="fas fa-gear  px-2"></i>
          Settings
        </NavLink>
      </li>
      <li
        className={`hover:text-orange-700 sm:pl-4 ${props.menu && "py-4"}`}
        onClick={props.menu ? props.handleMenuUpdate : null}
      >
        <NavLink
          to={`/profile/@${user.username}`}
          activeClassName="active-link"
        >
          <i className="fas fa-user px-2"></i>
          <p className="inline-block">{user.username}</p>
        </NavLink>
      </li>
    </ul>
  );
}
