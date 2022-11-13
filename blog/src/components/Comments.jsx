import React from "react";
import Loader from "./Loader";

export default function Comments(props) {
  let { comments, handleDeleteComment } = props;
  if (props.error) {
    return <p className="text-red-500 text-center">{props.error}</p>;
  }
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
                  src={comment.author.image || "/images/smiley-cyrus.jpg"}
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
              {props.user && props.user.username === comment.author.username ? (
                <i
                  className="fa-solid fa-trash text-gray-400 cursor-pointer
                   text-sm hover:text-red-500 "
                  onClick={() => handleDeleteComment(comment.id, props.slug)}
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
