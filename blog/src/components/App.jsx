import React from "react";
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

export default class App extends React.Component {
  state = {
    isLoggedIn: false,
    user: null,
    isVerifying: true,
    errors: "",
  };
  updateUser = (user) => {
    this.setState({
      isLoggedIn: true,
      user,
      isVerifying: false,
    });
    localStorage.setItem(localStorageKey, user.token);
  };
  updateIsLoggedIn = () => {
    this.setState({
      isLoggedIn: false,
    });
  };

  componentDidMount = () => {
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
          this.updateUser(user);
        })
        .catch((error) => {
          this.setState({ errors: "Can't Verify User" });
        });
    } else {
      this.setState({ isVerifying: false });
    }
  };

  render() {
    if (this.state.isVerifying) {
      return <LoaderFull />;
    }
    return (
      <BrowserRouter>
        <UserContext.Provider
          value={{ isLoggedIn: this.state.isLoggedIn, user: this.state.user }}
        >
          <Header />
          {this.state.errors ? (
            <p className="min-h-screen py-8 text-center text-2xl text-red-500">
              {this.state.errors}
            </p>
          ) : this.state.isLoggedIn ? (
            <AuthenticatedApp
              updateUser={this.updateUser}
              updateIsLoggedIn={this.updateIsLoggedIn}
            />
          ) : (
            <UnAuthenticatedApp updateUser={this.updateUser} />
          )}
          <Footer />
        </UserContext.Provider>
      </BrowserRouter>
    );
  }
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
