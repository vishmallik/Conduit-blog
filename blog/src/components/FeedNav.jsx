import { Link } from "react-router-dom";

export default function FeedNav(props) {
  return (
    <>
      {props.user ? (
        <Link
          className={`px-1 mr-2  ${
            props.activeTab === "Your Feed"
              ? "border-solid border-b-2 border-amber-500 text-amber-500"
              : ""
          }`}
          to="/"
          onClick={() => {
            props.updateActiveTab("Your Feed");
          }}
        >
          Your Feed
        </Link>
      ) : (
        ""
      )}

      <Link
        className={`px-1 mr-2  ${
          props.activeTab
            ? ""
            : "border-solid border-b-2 border-amber-500 text-amber-500"
        }`}
        to="/"
        onClick={() => {
          props.updateActiveTab("");
        }}
      >
        Global Feed
      </Link>
      {props.activeTab && props.activeTab !== "Your Feed" && (
        <Link
          className={`px-1 mr-2  ${
            props.activeTab && props.activeTab !== "Your Feed"
              ? "border-solid border-b-2 border-amber-500 text-amber-500"
              : ""
          }`}
          to="/"
        >
          #{props.activeTab}
        </Link>
      )}
      <hr />
    </>
  );
}
