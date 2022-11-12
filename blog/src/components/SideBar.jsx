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
        this.setState({ error: "Unable to fetch tags!!!" });
      });
  }
  render() {
    let { tags, error } = this.state;
    if (error) {
      return (
        <p className="text-red-500 text-center mx-auto text-2xl py-8">
          {error}
        </p>
      );
    }
    if (!tags) {
      return <Loader />;
    }
    return (
      <aside className="xl:basis-1/4 basis-full">
        <ul className="bg-teal-100 m-6 p-2 rounded-md">
          <p className="p-2 text'lg">Popular Tags</p>
          {tags.map((tag) => {
            return tag ? (
              <li
                className="inline-block border-2 border-solid
                 border-violet-400 px-2 m-1/2 text-xs rounded-lg 
                 cursor-pointer  hover:bg-violet-400"
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
