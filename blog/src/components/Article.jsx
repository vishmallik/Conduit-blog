import React from "react";
import { Link, withRouter } from "react-router-dom";
import { articlesURL } from "../utils/urls";
import Loader from "./Loader";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

class Article extends React.Component {
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
            <ReactMarkdown
              children={article.body}
              remarkPlugins={[remarkGfm]}
            />
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
          {this.props.user ? (
            <AuthenticatedFooter user={this.props.user} />
          ) : (
            <UnAuthenticatedFooter />
          )}
        </div>
      </>
    );
  }
}

function AuthenticatedFooter(props) {
  return (
    <footer>
      <form action="" className="mx-auto w-1/2 font-0 my-4">
        <textarea
          name=""
          id=""
          rows="5"
          placeholder="Write a comment"
          className="w-full border-1 border-solid border-grey-200 rounded-t-md  mb-0 p-4 text-base focus:outline-0"
        ></textarea>
        <div className="border-1 border-solid border-grey-200 rounded-b-md mt-0 py-2 text-base flex justify-between items-center px-2 bg-gray-200">
          <img
            src={props.user.image}
            alt={props.user.username}
            className="w-8 h-8 rounded-full"
          />
          <input
            type="submit"
            value="Post Comment"
            className="bg-amber-500 text-white 
          px-2 py-1 rounded-md ml-auto mr-0 cursor-pointer"
          />
        </div>
      </form>
    </footer>
  );
}

function UnAuthenticatedFooter() {
  return (
    <footer>
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
    </footer>
  );
}

export default withRouter(Article);
