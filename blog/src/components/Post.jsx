import { Link } from "react-router-dom";

export default function Post(props) {
  let { author, createdAt, description, tagList, title, slug } = props.article;
  return (
    <article
      className="my-6 bg-amber-200 p-4 
    rounded-md overflow-hidden"
    >
      <div className="flex items-center">
        <img
          src={author.image || "/images/smiley-cyrus.jpg"}
          alt={author.username}
          className="w-10 h-10 rounded-full"
        />
        <div className="basis-11/12 pl-4">
          <p className="text-red-600">{author.username}</p>
          <p className="text-gray-400 text-xs">
            {new Date(createdAt).toDateString()}
          </p>
        </div>
        <button
          className=" basis-12 py-1 rounded-md border-2
         border-amber-400"
        >
          <i className="fas fa-heart"></i>1
        </button>
      </div>
      <Link to={`/article/${slug}`}>
        <h2 className="text-xl mt-4 font-bold">{title}</h2>
        <p className="text-slate-500">{description}</p>
      </Link>

      <div className="flex justify-between my-2 mt-4">
        <Link className="text-blue-600 hover:underline" to={`/article/${slug}`}>
          Read More...
        </Link>
        <div>
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
