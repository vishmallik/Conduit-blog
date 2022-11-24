import React, { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Error from "./Error";
import Header from "./Header";
import { localStorageKey, verifyURL } from "../utils/urls";
import LoaderFull from "./Loader Full";
import Footer from "./Footer";
import { UserContext } from "../context/UserContext";
const Home = React.lazy(() => import("./Home"));
const Article = React.lazy(() => import("./Article"));
const NewPost = React.lazy(() => import("./NewPost"));
const Setting = React.lazy(() => import("./Setting"));
const Profile = React.lazy(() => import("./Profile"));
const Login = React.lazy(() => import("./Login"));
const Register = React.lazy(() => import("./Register"));

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
        <Suspense fallback={<LoaderFull />}>
          <Header />
          {errors ? (
            <p className="min-h-screen py-8 text-center text-2xl text-red-500">
              {errors}
            </p>
          ) : isLoggedIn ? (
            <AuthenticatedApp
              updateUser={updateUser}
              setIsLoggedIn={setIsLoggedIn}
            />
          ) : (
            <UnAuthenticatedApp updateUser={updateUser} />
          )}
          <Footer />
        </Suspense>
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
          setIsLoggedIn={props.setIsLoggedIn}
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
