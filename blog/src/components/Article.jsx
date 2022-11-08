import React from "react";
import { Link } from "react-router-dom";
import { articlesURL } from "../utils/urls";
import Loader from "./Loader";

export default class Article extends React.Component {
  state = {
    article: null,
    error: null,
  };
  componentDidMount() {
    let slug = this.props.match.params.slug;
    fetch(articlesURL + `/${slug}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        this.setState({
          article: data.article,
        });
      })
      .catch((err) => {
        this.setState({ error: "Unable to fetch article" });
      });
  }
  render() {
    let { article, error } = this.state;
    if (error) {
      return <p>{error}</p>;
    }
    if (!article) {
      return (
        <div className="w-3/4 mx-auto">
          <Loader />
        </div>
      );
    }
    return (
      <>
        <div className="bg-zinc-600">
          <div className="container-md py-10">
            <h2 className="text-white text-4xl font-semibold py-4 mb-4">
              {article.title}
            </h2>
            <div className="flex items-center">
              <Link to="/">
                <img
                  src={article.author.image || "/images/smiley-cyrus.jpg"}
                  alt={article.author.username}
                  className="w-10 h-10 rounded-full mr-4"
                />
              </Link>
              <div>
                <Link to="/">
                  <p className="text-amber-500 hover:underline">
                    {article.author.username}
                  </p>
                </Link>
                <p className="text-gray-400 text-xs">
                  {new Date(article.createdAt).toDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="container-md ">
          <p className="whitespace-pre-line text-lg text-justify py-6">
            {article.body}
          </p>
          <ul>
            {article.tagList.map((tag) => {
              return (
                <li
                  key={tag}
                  className="inline-block text-sm ml-2
                   rounded-full px-2 border-2 my-4 border-solid
                    border-yellow-300 bg-yellow-200"
                >
                  {tag}
                </li>
              );
            })}
          </ul>
          <hr className="my-4" />
          <p className="text-center my-4">
            <Link className="text-amber-500" to="/login">
              Sign in
            </Link>{" "}
            or
            <Link className="text-amber-500" to="/register">
              {" "}
              Sign Up
            </Link>{" "}
            to add comments to this article.
          </p>
        </div>
      </>
    );
  }
}
