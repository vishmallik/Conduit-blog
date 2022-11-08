import { Link } from "react-router-dom";

export default function FeedNav(props) {
  return (
    <>
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
      {props.activeTab && (
        <Link
          className={`px-1 mr-2  ${
            props.activeTab
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
