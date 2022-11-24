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
      <div className="sm:container-md container-mobile min-h-screen">
        <h1
          className="mt-6 text-center text-4xl
         font-semibold"
        >
          Sign Up
        </h1>
        <Link
          to="/login"
          className="block pt-2 pb-6 text-center 
          text-amber-400 hover:underline"
        >
          Have an account?
        </Link>
        <span className="block text-center text-sm text-red-500">
          {this.state.errors.server_res &&
            ("Email " + this.state.errors.server_res.email ||
              "Username " + this.state.errors.server_res.username)}
        </span>
        <form
          className="mx-auto flex w-full flex-col sm:w-1/2"
          onSubmit={this.handleSubmit}
        >
          <input
            type="text"
            name="username"
            className={`my-2 rounded-sm border-2
             border-solid border-slate-200 py-2 px-4 text-lg focus:outline-none 
             ${username && "rounded-sm border-red-500"}`}
            placeholder="Username"
            onChange={this.handleChange}
            value={this.state.username}
          />
          {username && (
            <span className="text-center text-sm text-red-600">{username}</span>
          )}
          <input
            type="email"
            name="email"
            className={`my-2 rounded-sm border-2
             border-solid border-slate-200 py-2 px-4 text-lg focus:outline-none 
             ${email && "rounded-sm border-red-500"}`}
            placeholder="Email"
            onChange={this.handleChange}
            value={this.state.email}
          />
          {email && (
            <span className="text-center text-sm text-red-600">{email}</span>
          )}
          <input
            type="password"
            name="password"
            className={`my-2 rounded-sm border-2
             border-solid border-slate-200 py-2 px-4 text-lg focus:outline-none 
             ${password && "rounded-sm border-red-500"}`}
            placeholder="Password"
            onChange={this.handleChange}
            value={this.state.password}
          />
          {password && (
            <span className="text-center text-sm text-red-600">{password}</span>
          )}
          <input
            type="submit"
            value="Sign Up"
            disabled={empty || username || password || email}
            className="my-4 rounded-md bg-amber-400 px-8
              py-2 text-lg text-white hover:cursor-pointer disabled:bg-gray-400
               sm:ml-auto sm:mr-0 "
          />
        </form>
      </div>
    );
  }
}
export default withRouter(Register);
