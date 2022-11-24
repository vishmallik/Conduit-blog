import React, { useContext, useEffect, useState } from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { articlesURL, profileURL } from "../utils/urls";
import Loader from "./Loader";
import Posts from "./Posts";

function Profile(props) {
  let [activeTab, setActiveTab] = useState("author");
  let [articles, setArticles] = useState(null);
  let [errors, setErrors] = useState("");

  let { user } = useContext(UserContext);

  useEffect(() => {
    function fetchData() {
      fetch(articlesURL + `?${activeTab}=${props.match.params.username}`)
        .then((res) => {
          if (!res.ok) {
            return res.json().then(({ errors }) => Promise.reject(errors));
          }
          return res.json();
        })
        .then(({ articles }) => {
          setArticles(articles);
        })
        .catch((errors) => setErrors("Unable to fetch Article!!!"));
    }
    fetchData();
  }, [props.match.params.username, activeTab]);

  function handleFavorite(verb, slug) {
    fetch(articlesURL + `/${slug}/favorite`, {
      method: verb,
      headers: {
        authorization: `Token ${user.token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => Promise.reject(errors));
        }
      })
      .catch((errors) => setErrors("Unable to complete favorite request"));
  }

  return (
    <>
      <ProfileData username={props.match.params.username} />
      <div className="sm:container-md container-mobile my-4 min-h-screen sm:my-10 sm:text-left">
        <span
          className={`mr-2 px-1 hover:cursor-pointer ${
            activeTab === "author" &&
            "border-b-2 border-solid border-amber-500 text-amber-500"
          }`}
          onClick={() => setActiveTab("author")}
        >
          My Articles
        </span>
        <span
          className={`mr-2 px-1 hover:cursor-pointer ${
            activeTab === "favorited" &&
            "border-b-2 border-solid border-amber-500 text-amber-500"
          }`}
          onClick={() => setActiveTab("favorited")}
        >
          Favorited Articles
        </span>
        {errors ? (
          <p className="min-h-screen py-8 text-center text-2xl text-red-500">
            {errors}
          </p>
        ) : (
          <div>
            <Posts articles={articles} handleFavorite={handleFavorite} />
          </div>
        )}
      </div>
    </>
  );
}

function ProfileData(props) {
  let [profile, setProfile] = useState("");
  let [following, setFollowing] = useState(false);
  let [errors, setErrors] = useState("");
  let { user } = useContext(UserContext);

  function handleFollow(verb, username) {
    fetch(profileURL + `/${username}/follow`, {
      method: verb,
      headers: {
        authorization: `Token ${user.token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => Promise.reject(errors));
        }
        setFollowing(!following);
      })
      .catch((errors) => setErrors("Unable to complete follow request"));
  }

  useEffect(() => {
    function fetchData() {
      fetch(profileURL + `/${props.username}`, {
        method: "GET",
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then(({ errors }) => Promise.reject(errors));
          }
          return res.json();
        })
        .then(({ profile }) => setProfile(profile))
        .catch((errors) => {
          setErrors("Unable to fetch Profile");
        });
    }
    fetchData();
  }, [props.username]);

  let { image, username, bio } = profile;
  if (errors) {
    return (
      <p className="min-h-screen py-8 text-center text-2xl text-red-500">
        {errors}
      </p>
    );
  }
  if (!profile) {
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
        {username === user.username ? (
          <SettingsButton />
        ) : (
          <FollowButton
            username={username}
            handleFollow={handleFollow}
            following={following}
          />
        )}
      </div>
    </div>
  );
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
      className={`border-1
             my-2 rounded-md border-solid
              border-gray-500 px-2 text-gray-500 hover:bg-amber-300
               hover:text-white sm:ml-auto sm:mr-0
               sm:block`}
      onClick={
        props.following
          ? () => props.handleFollow("POST", props.username)
          : () => props.handleFollow("DELETE", props.username)
      }
    >
      {`${props.following ? "- Unfollow" : "+ Follow"} ${props.username}`}
    </button>
  );
}
export default withRouter(React.memo(Profile));
