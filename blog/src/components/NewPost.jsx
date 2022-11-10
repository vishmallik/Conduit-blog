export default function NewPost() {
  return (
    <form action="" className="container-md flex flex-col w-1/2">
      <input
        type="text"
        name="title"
        placeholder="Article Title"
        className="text-xl px-6 py-2 my-2 mt-16 rounded-md border-1 border-solid border-slate-400  focus:outline-blue-300"
      />
      <input
        type="text"
        name="description"
        placeholder="What's this article about?"
        className=" px-6 py-2 my-2 rounded-md border-1 border-solid border-slate-400 focus:outline-blue-300"
      />
      <textarea
        type="text"
        name="body"
        placeholder="Write your article (in markdown)"
        rows="10"
        className=" px-6 py-2 my-2 rounded-md border-1 border-solid border-slate-400 focus:outline-blue-300"
      ></textarea>
      <input
        type="text"
        name="tags"
        placeholder="Enter Tags"
        className=" px-6 py-2 my-2 rounded-md border-1 border-solid border-slate-400 focus:outline-blue-300"
      />
      <input
        type="submit"
        value="Publish Article"
        className="bg-amber-500 mr-0 ml-auto px-6 py-2 mt-4 text-white
      rounded-md text-lg cursor-pointer"
      />
    </form>
  );
}
