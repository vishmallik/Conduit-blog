import React from "react";
import { Link, withRouter } from "react-router-dom";
import { articlesURL } from "../utils/urls";
import Loader from "./Loader";
import Comments from "./Comments";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

class Article extends React.Component {
  state = {
    article: null,
    comments: null,
    errors: {
      article: "",
      comments: "",
    },
  };

  componentDidMount() {
    let slug = this.props.match.params.slug;
    //fetch article
    this.fetchData("GET", slug, false)
      .then((data) => {
        this.setState({
          article: data.article,
        });
      })
      .catch((err) => {
        this.setState({
          errors: {
            ...this.state.errors,
            article: "Unable to fetch article!!!",
          },
        });
      });

    //fetch comments
    this.fetchAllComments(slug);
  }
  fetchAllComments = (slug) => {
    this.fetchData("GET", slug, false, true, "")
      .then(({ comments }) => {
        this.setState({ comments });
      })
      .catch((errors) =>
        this.setState({
          errors: { ...this.state.errors, comments: "Couldn't Fetch comments" },
        })
      );
  };
  fetchData = (verb, slug, headers, comments, id, body) => {
    return fetch(articlesURL + `/${slug}${comments ? `/comments/${id}` : ""}`, {
      method: verb,
      headers: headers
        ? {
            authorization: `Token ${this.props.user.token}`,
            "Content-Type": "application/json",
          }
        : {},
      body: JSON.stringify(body),
    }).then((res) => {
      if (!res.ok) {
        return res.json().then(({ errors }) => Promise.reject(errors));
      }
      if (res.statusText === "No Content") {
        return null;
      }
      return res.json();
    });
  };
  handleDelete = () => {
    let { slug } = this.state.article;
    this.fetchData("DELETE", slug, true)
      .then(this.props.history.push("/"))
      .catch((err) => {
        this.setState({
          errors: {
            ...this.state.errors,
            article: "Unable to delete article!!!",
          },
        });
      });
  };

  handleDeleteComment = (id, slug) => {
    this.fetchData("DELETE", slug, true, true, id)
      .then((value) => (!value ? this.fetchAllComments(slug) : ""))
      .catch((errors) => {
        this.setState({ errors: { comments: "Couldn't Delete comments" } });
      });
  };

