import { Link, withRouter } from "react-router-dom";
import React from "react";
import Loader from "./Loader";
import { UserContext } from "../context/UserContext";

function Posts(props) {
  let { articles, error } = props;
  if (error) {
    return <p className="py-8 text-center text-2xl text-red-500">{error}</p>;
  }
  if (!articles) {
    return <Loader />;
  }
  if (articles.length < 1) {
    return <h2 className="font-2xl py-4 text-center">No articles found!!!</h2>;
  }

  return (
    <section>
      {articles.map((article) => (
        <Post
          article={article}
          key={article.slug}
          updateActiveTab={props.updateActiveTab}
          handleFavorite={props.handleFavorite}
          pathname={props.location.pathname}
        />
      ))}
    </section>
  );
}

class Post extends React.Component {
  state = {
    favCount: 0,
    isFavorited: false,
    errors: "",
  };
  static contextType = UserContext;
  componentDidMount() {
    this.setState({
      favCount: this.props.article.favoritesCount,
      isFavorited: this.props.article.favorited,
    });
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.article.favoritesCount !== this.props.article.favoritesCount
    ) {
      this.setState({
        favCount: this.props.article.favoritesCount,
        isFavorited: this.props.article.favorited,
      });
    }
  }
  handleFavoritesCount = (verb) => {
    this.props.handleFavorite(verb, this.props.article.slug);
    this.setState((prevState) => {
      if (verb === "DELETE") {
        return {
          favCount: prevState.favCount - 1,
          isFavorited: false,
        };
      }
      if (verb === "POST") {
        return {
          favCount: prevState.favCount + 1,
          isFavorited: true,
        };
      }
    });
  };

  render() {
    let { author, createdAt, description, tagList, title, slug, favorited } =
      this.props.article;
    return (
      <article
        className="my-6 overflow-hidden rounded-md 
    bg-amber-200 p-4"
      >
        <div className="flex items-center">
          <Link to={`/profile/@${author.username}`}>
            <img
              src={author.image || "/images/smiley-cyrus.jpg"}
              alt={author.username}
              className="h-10 w-10 rounded-full"
            />
          </Link>

          <div className="basis-11/12 pl-4">
            <Link to={`/profile/@${author.username}`}>
              <p className="text-red-600 hover:underline">{author.username}</p>
            </Link>
            <p className="text-xs text-gray-400">
              {new Date(createdAt).toDateString()}
            </p>
          </div>
          {this.context.isLoggedIn ? (
            <button
              className={`basis-12 rounded-md border-2 border-amber-400 py-1  ${
                this.state.isFavorited && "bg-red-300 text-red-500"
              }`}
              onClick={
                favorited
                  ? () => this.handleFavoritesCount("DELETE")
                  : () => this.handleFavoritesCount("POST")
              }
            >
              <i className={`fas fa-heart `}></i>{" "}
              <span className="text-black">{this.state.favCount}</span>
            </button>
          ) : (
            <button
              className={` basis-12 rounded-md border-2 border-amber-400
         py-1 `}
            >
              <Link to="/login">
                <i className="fas fa-heart"></i>
                <span>{this.state.favCount}</span>
              </Link>
            </button>
          )}
        </div>
        <Link to={`/article/${slug}`}>
          <h2 className="mt-4 text-xl font-bold">{title}</h2>
          <p className="text-slate-500">{description}</p>
        </Link>

        <div className="my-2 mx-2 mt-4 flex flex-wrap justify-between">
          <Link
            className="text-blue-600 hover:underline"
            to={`/article/${slug}`}
          >
            Read More...
          </Link>
          <div className="flex flex-wrap py-2">
            {tagList.map((tag) => {
              return (
                <Link
                  className="ml-2 rounded-full border-2 border-solid 
                border-yellow-300 bg-yellow-200 px-2
              text-sm hover:bg-red-300 hover:text-white"
                  key={tag}
                  to="/"
                  onClick={
                    this.props.pathname === "/"
                      ? () => this.props.updateActiveTab(tag)
                      : null
                  }
                >
                  {tag}
                </Link>
              );
            })}
          </div>
        </div>
      </article>
    );
  }
}
export default withRouter(Posts);
