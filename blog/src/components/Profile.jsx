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
    // currentProfile: this.props.match.params.username,
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
      });
  };
  render() {
    console.log(this.props.match.params.username);
    return (
      <>
        <ProfileData
          username={this.props.match.params.username}
          user={this.props.user}
        />
        s
        <div className="container-md my-10">
          <span
            className={`px-1 mr-2 hover:cursor-pointer  ${
              this.state.activeTab === "author"
                ? "border-solid border-b-2 border-amber-500 text-amber-500"
                : ""
            }`}
            onClick={() => this.updateActiveTab("author")}
          >
            My Articles
          </span>
          <span
            className={`px-1 mr-2 hover:cursor-pointer ${
              this.state.activeTab === "favorited"
                ? "border-solid border-b-2 border-amber-500 text-amber-500"
                : ""
            }`}
            onClick={() => this.updateActiveTab("favorited")}
          >
            Favorited Articles
          </span>
          <div>
            <Posts articles={this.state.articles} />
          </div>
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
      .catch((errors) => this.setState({ errors }));
  };
  render() {
    let { image, username, bio } = this.state.profile;
    if (!this.state.profile) {
      return <Loader />;
    }
    return (
      <div className="bg-gray-100 py-2">
        <div className="container-md text-center w-1/2">
          <img
            src={image}
            alt={username}
            className="rounded-full w-28 h-28 mx-auto my-4"
          />
          <h2 className="text-2xl font-bold">{username}</h2>
          <p className="text-gray-400">{bio}</p>
          {username === this.props.user.username ? (
            <SettingsButton />
          ) : (
            <FollowButton username={username} />
          )}
        </div>
      </div>
    );
  }
}
function SettingsButton(props) {
  return (
    <button
      className="px-2 border-1 border-solid
   border-gray-500 text-gray-500 rounded-md
    my-2 ml-auto mr-0  block hover:bg-amber-300
     hover:text-white"
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
      className="px-2 py-2 border-1 border-solid
             border-gray-500 text-gray-500 rounded-md
              my-2 ml-auto mr-0  block hover:bg-amber-300
               hover:text-white"
    >
      {`+ Follow ${props.username}`}
    </button>
  );
}
export default withRouter(Profile);
