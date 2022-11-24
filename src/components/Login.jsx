import React from "react";
import { Link, Redirect, withRouter } from "react-router-dom";
import { loginURL } from "../utils/urls";
import validate from "../utils/validate";

class Login extends React.Component {
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
  handleSubmit = (event) => {
    event.preventDefault();
    let { email, password } = event.target;
    let data = {
      user: {
        email: email.value,
        password: password.value,
      },
    };
    fetch(loginURL, {
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
      .catch((errors) =>
        this.setState((prevState) => {
          return {
            ...prevState,
            errors: {
              ...prevState.errors,
              email: "Email/Password is Incorrect",
            },
          };
        })
      );
  };
  redirect = () => {
    if (this.state.user.token) {
      return <Redirect to="/" />;
    }
  };
  render() {
    let { password, email, empty } = this.state.errors;
    return (
      <div className="sm:container-md container-mobile min-h-screen">
        <h1
          className="mt-6 text-center text-4xl 
        font-semibold"
        >
          Sign In
        </h1>
        <Link
          to="/register"
          className="block pt-2 pb-6 text-center 
          text-amber-400 hover:underline"
        >
          Need an account?
        </Link>
        <form
          className="mx-auto flex w-full flex-col sm:w-1/2"
          onSubmit={this.handleSubmit}
        >
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
            value="Sign In"
            disabled={empty || password || email}
            className="my-4 rounded-md bg-amber-400 px-8
            py-2 text-lg text-white hover:cursor-pointer disabled:bg-gray-400
             sm:ml-auto sm:mr-0"
          />
        </form>
      </div>
    );
  }
}
export default withRouter(Login);
