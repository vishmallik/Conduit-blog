import React, { useContext, useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { articlesURL, profileURL } from "../utils/urls";
import Loader from "./Loader";
import Comments from "./Comments";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { UserContext } from "../context/UserContext";

function Article(props) {
  let [article, setArticle] = useState("");
  let [error, setError] = useState("");
  let { user } = useContext(UserContext);

  // componentDidMount() {
  //   //fetch article
  //   fetchAllArticles();
  // }
  useEffect(() => {
    fetchArticle();
  }, [article]);

  function fetchArticle() {
    fetchData("GET")
      .then(({ article }) => {
        setArticle(article);
      })
      .catch((err) => {
        setError("Unable to fetch article!!!");
      });
  }

  function fetchData(verb, headers = false, body) {
    let slug = props.match.params.slug;
    return fetch(articlesURL + "/" + slug, {
      method: verb,
      headers: headers
        ? {
            authorization: `Token ${user.token}`,
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
  }
  function handleFavorite(verb, slug) {
    fetch(articlesURL + `/${slug}/favorite`, {
      method: verb,
      headers: {
        authorization: `Token ${user.token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => Promise.reject(errors));
        }
      })
      .catch((errors) => setError("Unable to complete favorite request"));
  }
  function handleFollow(verb, username) {
    fetch(profileURL + `/${username}/follow`, {
      method: verb,
      headers: {
        authorization: `Token ${user.token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => Promise.reject(errors));
        }
      })
      .catch((errors) => setError("Unable to complete follow request"));
  }

  function handleDelete() {
    fetchData("DELETE", true)
      .then(props.history.push("/"))
      .catch((errors) => setError("Unable to delete article!!!"));
  }

  if (error) {
    return (
      <p className="min-h-screen py-10 text-center text-3xl text-red-500">
        {error}
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
            {user ? (
              article.author.username === user.username ? (
                <UserButtons handleDelete={handleDelete} article={article} />
              ) : (
                <OtherUserButtons
                  article={article}
                  handleFavorite={handleFavorite}
                  handleFollow={handleFollow}
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
                className="my-4 ml-2 inline-block rounded-full border-2 border-solid border-yellow-300 bg-yellow-200 px-2 text-sm"
              >
                {tag}
              </li>
            );
          })}
        </ul>
        <hr className="my-4" />
        <Comments slug={article.slug} />
      </div>
    </section>
  );
}

function OtherUserButtons({ article, handleFollow, handleFavorite }) {
  return (
    <>
      {article.author.following ? (
        <button
          className="border-1 mr-4 mb-4 w-full rounded-md border-solid border-green-500 px-2 py-1 text-sm font-bold text-green-500 hover:bg-green-500 hover:text-white sm:mb-0 sm:block sm:w-auto"
          onClick={() => handleFollow("DELETE", article.author.username)}
        >
          <i className="fas fa-minus pr-2"></i>
          UnFollow {article.author.username}
        </button>
      ) : (
        <button
          className="border-1 mb-4 block w-full rounded-md border-solid border-green-500 px-2 py-1 text-sm font-bold text-green-500 hover:bg-green-500 hover:text-white sm:mr-4 sm:mb-0 sm:w-auto"
          onClick={() => handleFollow("POST", article.author.username)}
        >
          <i className="fas fa-plus pr-2"></i>
          Follow {article.author.username}
        </button>
      )}

      <button
        className={`border-1 block w-full rounded-md border-solid border-teal-500 px-2 py-1 text-sm font-bold text-teal-500 hover:bg-teal-500 hover:text-white sm:w-auto `}
        onClick={() => handleFavorite("POST", article.slug)}
      >
        <i className="fas fa-heart pr-2"></i>
        Favorite Post
      </button>
    </>
  );
}

function UserButtons({ article, handleDelete }) {
  return (
    <>
      <button className="border-1 mb-4 block w-full rounded-md border-solid border-cyan-500 px-2 py-1 text-sm font-bold text-cyan-500 hover:bg-cyan-500 hover:text-white sm:mr-4 sm:mb-0 sm:w-auto">
        <Link to={{ pathname: "/editor", state: { article: article } }}>
          <i className="fas fa-pen pr-2"></i>
          Edit Article
        </Link>
      </button>
      <button
        className="border-1 mb-4 block w-full rounded-md border-solid border-red-500 px-2 py-1 text-sm font-bold text-red-500 hover:bg-red-500 hover:text-white sm:mb-0 sm:w-auto"
        onClick={handleDelete}
      >
        <i className="fas fa-trash pr-2"></i>
        Delete Article
      </button>
    </>
  );
}

export default withRouter(Article);
