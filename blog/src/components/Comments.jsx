import React from "react";
import { articlesURL } from "../utils/urls";
import Loader from "./Loader";
class Comments extends React.Component {
  state = {
    comments: null,
    errors: {
      comments: "",
    },
  };
  //   componentDidUpdate(prevProps, prevState) {
  //     if (prevState.comments == this.state.comments) {
  //       console.log("cdu");
  //       fetch(articlesURL + `/${this.props.slug}/comments`)
  //         .then((res) => {
  //           if (!res.ok) {
  //             return res.json().then(({ errors }) => Promise.reject(errors));
  //           }
  //           return res.json();
  //         })
  //         .then(({ comments }) => {
  //           this.setState({ comments });
  //         })
  //         .catch((errors) =>
  //           this.setState({ errors: { comments: "Couldn't Fetch comments" } })
  //         );
  //     }
  //   }
  componentDidMount() {
    console.log("cdm-h");
    fetch(articlesURL + `/${this.props.slug}/comments`)
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => Promise.reject(errors));
        }
        return res.json();
      })
      .then(({ comments }) => {
        this.setState({ comments });
      })
      .catch((errors) =>
        this.setState({ errors: { comments: "Couldn't Fetch comments" } })
      );
  }
  deleteComment = (id) => {
    fetch(articlesURL + `/${this.props.slug}/comments/${id}`, {
      method: "DELETE",
      headers: { authorization: `Token ${this.props.user.token}` },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => Promise.reject(errors));
        }
        this.setState({});
      })
      .catch((errors) =>
        this.setState({ errors: { comments: "Couldn't Fetch comments" } })
      );
  };
  render() {
    let { comments } = this.state;
    console.log("hey");
    if (!comments) {
      return <Loader />;
    } else {
      return (
        <ul>
          {comments.map((comment) => (
            <li
              key={comment.id}
              className=" rounded-md border-1
             border-gray-200 border-solid my-4"
            >
              <div className="p-4">{comment.body}</div>

              <div
                className="flex justify-between items-center border-t-1
               bg-gray-200 px-4 py-2 border-solid border-gray-200"
              >
                <div className="flex items-center">
                  <img
                    src={comment.author.image}
                    alt={comment.author.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <p className="px-4 text-green-500 text-xs font-thin">
                    {comment.author.username}
                  </p>
                  <span className="text-gray-400 text-xs font-thin ">
                    {new Date(comment.createdAt).toDateString()}
                  </span>
                </div>
                {this.props.user &&
                this.props.user.username === comment.author.username ? (
                  <i
                    className="fa-solid fa-trash text-gray-400 cursor-pointer
                   text-sm hover:text-red-500 "
                    onClick={() => this.deleteComment(comment.id)}
                  ></i>
                ) : (
                  ""
                )}
              </div>
            </li>
          ))}
        </ul>
      );
    }
  }
}

export default Comments;
