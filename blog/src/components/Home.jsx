import React from "react";
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
      <main className="sm:container-md container-mobile mx-auto sm:mx-auto">
        <div className="mx-auto py-6 text-center">
          <h1 className="py-4 text-5xl font-black text-amber-400">Conduit</h1>
          <p className="text-xl">A place to share your knowledge</p>
        </div>
        <div className="flex-wrap sm:flex">
          <div className="basis-full xl:basis-3/4">
            <FeedNav
              activeTab={this.props.activeTab}
              updateActiveTab={this.props.updateActiveTab}
            />
            <Posts
              articles={this.props.articles}
              error={this.props.error}
              handleFavorite={this.props.handleFavorite}
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
