export default function Setting(props) {
  return (
    <div className="container-md w-1/2">
      <form action="" className="my-4 flex flex-col">
        <label htmlFor="" className="text-3xl py-2 font-bold mx-auto">
          Your Settings
        </label>
        <input
          type="text"
          name="img_url"
          placeholder="URL of profile picture"
          className=" px-6 py-2 my-2 rounded-md border-1 border-solid border-slate-400  focus:outline-blue-300"
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          // value={props.user.username}
          className=" px-6 py-2 my-2 rounded-md border-1 border-solid border-slate-400 focus:outline-blue-300"
        />
        <textarea
          type="text"
          name="bio"
          placeholder="Short Bio about you"
          rows="10"
          className=" px-6 py-2 my-2 rounded-md border-1 border-solid border-slate-400 focus:outline-blue-300"
        ></textarea>
        <input
          type="text"
          name="email"
          placeholder="Email"
          // value={props.user.email}
          className=" px-6 py-2 my-2 rounded-md border-1 border-solid border-slate-400 focus:outline-blue-300"
        />
        <input
          type="password"
          name="email"
          placeholder="New Password"
          className=" px-6 py-2 my-2 rounded-md border-1 border-solid border-slate-400 focus:outline-blue-300"
        />
        <input
          type="submit"
          value="Update Settings"
          className="bg-amber-500 mr-0 ml-auto px-6 py-2 mt-4 text-white
        rounded-md text-lg cursor-pointer"
        />
      </form>
      <hr />
      <button className="text-red-500 border-1 border-solid border-red-500 py-2 px-4 rounded-lg my-4 hover:bg-red-500 hover:text-white">
        or click here to Logout
      </button>
    </div>
  );
}