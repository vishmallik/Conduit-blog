import React from "react";
import { UserContext } from "../context/UserContext";
import { articlesURL } from "../utils/urls";
import FeedNav from "./FeedNav";
import Pagination from "./Pagination";
import Posts from "./Posts";
import SideBar from "./SideBar";

export default class Home extends React.Component {
  state = {
    articles: null,
    error: "",
    articlesPerPage: 10,
    articlesCount: 0,
    currentPageIndex: 1,
    activeTab: "",
  };
  static contextType = UserContext;
  componentDidMount() {
    this.setState(
      {
        activeTab: "Your Feed",
      },
      () => this.fetchData()
    );
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.currentPageIndex !== this.state.currentPageIndex ||
      prevState.activeTab !== this.state.activeTab
    ) {
      this.fetchData();
    }
  }
  handleFavorite = (verb, slug) => {
    fetch(articlesURL + `/${slug}/favorite`, {
      method: verb,
      headers: {
        authorization: `Token ${this.context.user.token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => Promise.reject(errors));
        }
        this.fetchData();
      })
      .catch((errors) =>
        this.setState({ errors: "Unable to complete favorite request" })
      );
  };

  fetchData = () => {
    let limit = this.state.articlesPerPage;
    let offset = (this.state.currentPageIndex - 1) * limit;
    let tag = this.state.activeTab;

    fetch(
      articlesURL +
        (this.state.activeTab === "Your Feed" ? "/feed" : "") +
        `?limit=${limit}&offset=${offset}` +
        (tag && `&tag=${tag}`),
      {
        headers: this.context.isLoggedIn
          ? {
              Authorization: `Token ${this.context.user.token}`,
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
      .then((data) => {
        this.setState({
          articles: data.articles,
          articlesCount: data.articlesCount,
        });
      })
      .catch((err) => {
        this.setState({ error: "Unable to fetch data!!!" });
      });
  };
  updatePageIndex = (index) => {
    this.setState({
      currentPageIndex: index,
    });
  };
  updateActiveTab = (tag) => {
    this.setState({
      activeTab: tag,
    });
  };

  render() {
    let {
      articles,
      error,
      articlesPerPage,
      articlesCount,
      currentPageIndex,
      activeTab,
    } = this.state;
    return (
      <main className="sm:container-md container-mobile mx-auto sm:mx-auto">
        <div className="mx-auto py-6 text-center">
          <h1 className="py-4 text-5xl font-black text-amber-400">Conduit</h1>
          <p className="text-xl">A place to share your knowledge</p>
        </div>
        <div className="flex-wrap sm:flex">
          <div className="basis-full xl:basis-3/4">
            <FeedNav
              activeTab={activeTab}
              updateActiveTab={this.updateActiveTab}
            />
            <Posts
              articles={articles}
              error={error}
              updateActiveTab={this.updateActiveTab}
              handleFavorite={this.handleFavorite}
            />
            <Pagination
              articlesCount={articlesCount}
              articlesPerPage={articlesPerPage}
              currentPageIndex={currentPageIndex}
              updatePageIndex={this.updatePageIndex}
            />
          </div>
          <SideBar updateActiveTab={this.updateActiveTab} />
        </div>
      </main>
    );
  }
}
