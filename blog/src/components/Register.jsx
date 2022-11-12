import React from "react";
import { Link, withRouter } from "react-router-dom";
import { registerURL } from "../utils/urls";
import validate from "../utils/validate";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      user: null,
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
    if (value) {
      errors.empty = false;
    }
    validate(errors, name, value);
    this.setState({
      [name]: value,
      errors,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    let { username, email, password } = event.target;
    let data = {
      user: {
        username: username.value,
        email: email.value,
        password: password.value,
      },
    };
    fetch(registerURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => Promise.reject(errors));
        }
        return res.json();
      })
      .then(({ user }) => {
        this.props.updateUser(user);
        this.props.history.push("/");
      })
      .catch((errors) => this.setState({ ...this.state.errors, errors }));
  };
  render() {
    let { username, password, email, empty } = this.state.errors;
    return (
      <div className="sm:container-md container-mobile">
        <h1
          className="text-center text-4xl font-semibold
         mt-6"
        >
          Sign Up
        </h1>
        <Link
          to="/login"
          className="text-amber-400 text-center block pt-2 
          pb-6 hover:underline"
        >
          Have an account?
        </Link>
        <span className="text-center block text-red-500 text-sm">
          {this.state.errors.server_res
            ? "Email " + this.state.errors.server_res.email ||
              "Username " + this.state.errors.server_res.username
            : ""}
        </span>
        <form
          className="flex flex-col sm:w-1/2 w-full mx-auto"
          onSubmit={this.handleSubmit}
        >
          <input
            type="text"
            name="username"
            className={`border-2 border-solid border-slate-200
             py-2 px-4 text-lg my-2 rounded-sm focus:outline-none 
             ${username && "border-red-500 rounded-sm"}`}
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
            value="Sign Up"
            disabled={empty || username || password || email}
            className="bg-amber-400 px-8 py-2 rounded-md
              sm:ml-auto sm:mr-0 my-4 text-lg text-white
               hover:cursor-pointer disabled:bg-gray-400 "
          />
        </form>
      </div>
    );
  }
}
export default withRouter(Register);
