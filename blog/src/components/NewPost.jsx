import React from "react";
import { withRouter } from "react-router";
import { articlesURL } from "../utils/urls";

class NewPost extends React.Component {
  state = {
    title: "",
    description: "",
    body: "",
    tagList: "",
    errors: {
      title: "",
      description: "",
      body: "",
      tagList: "",
      common: "",
    },
  };
  componentDidMount() {
    if (this.props.location.state) {
      let { title, description, body, tagList } =
        this.props.location.state.article;
      this.setState({
        ...this.state,
        title,
        description,
        body,
        tagList,
      });
    }
  }
  handleChange = ({ target }) => {
    let { name, value } = target;
    if (name === "tagList") {
      value = value.split(",").map((tag) => tag.trim());
    }

    this.setState({
      [name]: value,
    });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    let { title, description, body, tagList } = this.state;
    let data = {
      article: {
        title,
        description,
        body,
        tagList,
      },
    };
    if (!title) {
      return this.setState({
        errors: Object.assign(this.state.errors, {
          title: "Title cant be empty",
        }),
      });
    }
    if (!description) {
      return this.setState({
        errors: Object.assign(this.state.errors, {
          description: "Description cant be empty",
        }),
      });
    }
    if (!body) {
      return this.setState({
        errors: Object.assign(this.state.errors, {
          body: "Body cant be empty",
        }),
      });
    }
    if (!tagList) {
      return this.setState({
        errors: Object.assign(this.state.errors, {
          tagList: "Tag List cant be empty",
        }),
      });
    }

    fetch(articlesURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Token ${this.props.user.token}`,
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
        this.setState({
          errors: {
            title: "",
            description: "",
            body: "",
            tagList: "",
            common: "",
          },
        });
        this.props.history.push(`/article/${article.slug}`);
      })
      .catch((errors) =>
        this.setState({
          errors: {
            ...errors,
            common: "Unable to Create New Article!!!",
          },
        })
      );
  };
  handleEdit = (event) => {
    event.preventDefault();
    let { title, description, body, tagList } = this.state;
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

    fetch(articlesURL + `/${this.props.location.state.article.slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Token ${this.props.user.token}`,
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
        this.setState({
          errors: {
            title: "",
            description: "",
            body: "",
            tagList: "",
            common: "",
          },
        });
        this.props.history.push(`/article/${article.slug}`);
      })
      .catch((errors) =>
        this.setState({
          errors: { ...errors, common: "Unable to Edit Article!!!" },
        })
      );
  };
  render() {
    let { title, description, body, tagList, errors } = this.state;
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
        onSubmit={
          this.props.location.state ? this.handleEdit : this.handleSubmit
        }
      >
        <input
          type="text"
          name="title"
          placeholder="Article Title"
          className={`border-1 my-2 mt-16 rounded-md border-solid border-slate-400 px-6
           py-2 text-xl  focus:outline-blue-300 ${
             errors.title && "border-red-400"
           }`}
          onChange={this.handleChange}
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
          onChange={this.handleChange}
          value={description}
        />
        <span className="mx-auto text-sm text-red-500">
          {errors.description}
        </span>

        <textarea
          type="text"
          name="body"
          placeholder="Write your article (in markdown)"
          rows="10"
          className={` border-1 my-2 rounded-md border-solid border-slate-400 px-6
           py-2 focus:outline-blue-300 ${errors.body && "border-red-400"}`}
          onChange={this.handleChange}
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
          onChange={this.handleChange}
          value={tagList}
        />
        <span className="mx-auto text-sm text-red-500">{errors.tagList}</span>

        <input
          type="submit"
          value={
            this.props.location.state ? "Update Article" : "Publish Article"
          }
          className="mt-4 block cursor-pointer rounded-md bg-amber-500 px-6 py-2
      text-lg text-white disabled:cursor-not-allowed disabled:bg-gray-400 sm:mr-0 sm:ml-auto sm:inline-block"
        />
      </form>
    );
  }
}
export default withRouter(NewPost);
