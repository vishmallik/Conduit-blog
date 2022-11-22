import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Article from "./Article";
import Error from "./Error";
import Header from "./Header";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import { localStorageKey, verifyURL } from "../utils/urls";
import LoaderFull from "./Loader Full";
import NewPost from "./NewPost";
import Setting from "./Setting";
import Profile from "./Profile";
import Footer from "./Footer";
import { UserContext } from "../context/UserContext";

export default function App() {
  let [isLoggedIn, setIsLoggedIn] = useState(false);
  let [user, setUser] = useState(null);
  let [isVerifying, setIsVerifying] = useState(true);
  let [errors, setErrors] = useState("");

  function updateUser(user) {
    setIsLoggedIn(true);
    setUser(user);
    setIsVerifying(false);
    localStorage.setItem(localStorageKey, user.token);
  }
  function updateIsLoggedIn() {
    setIsLoggedIn(false);
  }

  useEffect(() => {
    let key = localStorage[localStorageKey];
    if (key) {
      fetch(verifyURL, {
        headers: { authorization: `Token ${key}` },
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then(({ errors }) => Promise.reject(errors));
          }
          return res.json();
        })
        .then(({ user }) => {
          updateUser(user);
        })
        .catch((error) => {
          setErrors("Can't Verify User");
        });
    } else {
      setIsVerifying(false);
    }
  }, []);

  if (isVerifying) {
    return <LoaderFull />;
  }
  return (
    <BrowserRouter>
      <UserContext.Provider value={{ isLoggedIn: isLoggedIn, user: user }}>
        <Header />
        {errors ? (
          <p className="min-h-screen py-8 text-center text-2xl text-red-500">
            {errors}
          </p>
        ) : isLoggedIn ? (
          <AuthenticatedApp
            updateUser={updateUser}
            updateIsLoggedIn={updateIsLoggedIn}
          />
        ) : (
          <UnAuthenticatedApp updateUser={updateUser} />
        )}
        <Footer />
      </UserContext.Provider>
    </BrowserRouter>
  );
}

function AuthenticatedApp(props) {
  return (
    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/editor">
        <NewPost />
      </Route>
      <Route path="/settings">
        <Setting
          updateUser={props.updateUser}
          updateIsLoggedIn={props.updateIsLoggedIn}
        />
      </Route>
      <Route path="/profile/@:username">
        <Profile />
      </Route>
      <Route path="/article/:slug" exact>
        <Article />
      </Route>
      <Route path="*">
        <Error />
      </Route>
    </Switch>
  );
}

function UnAuthenticatedApp(props) {
  return (
    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/article/:slug" exact>
        <Article />
      </Route>
      <Route path="/register">
        <Register updateUser={props.updateUser} />
      </Route>
      <Route path="/login">
        <Login updateUser={props.updateUser} />
      </Route>
      <Route path="*">
        <Error />
      </Route>
    </Switch>
  );
}
