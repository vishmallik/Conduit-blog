import React from "react";
import { Link } from "react-router-dom";

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      errors: {
        username: "",
        email: "",
        password: "",
        empty: true,
      },
    };
  }
  handleChange = (event) => {
    let { name, value } = event.target;
    let errors = { ...this.state.errors };
    if (!value) {
      errors.empty = true;
    }
    switch (name) {
      case "username":
        errors.username =
          value.length < 6 && "Username should be at-least 6 characters long";
        break;
      case "password":
        errors.password =
          !this.passwordCheck(value) &&
          "Password should be at-least 6 characters long and must contain a letter and a number";
        break;
      case "email":
        errors.email =
          !this.isEmail(value) && "Please enter a valid email address";
        break;
      default:
        break;
    }
    this.setState({
      [name]: value,
      errors,
    });
  };
  isEmail = (email) => {
    // eslint-disable-next-line no-control-regex, no-useless-escape
    return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(
      email
    );
  };
  passwordCheck = (password) => {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
  };
  render() {
    let { username, password, email, empty } = this.state.errors;
    return (
      <>
        <h1 className="text-center text-4xl font-semibold mt-6">Sign Up</h1>
        <Link
          to="/login"
          className="text-amber-400 text-center block pt-2 pb-6 hover:underline"
        >
          Have an account?
        </Link>
        <form
          action="/users"
          method="POST"
          className="flex flex-col w-1/3 mx-auto"
        >
          <input
            type="text"
            name="username"
            className={`border-2 border-solid border-slate-200 py-2 px-4 text-lg my-2 rounded-sm focus:outline-none ${
              username && "border-red-500 rounded-sm"
            }`}
            placeholder="Username"
            onChange={this.handleChange}
            value={this.state.username}
          />
          {username && (
            <span className="text-red-600 text-center text-sm">{username}</span>
          )}
          <input
            type="email"
            name="email"
            className={`border-2 border-solid border-slate-200 py-2 px-4 text-lg my-2 rounded-sm focus:outline-none ${
              email && "border-red-500 rounded-sm"
            }`}
            placeholder="Email"
            onChange={this.handleChange}
            value={this.state.email}
          />
          {email && (
            <span className="text-red-600 text-center text-sm">{email}</span>
          )}
          <input
            type="password"
            name="password"
            className={`border-2 border-solid border-slate-200 py-2 px-4 text-lg my-2 rounded-sm focus:outline-none ${
              password && "border-red-500 rounded-sm"
            }`}
            placeholder="Password"
            onChange={this.handleChange}
            value={this.state.password}
          />
          {password && (
            <span className="text-red-600 text-center text-sm">{password}</span>
          )}
          <input
            type="submit"
            value="Sign Up"
            disabled={empty || username || password || email}
            className="bg-amber-400 px-4 py-2 rounded-md  w-1/4 ml-auto mr-0 my-4 text-lg text-white hover:cursor-pointer"
          />
          {console.log(Boolean(empty && username && password && email))}
        </form>
      </>
    );
  }
}
