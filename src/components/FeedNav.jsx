import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function FeedNav(props) {
  let { isLoggedIn } = useContext(UserContext);
  return (
    <>
      {isLoggedIn && (
        <Link
          className={`mr-2 px-1  ${
            props.activeTab === "Your Feed" &&
            "border-b-2 border-solid border-amber-500 text-amber-500"
          }`}
          to="/"
          onClick={() => {
            props.updateActiveTab("Your Feed");
          }}
        >
          Your Feed
        </Link>
      )}

      <Link
        className={`mr-2 px-1  ${
          !props.activeTab &&
          "border-b-2 border-solid border-amber-500 text-amber-500"
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
          className={`mr-2 px-1  ${
            props.activeTab &&
            props.activeTab !== "Your Feed" &&
            "border-b-2 border-solid border-amber-500 text-amber-500"
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
