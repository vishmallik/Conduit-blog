import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Article from "./Article";
import Error from "./Error";
import Header from "./Header";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import {
  articlesURL,
  localStorageKey,
  profileURL,
  verifyURL,
} from "../utils/urls";
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
  updateIsLoggedIn = () => {
    this.setState({
      isLoggedIn: false,
    });
  };
  handleFollow = (verb, username) => {
    fetch(profileURL + `/${username}/follow`, {
      method: verb,
      headers: {
        authorization: `Token ${this.state.user.token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => Promise.reject(errors));
        }
        return res.json();
      })
      .then(({ profile }) => console.log(profile));
  };
  handleFavorite = (verb, slug) => {
    fetch(articlesURL + `/${slug}/favorite`, {
      method: verb,
      headers: {
        authorization: `Token ${this.state.user.token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => Promise.reject(errors));
        }
        return res.json();
      })
      .then(({ article }) => console.log(article));
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
            updateUser={this.updateUser}
            updateIsLoggedIn={this.updateIsLoggedIn}
            handleFollow={this.handleFollow}
            handleFavorite={this.handleFavorite}
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
        <Home
          isLoggedIn={props.isLoggedIn}
          user={props.user}
          handleFavorite={props.handleFavorite}
        />
      </Route>
      <Route path="/editor">
        <NewPost user={props.user} />
      </Route>
      <Route path="/settings">
        <Setting
          user={props.user}
          updateUser={props.updateUser}
          updateIsLoggedIn={props.updateIsLoggedIn}
        />
      </Route>
      <Route path="/profile/@:username">
        <Profile user={props.user} handleFollow={props.handleFollow} />
      </Route>
      <Route path="/article/:slug" exact>
        <Article
          user={props.user}
          isLoggedIn={props.isLoggedIn}
          handleFollow={props.handleFollow}
          handleFavorite={props.handleFavorite}
        />
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
        <Home user={props.isLoggedIn} />
      </Route>
      <Route path="/article/:slug" exact>
        <Article user={props.user} />
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
