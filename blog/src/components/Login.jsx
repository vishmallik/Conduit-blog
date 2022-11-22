import React, { useReducer } from "react";
import { Link, withRouter } from "react-router-dom";
import { loginURL } from "../utils/urls";
import validate from "../utils/validate";

function reducer(state, action) {
  switch (action.type) {
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
    case "error":
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
}
function Login(props) {
  let [state, dispatch] = useReducer(reducer, {
    email: "",
    password: "",
    error: "",
  });

  function handleChange(event) {
    let { name, value } = event.target;
    let error = { ...state.error };
    if (value) {
      error.empty = false;
    }
    validate(error, name, value);
    dispatch({ type: name, payload: value });
    dispatch({ type: "error", payload: error });
  }
  function handleSubmit(event) {
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
        props.updateUser(user);
        props.history.push("/");
      })
      .catch((errors) =>
        dispatch({
          type: "error",
          payload: { ...state.error, email: "Email/Password is Incorrect" },
        })
      );
  }

  let { password, email, empty } = state.error;
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
        onSubmit={handleSubmit}
      >
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

export default withRouter(Login);
