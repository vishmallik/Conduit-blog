import React from "react";
import { Link } from "react-router-dom";
import validate from "../utils/validate";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: {
        email: "",
        password: "",
        empty: true,
      },
    };
  }
  handleChange = (event) => {
    let { name, value } = event.target;
    let errors = { ...this.state.errors };
    if (value) {
      errors.empty = false;
    }
    validate(errors, name, value);
    this.setState({
      [name]: value,
      errors,
    });
  };
  render() {
    let { password, email, empty } = this.state.errors;
    return (
      <>
        <h1
          className="text-center text-4xl font-semibold 
        mt-6"
        >
          Sign In
        </h1>
        <Link
          to="/register"
          className="text-amber-400 text-center block pt-2 
          pb-6 hover:underline"
        >
          Need an account?
        </Link>
        <form
          action="/users/login"
          method="POST"
          className="flex flex-col w-1/3 mx-auto"
        >
          <input
            type="email"
            name="email"
            className={`border-2 border-solid border-slate-200
             py-2 px-4 text-lg my-2 rounded-sm focus:outline-none 
             ${email && "border-red-500 rounded-sm"}`}
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
            className={`border-2 border-solid border-slate-200
             py-2 px-4 text-lg my-2 rounded-sm focus:outline-none 
             ${password && "border-red-500 rounded-sm"}`}
            placeholder="Password"
            onChange={this.handleChange}
            value={this.state.password}
          />
          {password && (
            <span className="text-red-600 text-center text-sm">{password}</span>
          )}
          <input
            type="submit"
            value="Sign In"
            disabled={empty || password || email}
            className="bg-amber-400 px-4 py-2 rounded-md 
            w-1/4 ml-auto mr-0 my-4 text-lg text-white 
            hover:cursor-pointer disabled:bg-gray-400"
          />
        </form>
      </>
    );
  }
}
