import React from "react";
import { Link } from "react-router-dom";
import { articlesURL } from "../utils/urls";
import Loader from "./Loader";

export default class Comments extends React.Component {
  state = {
    comments: "",
    comment: "",
    errors: "",
  };

  componentDidMount() {
    this.fetchAllComments();
  }

  fetchData = (verb, headers = false, id = "", body) => {
    return fetch(articlesURL + `/${this.props.slug}/comments/${id}`, {
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

  fetchAllComments = () => {
    this.fetchData("GET")
      .then(({ comments }) => {
        this.setState({ comments });
      })
      .catch((errors) =>
        this.setState({
          errors: "Couldn't Fetch comments",
        })
      );
  };

  handleDeleteComment = (id) => {
    this.fetchData("DELETE", true, id)
      .then((value) => !value && this.fetchAllComments())
      .catch((errors) =>
        this.setState({
          errors: "Couldn't Delete comments",
        })
      );
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
    this.fetchData("POST", true, "", body)
      .then(({ comment }) => {
        this.setState({ comment: "" });
        this.fetchAllComments(this.props.slug);
      })
      .catch((errors) => this.setState({ errors: "Couldn't Post comment" }));
  };
  render() {
    let { comments, errors } = this.state;

    return (
      <footer>
        {!this.props.isLoggedIn ? (
          <p className="my-4 text-center">
            <Link className="text-amber-500" to="/login">
              Sign in{" "}
            </Link>
            or{" "}
            <Link className="text-amber-500" to="/register">
              Sign Up{" "}
            </Link>
            to add comments to this article.
          </p>
        ) : (
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
        )}

        {/* View all comments */}

        <div className="mx-auto my-4 w-full 2xl:w-1/2">
          {errors && <p className="text-center text-red-500">{errors}</p>}
          <ul>
            {!comments ? (
              <Loader />
            ) : (
              comments.map((comment) => (
                <li
                  key={comment.id}
                  className=" border-1 my-4
             rounded-md border-solid border-gray-200"
                >
                  <div className="p-4">{comment.body}</div>

                  <div
                    className="border-t-1 flex items-center justify-between
               border-solid border-gray-200 bg-gray-200 px-4 py-2"
                  >
                    <div className="flex items-center">
                      <img
                        src={comment.author.image || "/images/smiley-cyrus.jpg"}
                        alt={comment.author.username}
                        className="h-8 w-8 rounded-full"
                      />
                      <p className="px-4 text-xs font-thin text-green-500">
                        {comment.author.username}
                      </p>
                      <span className="text-xs font-thin text-gray-400 ">
                        {new Date(comment.createdAt).toDateString()}
                      </span>
                    </div>
                    {this.props.user &&
                      this.props.user.username === comment.author.username && (
                        <i
                          className="fa-solid fa-trash cursor-pointer text-sm
                   text-gray-400 hover:text-red-500 "
                          onClick={() =>
                            this.handleDeleteComment(
                              comment.id,
                              this.props.slug
                            )
                          }
                        ></i>
                      )}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </footer>
    );
  }
}
