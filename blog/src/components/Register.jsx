import React, { useReducer } from "react";
import { Link, withRouter } from "react-router-dom";
import { registerURL } from "../utils/urls";
import validate from "../utils/validate";

function reducer(state, action) {
  switch (action.type) {
    case "username":
      return {
        ...state,
        username: action.payload,
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
    case "errors":
      return {
        ...state,
        errors: action.payload,
      };
    default:
      return state;
  }
}

function Register(props) {
  let [state, dispatch] = useReducer(reducer, {
    username: "",
    email: "",
    password: "",
    errors: "",
  });

  function handleChange(event) {
    let { name, value } = event.target;
    let errors = { ...state.errors };
    if (value) {
      errors.empty = false;
    }
    validate(errors, name, value);
    dispatch({ type: name, payload: value });
    dispatch({ type: "errors", payload: errors });
  }

  function handleSubmit(event) {
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
        props.updateUser(user);
        props.history.push("/");
      })
      .catch((errors) =>
        dispatch({
          type: "errors",
          payload: { errors },
        })
      );
  }

  let { username, password, email, empty } = state.errors;
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
        {state.errors.errors &&
          ((state.errors.errors.email &&
            "Email " + state.errors.errors.email) ||
            (state.errors.errors.username &&
              "Username " + state.errors.errors.username))}
      </span>
      <form
        className="mx-auto flex w-full flex-col sm:w-1/2"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="username"
          className={`my-2 rounded-sm border-2
             border-solid border-slate-200 py-2 px-4 text-lg focus:outline-none 
             ${username && "rounded-sm border-red-500"}`}
          placeholder="Username"
          onChange={handleChange}
          value={state.username}
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
          onChange={handleChange}
          value={state.email}
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
          onChange={handleChange}
          value={state.password}
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

export default withRouter(Register);
