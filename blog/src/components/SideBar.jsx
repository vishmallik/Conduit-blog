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
        <p className="mx-auto py-8 text-center text-2xl text-red-500">
          {error}
        </p>
      );
    }
    if (!tags) {
      return <Loader />;
    }
    return (
      <aside className="basis-full xl:basis-1/4">
        <ul className="m-6 rounded-md bg-teal-100 p-2">
          <p className="text'lg p-2">Popular Tags</p>
          {tags.map((tag) => {
            return (
              tag && (
                <li
                  className="m-1/2 inline-block cursor-pointer
                 rounded-lg border-2 border-solid border-violet-400 px-2 
                 text-xs  hover:bg-violet-400"
                  key={tag}
                  onClick={() => this.props.updateActiveTab(tag)}
                >
                  {tag}
                </li>
              )
            );
          })}
        </ul>
      </aside>
    );
  }
}
