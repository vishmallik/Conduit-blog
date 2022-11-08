import React from "react";
import { tagsURL } from "../utils/urls";
import Loader from "./Loader";

export default class SideBar extends React.Component {
  state = {
    tags: null,
    error: "",
  };
  componentDidMount() {
    fetch(tagsURL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        this.setState({
          tags: data.tags,
        });
      })
      .catch((err) => {
        this.setState({ error: "Unable to fetch tags" });
      });
  }
  render() {
    let { tags, error } = this.state;
    if (error) {
      return <p>{error}</p>;
    }
    if (!tags) {
      return <Loader />;
    }
    return (
      <aside className="basis-1/4">
        <ul className="bg-red-300 m-6 p-2 rounded-md">
          <p className="p-2 text'lg">Popular Tags</p>
          {tags.map((tag) => {
            return tag ? (
              <li
                className="inline-block border-2 border-solid
                 border-red-400 px-2 m-1/2 text-xs rounded-lg 
                 cursor-pointer hover:bg-amber-300"
                key={tag}
                onClick={() => this.props.updateActiveTab(tag)}
              >
                {tag}
              </li>
            ) : (
              ""
            );
          })}
        </ul>
      </aside>
    );
  }
}
