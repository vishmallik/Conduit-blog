import React from "react";
import { Link, withRouter } from "react-router-dom";
import { articlesURL } from "../utils/urls";
import Loader from "./Loader";
import Comments from "./Comments";

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
  handleDelete = () => {
    fetch(articlesURL + `/${this.state.article.slug}`, {
      method: "DELETE",
      headers: {
        authorization: `Token ${this.props.user.token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
      })

      .catch((err) => {
        this.setState({ error: "Unable to delete article" });
      });
  };
  handleEdit = () => {
    //WIP
  };

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
              {article.author.username === this.props.user.username ? (
                <UserButtons
                  handleDelete={this.handleDelete}
                  handleEdit={this.handleEdit}
                />
              ) : (
                <OtherUserButtons
                  handleFollow={this.props.handleFollow}
                  article={article}
                  handleFavorite={this.props.handleFavorite}
                />
              )}
            </div>
          </div>
        </div>
        <div className="container-md ">
          <p className="whitespace-pre-line text-lg text-justify py-6">
            {/* <ReactMarkdown
              children=
              remarkPlugins={[remarkGfm]}
            /> */}
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
          {this.props.isLoggedIn ? (
            <AuthenticatedFooter user={this.props.user} slug={article.slug} />
          ) : (
            <UnAuthenticatedFooter user={this.props.user} slug={article.slug} />
          )}
        </div>
      </>
    );
  }
}
function OtherUserButtons(props) {
  return (
    <>
      {props.article.author.following ? (
        <button
          className="px-2 py-1 border-1 border-solid
        border-green-500 text-green-500 rounded-md
        ml-10 block hover:bg-green-500 text-sm font-bold
        hover:text-white"
          onClick={() =>
            props.handleFollow("DELETE", props.article.author.username)
          }
        >
          <i className="fas fa-minus pr-2"></i>
          UnFollow {props.article.author.username}
        </button>
      ) : (
        <button
          className="px-2 py-1 border-1 border-solid
        border-green-500 text-green-500 rounded-md
          ml-10 block hover:bg-green-500 text-sm font-bold
          hover:text-white"
          onClick={() =>
            props.handleFollow("POST", props.article.author.username)
          }
        >
          <i className="fas fa-plus pr-2"></i>
          Follow {props.article.author.username}
        </button>
      )}
      <button
        className="px-2 py-1 border-1 border-solid
        border-teal-500 text-teal-500 rounded-md
          ml-4 block hover:bg-teal-500 text-sm font-bold
          hover:text-white"
        onClick={() => props.handleFavorite("POST", props.article.slug)}
      >
        <i className="fas fa-heart pr-2"></i>
        Favorite Post
      </button>
    </>
  );
}
function UserButtons(props) {
  return (
    <>
      <button
        className="px-2 py-1 border-1 border-solid
        border-cyan-500 text-cyan-500 rounded-md
          ml-10 block hover:bg-cyan-500 text-sm font-bold
          hover:text-white"
        onClick={props.handleEdit}
      >
        <i className="fas fa-pen pr-2"></i>
        Edit Article
      </button>
      <button
        className="px-2 py-1 border-1 border-solid
        border-red-500 text-red-500 rounded-md
          ml-2 block hover:bg-red-500 text-sm font-bold
          hover:text-white"
        onClick={props.handleDelete}
      >
        <i className="fas fa-trash pr-2"></i>
        Delete Article
      </button>
    </>
  );
}

class AuthenticatedFooter extends React.Component {
  state = {
    comment: "",
    errors: {
      comment: "",
    },
  };
  handleChange = ({ target }) => {
    let { value } = target;
    this.setState({
      comment: value,
    });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    fetch(articlesURL + `/${this.props.slug}/comments`, {
      method: "POST",
      headers: {
        authorization: `Token ${this.props.user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment: { body: this.state.comment } }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => Promise.reject(errors));
        }
        return res.json();
      })
      .then(({ comment }) => {
        this.setState({ comment: "" });
      })
      .catch((errors) =>
        this.setState({ errors: { comment: "Couldn't Post comment" } })
      );
  };
  render() {
    return (
      <footer>
        <form
          action=""
          className="mx-auto w-1/2 font-0 my-4"
          onSubmit={this.handleSubmit}
        >
          <textarea
            id=""
            value={this.state.comment}
            rows="5"
            name="comment"
            placeholder="Write a comment"
            onChange={this.handleChange}
            className="w-full border-1 border-solid border-grey-200
           rounded-t-md  mb-0 p-4 text-base focus:outline-0"
          ></textarea>
          <div
            className="border-1 border-solid border-grey-200
         rounded-b-md mt-0 py-2 text-base flex justify-between
          items-center px-2 bg-gray-200"
          >
            <img
              src={this.props.user.image}
              alt={this.props.user.username}
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

        {/* View all comments */}
        <div className="mx-auto w-1/2 my-4">
          <Comments slug={this.props.slug} user={this.props.user} />
        </div>
      </footer>
    );
  }
}

function UnAuthenticatedFooter(props) {
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
      <div className="mx-auto w-1/2 my-8">
        <Comments slug={props.slug} />
      </div>
    </footer>
  );
}

export default withRouter(Article);
