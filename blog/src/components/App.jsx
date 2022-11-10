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

export default class App extends React.Component {
  state = {
    isLoggedIn: false,
    user: null,
    isVerifying: true,
  };
  updateUser = (user) => {
    this.setState({
      isLoggedIn: true,
      user,
      isVerifying: false,
    });
    localStorage.setItem(localStorageKey, user.token);
  };

  componentDidMount = () => {
    console.log("cdm.app");
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
        .then(({ user }) => this.updateUser(user))
        .catch((error) => {
          console.log(error);
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
        <Header isLoggedIn={this.state.isLoggedIn} user={this.state.user} />
        {this.state.isLoggedIn ? (
          <AuthenticatedApp
            isLoggedIn={this.state.isLoggedIn}
            user={this.state.user}
          />
        ) : (
          <UnAuthenticatedApp
            updateUser={this.updateUser}
            isLoggedIn={this.state.isLoggedIn}
          />
        )}
      </BrowserRouter>
    );
  }
}

function AuthenticatedApp(props) {
  return (
    <Switch>
      <Route path="/" exact>
        <Home isLoggedIn={props.isLoggedIn} user={props.user} />
      </Route>
      <Route path="/editor">
        <NewPost />
      </Route>
      <Route path="/settings" user={props.user}>
        <Setting />
      </Route>
      <Route path="/profile">
        <Profile />
      </Route>
      <Route path="/article/:slug" exact component={Article} />
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
        <Home user={props.isLoggedIn} />
      </Route>
      <Route path="/article/:slug" exact component={Article} />
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
