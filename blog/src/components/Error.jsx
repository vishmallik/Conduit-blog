import { Link } from "react-router-dom";

export default function Error() {
  return (
    <>
      <h2 className="text-center text-4xl my-6"> 404 Page Not Found</h2>
      <Link
        to="/"
        className="text-amber-400 
      text-center hover:underline block"
      >
        Go back to Home
      </Link>
    </>
  );
}
