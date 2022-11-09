import React from "react";
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
  componentDidMount() {
    this.fetchData();
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.currentPageIndex !== this.state.currentPageIndex ||
      prevState.activeTab !== this.state.activeTab
    ) {
      this.fetchData();
    }
  }
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
        headers: {
          Authorization: "Token " + this.props.user.token,
        },
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
        this.setState({ error: "Unable to fetch data" });
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
      articlesCount,
      articlesPerPage,
      currentPageIndex,
      activeTab,
    } = this.state;
    return (
      <main className="container-md">
        <div className="py-6 mx-auto text-center">
          <h1 className="text-amber-400 font-black text-5xl py-4">Conduit</h1>
          <p className="text-xl">A place to share your knowledge</p>
        </div>
        <div className="flex">
          <div className="basis-3/4 w-3/4">
            <FeedNav
              activeTab={activeTab}
              updateActiveTab={this.updateActiveTab}
              user={this.props.user}
            />
            <Posts articles={articles} error={error} />
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
