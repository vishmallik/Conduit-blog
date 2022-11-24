import React from "react";
import { withRouter } from "react-router";
import { UserContext } from "../context/UserContext";
import { verifyURL } from "../utils/urls";
import validate from "../utils/validate";

class Setting extends React.Component {
  state = {
    image: "",
    username: "",
    bio: "",
    email: "",
    password: "",
    errors: {
      image: "",
      username: "",
      bio: "",
      email: "",
      password: "",
      common: "",
    },
    success: "",
  };
  static contextType = UserContext;
  componentDidMount() {
    this.setState({
      email: this.context.user.email || "",
      username: this.context.user.username || "",
      image: this.context.user.image || "",
      bio: this.context.user.bio || "",
    });
  }
  onChange = ({ target }) => {
    let { name, value } = target;
    let errors = { ...this.state.errors };
    validate(errors, name, value);
    this.setState({
      [name]: value,
      errors,
    });
  };
  onSubmit = (event) => {
    event.preventDefault();

    let { image, username, bio, email, password } = this.state;
    let data = {
      user: {
        image: image,
        username: username,
        bio: bio,
        email: email,
        password: password,
      },
    };

    Object.keys(data.user).forEach((key) => {
      if (data.user[key] === "") {
        delete data.user[key];
      }
    });

    fetch(verifyURL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Token ${this.context.user.token}`,
      },
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
        this.setState((prevState) => {
          return { ...prevState, success: "Data Updated Successfully!!!" };
        });
      })
      .catch((errors) =>
        this.setState((prevState) => {
          return {
            ...prevState,
            errors: {
              ...prevState.errors,
              common: "Unable to update settings!!!",
            },
          };
        })
      );
  };
  handleLogout = () => {
    this.props.updateIsLoggedIn();
    localStorage.clear();
    this.props.history.push("/login");
  };
  render() {
    let { image, username, bio, email, password, errors } = this.state;
    return (
      <div className="sm:container-md container-mobile w-full sm:w-1/2">
        <form action="" className="my-4 flex flex-col" onSubmit={this.onSubmit}>
          <label htmlFor="" className="mx-auto py-2 text-3xl font-bold">
            Your Settings
          </label>
          {this.state.errors.common && (
            <p className="text-center font-bold text-red-500">
              {this.state.errors.common}
            </p>
          )}
          {this.state.success && (
            <p className="text-center font-bold text-green-500">
              {this.state.success}
            </p>
          )}
          <input
            type="text"
            name="image"
            placeholder="URL of profile picture"
            className=" border-1 my-2 rounded-md border-solid border-slate-400 px-6 py-2  focus:outline-blue-300"
            value={image}
            onChange={this.onChange}
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            className=" border-1 my-2 rounded-md border-solid border-slate-400 px-6 py-2 focus:outline-blue-300"
            value={username}
            onChange={this.onChange}
          />
          <textarea
            type="text"
            name="bio"
            placeholder="Short Bio about you"
            rows="10"
            className=" border-1 my-2 rounded-md border-solid border-slate-400 px-6 py-2 focus:outline-blue-300"
            value={bio}
            onChange={this.onChange}
          ></textarea>
          <input
            type="text"
            name="email"
            placeholder="Email"
            className=" border-1 my-2 rounded-md border-solid border-slate-400 px-6 py-2 focus:outline-blue-300"
            value={email}
            onChange={this.onChange}
          />

          <span className="text-center text-sm text-red-600">
            {errors.email}
          </span>

          <input
            type="password"
            name="password"
            placeholder="New Password"
            className=" border-1 my-2 rounded-md border-solid border-slate-400 px-6 py-2 focus:outline-blue-300"
            value={password}
            onChange={this.onChange}
          />
          <input
            type="submit"
            value="Update Settings"
            className="mt-4 block cursor-pointer rounded-md bg-amber-500 px-6 py-2 text-lg text-white sm:mr-0 sm:ml-auto sm:inline-block "
          />
        </form>
        <hr />
        <button
          className="border-1 my-4 block w-full rounded-lg border-solid border-red-500 py-2 px-4 text-red-500 hover:bg-red-500 hover:text-white sm:inline-block sm:w-auto"
          onClick={this.handleLogout}
        >
          or click here to Logout
        </button>
      </div>
    );
  }
}

export default withRouter(Setting);