  render() {
    let { article, comments, errors } = this.state;

    if (errors.article) {
      return (
        <p className="min-h-screen py-10 text-center text-3xl text-red-500">
          {errors.article}
        </p>
      );
    }
    if (!article) {
      return (
        <div className="mx-auto min-h-screen w-3/4">
          <Loader />
        </div>
      );
    }
    return (
      <section className="min-h-screen">
        <div className="bg-zinc-600 ">
          <div className="container-md py-10">
            <h2 className="mb-4 py-4 text-4xl font-semibold text-white">
              {article.title}
            </h2>
            <div className="flex flex-wrap  items-center">
              <Link to="/" className="mb-6 sm:mb-0">
                <img
                  src={article.author.image || "/images/smiley-cyrus.jpg"}
                  alt={article.author.username}
                  className="mr-4 h-10 w-10 rounded-full"
                />
              </Link>
              <div className="mr-10 mb-6 sm:mb-0">
                <Link to="/">
                  <p className="text-amber-500 hover:underline">
                    {article.author.username}
                  </p>
                </Link>
                <p className="text-xs text-gray-400">
                  {new Date(article.createdAt).toDateString()}
                </p>
              </div>
              {this.props.user ? (
                article.author.username === this.props.user.username ? (
                  <UserButtons
                    handleDelete={this.handleDelete}
                    article={article}
                  />
                ) : (
                  <OtherUserButtons
                    handleFollow={this.props.handleFollow}
                    article={article}
                    handleFavorite={this.props.handleFavorite}
                  />
                )
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div className="sm:container-md container-mobile ">
          <span className="whitespace-pre-line break-words py-6 text-justify text-lg">
            <ReactMarkdown
              className="py-6"
              children={article.body}
              remarkPlugins={[remarkGfm]}
            />
          </span>
          <ul>
            {article.tagList.map((tag) => {
              return (
                <li
                  key={tag}
                  className="my-4 ml-2 inline-block
                   rounded-full border-2 border-solid border-yellow-300 bg-yellow-200
                    px-2 text-sm"
                >
                  {tag}
                </li>
              );
            })}
          </ul>
          <hr className="my-4" />
          {this.props.isLoggedIn ? (
            <AuthenticatedFooter
              user={this.props.user}
              slug={article.slug}
              comments={comments}
              handleDeleteComment={this.handleDeleteComment}
              fetchAllComments={this.fetchAllComments}
              error={this.state.errors.comments}
            />
          ) : (
            <UnAuthenticatedFooter
              user={this.props.user}
              slug={article.slug}
              comments={comments}
              error={this.state.errors.comments}
            />
          )}
        </div>
      </section>
    );
  }
}

class AuthenticatedFooter extends React.Component {
  state = {
    comment: "",
    errors: "",
  };
  handleChange = ({ target }) => {
    let { value } = target;
    this.setState({
      comment: value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    let body = { comment: { body: this.state.comment } };
    fetch(articlesURL + `/${this.props.slug}/comments/`, {
      method: "POST",
      headers: {
        authorization: `Token ${this.props.user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => Promise.reject(errors));
        }
        return res.json();
      })
      .then(({ comment }) => {
        this.setState({ comment: "" });
        this.props.fetchAllComments(this.props.slug);
      })
      .catch((errors) => this.setState({ errors: "Couldn't Post comment" }));
  };

  render() {
    return (
      <footer>
        {this.state.errors && (
          <p className="text-center text-red-500">{this.state.errors}</p>
        )}
        <form
          className="font-0 mx-auto my-4 w-full 2xl:w-1/2 "
          onSubmit={this.handleSubmit}
        >
          <textarea
            id=""
            value={this.state.comment}
            rows="5"
            name="comment"
            placeholder="Write a comment"
            onChange={this.handleChange}
            className="border-1 border-grey-200 mb-0 w-full
           rounded-t-md  border-solid p-4 text-base focus:outline-0"
          />
          <div
            className="border-1 border-grey-200 mt-0
         flex items-center justify-between rounded-b-md border-solid bg-gray-200
          py-2 px-2 text-base"
          >
            <img
              src={this.props.user.image || "images/smiley-cyrus.jpg"}
              alt={this.props.user.username}
              className="h-8 w-8 rounded-full"
            />
            <input
              type="submit"
              value="Post Comment"
              className="ml-auto mr-0 
          cursor-pointer rounded-md bg-amber-500 px-2 py-1 text-white"
            />
          </div>
        </form>

        {/* View all comments */}
        <div className="mx-auto my-4 w-full 2xl:w-1/2">
          <Comments
            slug={this.props.slug}
            user={this.props.user}
            comments={this.props.comments}
            handleDeleteComment={this.props.handleDeleteComment}
            error={this.props.error}
          />
        </div>
      </footer>
    );
  }
}

function UnAuthenticatedFooter(props) {
  return (
    <footer>
      <p className="my-4 text-center">
        <Link className="text-amber-500" to="/login">
          Sign in
        </Link>
        or
        <Link className="text-amber-500" to="/register">
          Sign Up
        </Link>
        to add comments to this article.
      </p>
      <div className="mx-auto my-4 w-full 2xl:w-1/2">
        <Comments
          slug={props.slug}
          comments={props.comments}
          error={props.error}
        />
      </div>
    </footer>
  );
}

function OtherUserButtons(props) {
  return (
    <>
      {props.article.author.following ? (
        <button
          className="border-1 mr-4 mb-4 w-full
        rounded-md border-solid border-green-500
        px-2 py-1 text-sm font-bold text-green-500
        hover:bg-green-500 hover:text-white sm:mb-0 sm:block sm:w-auto"
          onClick={() =>
            props.handleFollow("DELETE", props.article.author.username)
          }
        >
          <i className="fas fa-minus pr-2"></i>
          UnFollow {props.article.author.username}
        </button>
      ) : (
        <button
          className="border-1 mb-4 block w-full
        rounded-md border-solid border-green-500
          px-2 py-1 text-sm font-bold text-green-500
          hover:bg-green-500 hover:text-white sm:mr-4 sm:mb-0 sm:w-auto"
          onClick={() =>
            props.handleFollow("POST", props.article.author.username)
          }
        >
          <i className="fas fa-plus pr-2"></i>
          Follow {props.article.author.username}
        </button>
      )}

      <button
        className={`border-1 block w-full rounded-md border-solid
         border-teal-500 px-2 py-1 text-sm
          font-bold text-teal-500 hover:bg-teal-500 hover:text-white sm:w-auto `}
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
        className="border-1 mb-4 block w-full
        rounded-md border-solid border-cyan-500
          px-2 py-1 text-sm font-bold text-cyan-500
          hover:bg-cyan-500 hover:text-white sm:mr-4 sm:mb-0 sm:w-auto"
      >
        <Link to={{ pathname: "/editor", state: { article: props.article } }}>
          <i className="fas fa-pen pr-2"></i>
          Edit Article
        </Link>
      </button>
      <button
        className="border-1 mb-4 block w-full
        rounded-md border-solid border-red-500
           px-2 py-1 text-sm font-bold
          text-red-500 hover:bg-red-500 hover:text-white sm:mb-0 sm:w-auto"
        onClick={props.handleDelete}
      >
        <i className="fas fa-trash pr-2"></i>
        Delete Article
      </button>
    </>
  );
}

export default withRouter(Article);
