import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Article from "./Article";
import Error from "./Error";
import Header from "./Header";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";

export default class App extends React.Component {
  state = {
    isLoggedIn: JSON.parse(localStorage.isLoggedIn) || false,
    user: JSON.parse(localStorage.user) || null,
  };
  updateUser = (user) => {
    this.setState({
      isLoggedIn: true,
      user,
    });
  };
  componentWillUnmount = () => {
    window.removeEventListener("beforeunload", this.handleUpdateLocalStorage);
  };
  componentDidMount = () => {
    window.addEventListener("beforeunload", this.handleUpdateLocalStorage);
  };
  handleUpdateLocalStorage = () => {
    localStorage.setItem("user", JSON.stringify(this.state.user));
    localStorage.setItem("isLoggedIn", JSON.stringify(this.state.isLoggedIn));
  };
  render() {
    return (
      <BrowserRouter>
        <Header isLoggedIn={this.state.isLoggedIn} user={this.state.user} />
        <Switch>
          <Route path="/" exact>
            <Home user={this.state.user} />
          </Route>
          <Route path="/article/:slug" exact component={Article} />
          <Route path="/register">
            <Register updateUser={this.updateUser} />
          </Route>
          <Route path="/login">
            <Login updateUser={this.updateUser} />
          </Route>
          <Route path="*">
            <Error />
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }
}
