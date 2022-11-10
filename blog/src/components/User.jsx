import React from "react";
import { profileURL } from "../utils/urls";
import Loader from "./Loader";

class User extends React.Component {
  state = {
    profile: "",
    errors: "",
  };
  componentDidMount() {
    fetch(profileURL + `/${this.props.match.params.username}`, {
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
  }
  render() {
    let { following, image, username, bio } = this.state.profile;
    if (!this.state.profile) {
      return <Loader />;
    }
    return (
      <>
        <div className="bg-gray-100 py-2">
          <div className="container-md text-center w-1/2">
            <img
              src={image}
              alt={username}
              className="rounded-full w-28 h-28 mx-auto my-4"
            />
            <h2 className="text-2xl font-bold">{username}</h2>
            <p className="text-gray-400">{bio}</p>
            <button className="px-2 border-1 border-solid border-gray-500 text-gray-500 rounded-md my-2 ml-auto mr-0  block hover:bg-amber-300 hover:text-white">{`+ Follow ${username}`}</button>
          </div>
        </div>
      </>
    );
  }
}
export default User;
