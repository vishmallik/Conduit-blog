import React from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { articlesURL, profileURL } from "../utils/urls";
import Loader from "./Loader";
import Posts from "./Posts";

class Profile extends React.Component {
  state = {
    activeTab: "author",
    articles: [],
    errors: "",
  };
  updateActiveTab = (tab) => {
    this.setState(
      {
        activeTab: tab,
      },
      () => this.fetchData()
    );
  };
  componentDidUpdate(prevProps) {
    if (prevProps.match.params.username !== this.props.match.params.username) {
      this.fetchData();
    }
  }
  componentDidMount() {
    this.fetchData();
  }
  fetchData = () => {
    fetch(
      articlesURL +
        `?${this.state.activeTab}=${this.props.match.params.username}`
    )
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => Promise.reject(errors));
        }
        return res.json();
      })
      .then(({ articles }) => {
        this.setState({ articles });
      })
      .catch((errors) =>
        this.setState({ errors: "Unable to fetch Article!!!" })
      );
  };
  render() {
    return (
      <>
        <ProfileData
          username={this.props.match.params.username}
          user={this.props.user}
          handleFollow={this.props.handleFollow}
        />

        <div className="sm:container-md container-mobile my-4 min-h-screen sm:my-10 sm:text-left">
          <span
            className={`mr-2 px-1 hover:cursor-pointer  ${
              this.state.activeTab === "author" &&
              "border-b-2 border-solid border-amber-500 text-amber-500"
            }`}
            onClick={() => this.updateActiveTab("author")}
          >
            My Articles
          </span>
          <span
            className={`mr-2 px-1 hover:cursor-pointer ${
              this.state.activeTab === "favorited" &&
              "border-b-2 border-solid border-amber-500 text-amber-500"
            }`}
            onClick={() => this.updateActiveTab("favorited")}
          >
            Favorited Articles
          </span>
          {this.state.errors ? (
            <p className="min-h-screen py-8 text-center text-2xl text-red-500">
              {this.state.errors}
            </p>
          ) : (
            <div>
              <Posts
                articles={this.state.articles}
                handleFavorite={this.props.handleFavorite}
                isLoggedIn={this.props.isLoggedIn}
              />
            </div>
          )}
        </div>
      </>
    );
  }
}

class ProfileData extends React.Component {
  state = {
    profile: "",
    errors: "",
  };
  componentDidMount() {
    this.fetchData();
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.username !== prevProps.username) {
      this.fetchData();
    }
  }
  fetchData = () => {
    fetch(profileURL + `/${this.props.username}`, {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => Promise.reject(errors));
        }
        return res.json();
      })
      .then(({ profile }) => this.setState({ profile }))
      .catch((errors) => {
        this.setState({ errors: "Unable to fetch Profile" });
      });
  };
  render() {
    let { image, username, bio } = this.state.profile;
    if (this.state.errors) {
      return (
        <p className="min-h-screen py-8 text-center text-2xl text-red-500">
          {this.state.errors}
        </p>
      );
    }
    if (!this.state.profile) {
      return <Loader />;
    }
    return (
      <div className="bg-gray-100 py-2">
        <div className="container-md w-1/2 text-center">
          <img
            src={image || "/images/smiley-cyrus.jpg"}
            alt={username}
            className="mx-auto my-4 h-28 w-28 rounded-full"
          />
          <h2 className="text-2xl font-bold">{username}</h2>
          <p className="text-gray-400">{bio}</p>
          {username === this.props.user.username ? (
            <SettingsButton />
          ) : (
            <FollowButton
              username={username}
              handleFollow={this.props.handleFollow}
            />
          )}
        </div>
      </div>
    );
  }
}
function SettingsButton(props) {
  return (
    <button
      className="border-1 my-2 rounded-md
   border-solid border-gray-500 px-2
    text-gray-500 hover:bg-amber-300 hover:text-white  sm:ml-auto
     sm:mr-0 sm:block"
    >
      {" "}
      <Link to="/settings">
        <i className="fas fa-gear p-2"></i>Edit Profile Settings
      </Link>
    </button>
  );
}
function FollowButton(props) {
  return (
    <button
      className="border-1 my-2 rounded-md
             border-solid border-gray-500 px-2
              text-gray-500 hover:bg-amber-300 hover:text-white sm:ml-auto
               sm:mr-0 sm:block"
      onClick={() => props.handleFollow("POST", props.username)}
    >
      {`+ Follow ${props.username}`}
    </button>
  );
}
export default withRouter(Profile);
