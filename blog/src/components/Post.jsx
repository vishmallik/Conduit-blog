import { Link } from "react-router-dom";

export default function Post(props) {
  let {
    author,
    createdAt,
    description,
    tagList,
    title,
    slug,
    favoritesCount,
    favorited,
  } = props.article;
  return (
    <article
      className="my-6 bg-amber-200 p-4 
    rounded-md overflow-hidden"
    >
      <div className="flex items-center">
        <Link to={`/profile/@${author.username}`}>
          <img
            src={author.image || "/images/smiley-cyrus.jpg"}
            alt={author.username}
            className="w-10 h-10 rounded-full"
          />
        </Link>

        <div className="basis-11/12 pl-4">
          <Link to={`/profile/@${author.username}`}>
            <p className="text-red-600 hover:underline">{author.username}</p>
          </Link>
          <p className="text-gray-400 text-xs">
            {new Date(createdAt).toDateString()}
          </p>
        </div>
        {props.isLoggedIn ? (
          <button
            className={` basis-12 py-1 rounded-md border-2
         border-amber-400 ${favorited && "bg-red-200"}`}
            onClick={props.handleFavorite("POST", slug)}
          >
            <i className={`fas fa-heart ${favorited && "text-red-500"}`}></i>{" "}
            {favoritesCount}
          </button>
        ) : (
          <button
            className={` basis-12 py-1 rounded-md border-2
         border-amber-400 ${favorited && "bg-red-200"}`}
          >
            <Link to="/login">
              <i className={`fas fa-heart ${favorited && "text-red-500"}`}></i>{" "}
              {favoritesCount}
            </Link>
          </button>
        )}
      </div>
      <Link to={`/article/${slug}`}>
        <h2 className="text-xl mt-4 font-bold">{title}</h2>
        <p className="text-slate-500">{description}</p>
      </Link>

      <div className="flex flex-wrap justify-between my-2 mt-4 mx-2">
        <Link className="text-blue-600 hover:underline" to={`/article/${slug}`}>
          Read More...
        </Link>
        <div className="flex flex-wrap py-2">
          {tagList.map((tag) => {
            return (
              <Link
                className="text-sm ml-2 rounded-full px-2 
                border-2 border-solid border-yellow-300
              bg-yellow-200"
                key={tag}
                to="/"
              >
                {tag}
              </Link>
            );
          })}
        </div>
      </div>
    </article>
  );
}
