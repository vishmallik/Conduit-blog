import { Link } from "react-router-dom";

export default function Error() {
  return (
    <>
      <h2 className="my-6 text-center text-4xl"> 404 Page Not Found</h2>
      <Link
        to="/"
        className="block 
      text-center text-amber-400 hover:underline"
      >
        Go back to Home
      </Link>
    </>
  );
}
