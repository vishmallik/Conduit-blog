import React, { useContext, useReducer } from "react";
import { withRouter } from "react-router";
import { UserContext } from "../context/UserContext";
import { verifyURL } from "../utils/urls";
import validate from "../utils/validate";

function reducer(state, action) {
  switch (action.type) {
    case "image":
      return {
        ...state,
        image: action.payload,
      };
    case "username":
      return {
        ...state,
        username: action.payload,
      };
    case "bio":
      return {
        ...state,
        bio: action.payload,
      };
    case "email":
      return {
        ...state,
        email: action.payload,
      };
    case "password":
      return {
        ...state,
        password: action.payload,
      };
    case "success":
      return {
        ...state,
        success: action.payload,
      };
    case "errors":
      return {
        ...state,
        errors: action.payload,
      };
    default:
      return state;
  }
}

function Setting(props) {
  let { user } = useContext(UserContext);

  let [state, dispatch] = useReducer(reducer, {
    image: user.image || "",
    username: user.username || "",
    bio: user.bio || "",
    email: user.email || "",
    password: "",
    success: "",
    errors: "",
  });

  function onChange({ target }) {
    let { name, value } = target;
    let errors = { ...state.errors };
    validate(errors, name, value);
    dispatch({ type: name, payload: value });
    dispatch({ type: "errors", payload: errors });
  }
  function onSubmit(event) {
    event.preventDefault();
    let { image, username, bio, email, password } = state;
    let data = {
      user: {
        image,
        username,
        bio,
        email,
        password,
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
        authorization: `Token ${user.token}`,
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
        props.updateUser(user);
        dispatch({ type: "success", payload: "Data Updated Successfully!!!" });
      })
      .catch((errors) =>
        dispatch({
          type: "errors",
          payload: { ...state.errors, common: "Unable to update settings!!!" },
        })
      );
  }
  function handleLogout() {
    props.setIsLoggedIn(false);
    localStorage.clear();
    props.history.push("/login");
  }

  let { image, username, bio, email, password, errors, success } = state;
  return (
    <div className="sm:container-md container-mobile w-full sm:w-1/2">
      <form action="" className="my-4 flex flex-col" onSubmit={onSubmit}>
        <label htmlFor="" className="mx-auto py-2 text-3xl font-bold">
          Your Settings
        </label>
        {errors.common && (
          <p className="text-center font-bold text-red-500">{errors.common}</p>
        )}
        {success && (
          <p className="text-center font-bold text-green-500">{success}</p>
        )}
        <input
          type="text"
          name="image"
          placeholder="URL of profile picture"
          className=" border-1 my-2 rounded-md border-solid border-slate-400 px-6 py-2  focus:outline-blue-300"
          value={image}
          onChange={onChange}
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          className=" border-1 my-2 rounded-md border-solid border-slate-400 px-6 py-2 focus:outline-blue-300"
          value={username}
          onChange={onChange}
        />
        <textarea
          type="text"
          name="bio"
          placeholder="Short Bio about you"
          rows="10"
          className=" border-1 my-2 rounded-md border-solid border-slate-400 px-6 py-2 focus:outline-blue-300"
          value={bio}
          onChange={onChange}
        ></textarea>
        <input
          type="text"
          name="email"
          placeholder="Email"
          className=" border-1 my-2 rounded-md border-solid border-slate-400 px-6 py-2 focus:outline-blue-300"
          value={email}
          onChange={onChange}
        />

        <span className="text-center text-sm text-red-600">{errors.email}</span>

        <input
          type="password"
          name="password"
          placeholder="New Password"
          className=" border-1 my-2 rounded-md border-solid border-slate-400 px-6 py-2 focus:outline-blue-300"
          value={password}
          onChange={onChange}
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
        onClick={handleLogout}
      >
        or click here to Logout
      </button>
    </div>
  );
}

export default withRouter(Setting);
