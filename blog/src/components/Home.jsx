import React from "react";
import { articlesURL } from "../utils/urls";
import FeedNav from "./FeedNav";
import Pagination from "./Pagination";
import Posts from "./Posts";
import SideBar from "./SideBar";

export default class Home extends React.Component {
  componentDidMount() {
    this.props.fetchData();
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.currentPageIndex !== this.props.currentPageIndex ||
      prevProps.activeTab !== this.props.activeTab
    ) {
      this.props.fetchData();
    }
  }

  render() {
    return (
      <main className="sm:container-md container-mobile sm:mx-auto mx-auto">
        <div className="py-6 mx-auto text-center">
          <h1 className="text-amber-400 font-black text-5xl py-4">Conduit</h1>
          <p className="text-xl">A place to share your knowledge</p>
        </div>
        <div className="sm:flex flex-wrap">
          <div className="xl:basis-3/4 basis-full">
            <FeedNav
              activeTab={this.props.activeTab}
              updateActiveTab={this.props.updateActiveTab}
              isLoggedIn={this.props.isLoggedIn}
            />
            <Posts
              articles={this.props.articles}
              error={this.props.error}
              handleFollow={this.props.handleFollow}
              handleFavorite={this.props.handleFavorite}
              isLoggedIn={this.props.isLoggedIn}
              updateActiveTab={this.props.updateActiveTab}
            />
            <Pagination
              articlesCount={this.props.articlesCount}
              articlesPerPage={this.props.articlesPerPage}
              currentPageIndex={this.props.currentPageIndex}
              updatePageIndex={this.props.updatePageIndex}
            />
          </div>
          <SideBar updateActiveTab={this.props.updateActiveTab} />
        </div>
      </main>
    );
  }
}
