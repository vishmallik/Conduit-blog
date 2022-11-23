import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { articlesURL } from "../utils/urls";
import FeedNav from "./FeedNav";
import Pagination from "./Pagination";
import Posts from "./Posts";
import SideBar from "./SideBar";

function Home() {
  const articlesPerPage = 10;
  let { user, isLoggedIn } = useContext(UserContext);
  let [articles, setArticles] = useState(null);
  let [articlesCount, setArticlesCount] = useState(0);
  let [currentPageIndex, setCurrentPageIndex] = useState(1);
  let [activeTab, setActiveTab] = useState(() => {
    if (isLoggedIn) {
      return "Your Feed";
    } else {
      return "";
    }
  });
  let [error, setError] = useState("");

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
        fetchData();
      })
      .catch((errors) => setError("Unable to complete favorite request"));
  }
  const fetchData = useCallback(() => {
    let limit = articlesPerPage;
    let offset = (currentPageIndex - 1) * limit;
    let tag = activeTab;
    fetch(
      articlesURL +
        (activeTab === "Your Feed" ? "/feed" : "") +
        `?limit=${limit}&offset=${offset}` +
        (tag && `&tag=${tag}`),
      {
        headers: isLoggedIn
          ? {
              Authorization: `Token ${user.token}`,
            }
          : {},
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then(({ articles, articlesCount }) => {
        setArticles(articles);
        setArticlesCount(articlesCount);
      })
      .catch((err) => {
        setError("Unable to fetch data!!!");
      });
  }, [articlesPerPage, currentPageIndex, activeTab, isLoggedIn]);

  useEffect(() => {
    fetchData();
  }, [activeTab, currentPageIndex, fetchData]);

  return (
    <main className="sm:container-md container-mobile mx-auto sm:mx-auto">
      <div className="mx-auto py-6 text-center">
        <h1 className="py-4 text-5xl font-black text-amber-400">Conduit</h1>
        <p className="text-xl">A place to share your knowledge</p>
      </div>
      <div className="flex-wrap sm:flex">
        <div className="basis-full xl:basis-3/4">
          <FeedNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <Posts
            articles={articles}
            error={error}
            setActiveTab={setActiveTab}
            handleFavorite={handleFavorite}
          />
          <Pagination
            articlesCount={articlesCount}
            articlesPerPage={articlesPerPage}
            currentPageIndex={currentPageIndex}
            setCurrentPageIndex={setCurrentPageIndex}
          />
        </div>
        <SideBar setActiveTab={setActiveTab} />
      </div>
    </main>
  );
}
export default React.memo(Home);
