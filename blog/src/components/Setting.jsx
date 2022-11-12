import React from "react";
import { withRouter } from "react-router";
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
    },
  };
  componentDidMount() {
    this.setState({
      email: this.props.user.email || "",
      username: this.props.user.username || "",
      image: this.props.user.image || "",
      bio: this.props.user.bio || "",
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
        authorization: `Token ${this.props.user.token}`,
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
        // this.props.history.push("/");
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
  handleLogout = () => {
    this.props.updateIsLoggedIn();
    localStorage.clear();
    this.props.history.push("/login");
  };
  render() {
    let { image, username, bio, email, password, errors } = this.state;
    return (
      <div className="sm:container-md sm:w-1/2 container-mobile w-full">
        <form action="" className="my-4 flex flex-col" onSubmit={this.onSubmit}>
          <label htmlFor="" className="text-3xl py-2 font-bold mx-auto">
            Your Settings
          </label>
          <input
            type="text"
            name="image"
            placeholder="URL of profile picture"
            className=" px-6 py-2 my-2 rounded-md border-1 border-solid border-slate-400  focus:outline-blue-300"
            value={image}
            onChange={this.onChange}
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            className=" px-6 py-2 my-2 rounded-md border-1 border-solid border-slate-400 focus:outline-blue-300"
            value={username}
            onChange={this.onChange}
          />
          <textarea
            type="text"
            name="bio"
            placeholder="Short Bio about you"
            rows="10"
            className=" px-6 py-2 my-2 rounded-md border-1 border-solid border-slate-400 focus:outline-blue-300"
            value={bio}
            onChange={this.onChange}
          ></textarea>
          <input
            type="text"
            name="email"
            placeholder="Email"
            className=" px-6 py-2 my-2 rounded-md border-1 border-solid border-slate-400 focus:outline-blue-300"
            value={email}
            onChange={this.onChange}
          />

          <span className="text-red-600 text-center text-sm">
            {errors.email}
          </span>

          <input
            type="password"
            name="password"
            placeholder="New Password"
            className=" px-6 py-2 my-2 rounded-md border-1 border-solid border-slate-400 focus:outline-blue-300"
            value={password}
            onChange={this.onChange}
          />
          <input
            type="submit"
            value="Update Settings"
            className="bg-amber-500 sm:mr-0 sm:ml-auto px-6 py-2 mt-4 text-white
        rounded-md text-lg cursor-pointer sm:inline-block block "
          />
        </form>
        <hr />
        <button
          className="text-red-500 border-1 border-solid border-red-500 py-2 px-4 rounded-lg my-4 hover:bg-red-500 hover:text-white sm:inline-block block sm:w-auto w-full"
          onClick={this.handleLogout}
        >
          or click here to Logout
        </button>
      </div>
    );
  }
}

export default withRouter(Setting);
