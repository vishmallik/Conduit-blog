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
import Footer from "./Footer";
import { UserContext } from "../context/UserContext";

export default class App extends React.Component {
  state = {
    isLoggedIn: false,
    user: null,
    isVerifying: true,
    errors: "",
    articles: null,
    error: "",
    articlesPerPage: 10,
    articlesCount: 0,
    currentPageIndex: 1,
    activeTab: "",
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
      .catch((errors) =>
        this.setState({ errors: "Unable to complete follow request" })
      );
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
        return this.fetchData();
      })
      .catch((errors) =>
        this.setState({ errors: "Unable to complete favorite request" })
      );
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
          this.setState({
            activeTab: "Your Feed",
          });
        })
        .catch((error) => {
          this.setState({ errors: "Can't Verify User" });
        });
    } else {
      this.setState({ isVerifying: false });
    }
  };
  fetchData = () => {
    let limit = this.state.articlesPerPage;
    let offset = (this.state.currentPageIndex - 1) * limit;
    let tag = this.state.activeTab;

    fetch(
      articlesURL +
        (this.state.activeTab === "Your Feed" ? "/feed" : "") +
        `?limit=${limit}&offset=${offset}` +
        (tag && `&tag=${tag}`),
      {
        headers: this.state.isLoggedIn
          ? {
              Authorization: `Token ${this.state.user.token}`,
            }
          : {},
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        this.setState({
          articles: data.articles,
          articlesCount: data.articlesCount,
        });
      })
      .catch((err) => {
        this.setState({ error: "Unable to fetch data!!!" });
      });
  };
  updatePageIndex = (index) => {
    this.setState({
      currentPageIndex: index,
    });
  };
  updateActiveTab = (tag) => {
    this.setState({
      activeTab: tag,
    });
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
              handleFollow={this.handleFollow}
              handleFavorite={this.handleFavorite}
              articles={this.state.articles}
              articlesPerPage={this.state.articlesPerPage}
              articlesCount={this.state.articlesCount}
              currentPageIndex={this.state.currentPageIndex}
              activeTab={this.state.activeTab}
              error={this.state.error}
              fetchData={this.fetchData}
              updateActiveTab={this.updateActiveTab}
              updatePageIndex={this.updatePageIndex}
            />
          ) : (
            <UnAuthenticatedApp
              updateUser={this.updateUser}
              articles={this.state.articles}
              articlesPerPage={this.state.articlesPerPage}
              articlesCount={this.state.articlesCount}
              currentPageIndex={this.state.currentPageIndex}
              activeTab={this.state.activeTab}
              error={this.state.error}
              fetchData={this.fetchData}
              updateActiveTab={this.updateActiveTab}
              updatePageIndex={this.updatePageIndex}
            />
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
        <Home
          handleFavorite={props.handleFavorite}
          articles={props.articles}
          articlesPerPage={props.articlesPerPage}
          articlesCount={props.articlesCount}
          currentPageIndex={props.currentPageIndex}
          activeTab={props.activeTab}
          error={props.error}
          fetchData={props.fetchData}
          updateActiveTab={props.updateActiveTab}
          updatePageIndex={props.updatePageIndex}
        />
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
        <Profile
          handleFavorite={props.handleFavorite}
          handleFollow={props.handleFollow}
        />
      </Route>
      <Route path="/article/:slug" exact>
        <Article
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
        <Home
          error={props.error}
          articles={props.articles}
          fetchData={props.fetchData}
          updateActiveTab={props.updateActiveTab}
          updatePageIndex={props.updatePageIndex}
          articlesPerPage={props.articlesPerPage}
          articlesCount={props.articlesCount}
          currentPageIndex={props.currentPageIndex}
          activeTab={props.activeTab}
        />
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
