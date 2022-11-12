import React from "react";
import Loader from "./Loader";
import Post from "./Post";

export default function Posts(props) {
  let { articles, error } = props;
  if (error) {
    return <p>{error}</p>;
  }
  if (!articles) {
    return <Loader />;
  }
  if (articles.length < 1) {
    return <h2 className="text-center font-2xl py-4">No articles found!!!</h2>;
  }
  return (
    <section>
      {articles.map((article) => (
        <Post
          article={article}
          isLoggedIn={props.isLoggedIn}
          key={article.slug}
          handleFavorite={props.handleFavorite}
        />
      ))}
    </section>
  );
}
