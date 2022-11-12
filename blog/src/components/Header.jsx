import React from "react";
import { Link, NavLink } from "react-router-dom";

export default class Header extends React.Component {
  state = {
    menu: false,
  };
  handleMenuUpdate = () => {
    this.setState({
      menu: !this.state.menu,
    });
  };
  render() {
    let { menu } = this.state;
    return (
      <header className=" bg-amber-400">
        <div
          className="sm:container-md flex justify-between 
      items-center sm:py-8 py-4 text-white container-mobile mx-auto "
        >
          <Link to="/" className="text-4xl font-black">
            Conduit
          </Link>
          <nav>
            <i
              className={`fas fa-bars text-white hover:text-red-400 text-xl lg:hidden cursor-pointer ${
                menu ? "hidden" : ""
              }`}
              onClick={this.handleMenuUpdate}
            ></i>

            {this.props.isLoggedIn ? (
              <AuthHeader
                user={this.props.user}
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
      className={`sm:flex text-lg  ${
        props.menu
          ? "flex flex-col fixed top-0 left-0 right-0 text-center bottom-0 min-h-full bg-amber-400 text-2xl overflow-hidden pt-16 z-10"
          : "hidden"
      }`}
    >
      <i
        className={`fas fa-xmark sm:hidden cursor-pointer hover:text-red-400 text-white text-2xl z-20 absolute top-6 right-7 ${
          props.menu ? "inline-block" : "hidden"
        }`}
        onClick={props.handleMenuUpdate}
      ></i>
      <li
        className={`sm:px-4 hover:text-orange-700 ${props.menu ? "py-4" : ""}`}
        onClick={props.menu ? props.handleMenuUpdate : null}
      >
        <NavLink to="/" exact activeClassName="active-link">
          Home
        </NavLink>
      </li>
      <li
        className={`sm:px-4 hover:text-orange-700 ${props.menu ? "py-4" : ""}`}
        onClick={props.menu ? props.handleMenuUpdate : null}
      >
        <NavLink to="/login" activeClassName="active-link">
          Sign In
        </NavLink>
      </li>
      <li
        className={`sm:pl-4 hover:text-orange-700 ${props.menu ? "py-4" : ""}`}
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
  return (
    <ul
      className={`lg:flex text-lg  ${
        props.menu
          ? "flex flex-col fixed top-0 left-0 right-0 text-center bottom-0 min-h-full bg-amber-400 text-2xl overflow-hidden pt-16 z-10"
          : "hidden"
      }`}
    >
      <i
        className={`fas fa-xmark sm:hidden cursor-pointer hover:text-red-400 text-white text-xl z-20 absolute top-6 right-7 ${
          props.menu ? "inline-block" : "hidden"
        }`}
        onClick={props.handleMenuUpdate}
      ></i>
      <li
        className={`sm:px-4 hover:text-orange-700 ${props.menu ? "py-4" : ""}`}
        onClick={props.menu ? props.handleMenuUpdate : null}
      >
        <NavLink to="/" exact activeClassName="active-link">
          <i className="fas fa-home px-2"></i>
          Home
        </NavLink>
      </li>
      <li
        className={`sm:px-4 hover:text-orange-700 ${props.menu ? "py-4" : ""}`}
        onClick={props.menu ? props.handleMenuUpdate : null}
      >
        <NavLink to="/editor" activeClassName="active-link">
          <i className="fas fa-pen-to-square  px-2"></i>
          New Post
        </NavLink>
      </li>
      <li
        className={`sm:pl-4 hover:text-orange-700 ${props.menu ? "py-4" : ""}`}
        onClick={props.menu ? props.handleMenuUpdate : null}
      >
        <NavLink to="/settings" activeClassName="active-link">
          <i className="fas fa-gear  px-2"></i>
          Settings
        </NavLink>
      </li>
      <li
        className={`sm:pl-4 hover:text-orange-700 ${props.menu ? "py-4" : ""}`}
        onClick={props.menu ? props.handleMenuUpdate : null}
      >
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
