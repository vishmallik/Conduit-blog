import React from "react";
import Loader from "./Loader";

export default function Comments(props) {
  let { comments, handleDeleteComment } = props;
  if (props.error) {
    return <p className="text-center text-red-500">{props.error}</p>;
  }
  if (!comments) {
    return <Loader />;
  } else {
    return (
      <ul>
        {comments.map((comment) => (
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
              {props.user && props.user.username === comment.author.username && (
                <i
                  className="fa-solid fa-trash cursor-pointer text-sm
                   text-gray-400 hover:text-red-500 "
                  onClick={() => handleDeleteComment(comment.id, props.slug)}
                ></i>
              )}
            </div>
          </li>
        ))}
      </ul>
    );
  }
}
