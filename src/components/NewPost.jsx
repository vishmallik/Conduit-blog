import React, { useContext, useEffect, useReducer } from "react";
import { withRouter } from "react-router";
import { UserContext } from "../context/UserContext";
import { articlesURL } from "../utils/urls";

function reducer(state, action) {
  switch (action.type) {
    case "title":
      return {
        ...state,
        title: action.payload,
      };
    case "description":
      return {
        ...state,
        description: action.payload,
      };
    case "body":
      return {
        ...state,
        body: action.payload,
      };
    case "tagList":
      return {
        ...state,
        tagList: action.payload,
      };
    case "errors":
      return {
        ...state,
        errors: action.payload,
      };
    default:
      return state;
  }
}

function NewPost(props) {
  let [state, dispatch] = useReducer(reducer, {
    title: "",
    description: "",
    body: "",
    tagList: "",
    errors: "",
  });

  let { user } = useContext(UserContext);
  useEffect(() => {
    if (props.location.state) {
      let { title, description, body, tagList } = props.location.state.article;
      dispatch({ type: "title", payload: title });
      dispatch({ type: "description", payload: description });
      dispatch({ type: "body", payload: body });
      dispatch({ type: "tagList", payload: tagList });
    }
  }, [props.location.state]);

  function handleChange({ target }) {
    let { name, value } = target;
    if (name === "tagList") {
      value = value.split(",").map((tag) => tag.trim());
    }
    dispatch({ type: name, payload: value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    let { title, description, body, tagList, errors } = state;
    let data = {
      article: {
        title,
        description,
        body,
        tagList,
      },
    };
    if (!title) {
      return dispatch({
        type: "errors",
        payload: { ...errors, title: "Title cant be empty" },
      });
    }
    if (!description) {
      return dispatch({
        type: "errors",
        payload: { ...errors, description: "Description cant be empty" },
      });
    }
    if (!body) {
      return dispatch({
        type: "errors",
        payload: { ...errors, body: "Body cant be empty" },
      });
    }
    if (!tagList) {
      return dispatch({
        type: "errors",
        payload: { ...errors, tagList: "Tag List cant be empty" },
      });
    }

    fetch(articlesURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Token ${user.token}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => Promise.reject(errors));
        }
        return res.json();
      })
      .then(({ article }) => {
        dispatch({ type: "errors", payload: "" });
        props.history.push(`/article/${article.slug}`);
      })
      .catch((errors) =>
        dispatch({
          type: "errors",
          payload: { ...errors, common: "Unable to Create New Article!!!" },
        })
      );
  }
  function handleEdit(event) {
    let { title, description, body, tagList } = state;
    event.preventDefault();
    let data = {
      article: {
        title,
        description,
        body,
        tagList,
      },
    };
    Object.keys(data.article).forEach((key) => {
      if (data.article[key] === "") {
        delete data.article[key];
      }
    });

    fetch(articlesURL + `/${props.location.state.article.slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Token ${user.token}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => Promise.reject(errors));
        }
        return res.json();
      })
      .then(({ article }) => {
        dispatch({ type: "errors", payload: "" });
        props.history.push(`/article/${article.slug}`);
      })
      .catch((errors) =>
        dispatch({
          type: "errors",
          payload: { ...state.errors, common: "Unable to Edit Article!!!" },
        })
      );
  }

  let { title, description, body, tagList, errors } = state;
  if (errors.common) {
    return (
      <p className="min-h-screen py-8 text-center text-2xl text-red-500">
        {errors.common}
      </p>
    );
  }
  return (
    <form
      action=""
      className="sm:container-md container-mobile flex w-full flex-col pt-4 pb-20 sm:w-1/2"
      onSubmit={props.location.state ? handleEdit : handleSubmit}
    >
      <input
        type="text"
        name="title"
        placeholder="Article Title"
        className={`border-1 my-2 mt-16 rounded-md border-solid border-slate-400 px-6
           py-2 text-xl  focus:outline-blue-300 ${
             errors.title && "border-red-400"
           }`}
        onChange={handleChange}
        value={title}
      />
      <span className="mx-auto text-sm text-red-500">{errors.title}</span>
      <input
        type="text"
        name="description"
        placeholder="What's this article about?"
        className={`border-1 my-2 rounded-md border-solid border-slate-400 px-6
           py-2 focus:outline-blue-300 ${
             errors.description && "border-red-400"
           }`}
        onChange={handleChange}
        value={description}
      />
      <span className="mx-auto text-sm text-red-500">{errors.description}</span>

      <textarea
        type="text"
        name="body"
        placeholder="Write your article (in markdown)"
        rows="10"
        className={` border-1 my-2 rounded-md border-solid border-slate-400 px-6
           py-2 focus:outline-blue-300 ${errors.body && "border-red-400"}`}
        onChange={handleChange}
        value={body}
      ></textarea>
      <span className="mx-auto text-sm text-red-500">{errors.body}</span>

      <input
        type="text"
        name="tagList"
        placeholder="Enter Tags"
        className={`border-1 my-2 rounded-md border-solid border-slate-400 px-6 py-2 focus:outline-blue-300 ${
          errors.tagList && "border-red-400"
        }`}
        onChange={handleChange}
        value={tagList}
      />
      <span className="mx-auto text-sm text-red-500">{errors.tagList}</span>

      <input
        type="submit"
        value={props.location.state ? "Update Article" : "Publish Article"}
        className="mt-4 block cursor-pointer rounded-md bg-amber-500 px-6 py-2
      text-lg text-white disabled:cursor-not-allowed disabled:bg-gray-400 sm:mr-0 sm:ml-auto sm:inline-block"
      />
    </form>
  );
}

export default withRouter(NewPost);
