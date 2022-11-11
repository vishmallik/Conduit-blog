import React from "react";
import { withRouter } from "react-router";
import { articlesURL } from "../utils/urls";

class NewPost extends React.Component {
  state = {
    title: "",
    description: "",
    body: "",
    tagList: null,
    errors: {
      title: "",
      description: "",
      body: "",
      tagList: "",
    },
  };
  // componentDidUpdate(prevProps,prevState){
  //   switch()
  // }
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
          },
        });
        this.props.history.push(`/article/${article.slug}`);
      })
      .catch((errors) => console.log(errors));
  };
  render() {
    let { title, description, body, tagList, errors } = this.state;
    return (
      <form
        action=""
        className="container-md flex flex-col w-1/2"
        onSubmit={this.handleSubmit}
      >
        <input
          type="text"
          name="title"
          placeholder="Article Title"
          className={`text-xl px-6 py-2 my-2 mt-16 rounded-md border-1
           border-solid border-slate-400  focus:outline-blue-300 ${
             errors.title ? "border-red-400" : ""
           }`}
          onChange={this.handleChange}
          value={title}
        />
        <span className="text-sm mx-auto text-red-500">{errors.title}</span>
        <input
          type="text"
          name="description"
          placeholder="What's this article about?"
          className={`px-6 py-2 my-2 rounded-md border-1 border-solid
           border-slate-400 focus:outline-blue-300 ${
             errors.description ? "border-red-400" : ""
           }`}
          onChange={this.handleChange}
          value={description}
        />
        <span className="text-sm mx-auto text-red-500">
          {errors.description}
        </span>

        <textarea
          type="text"
          name="body"
          placeholder="Write your article (in markdown)"
          rows="10"
          className={` px-6 py-2 my-2 rounded-md border-1 border-solid
           border-slate-400 focus:outline-blue-300 ${
             errors.body ? "border-red-400" : ""
           }`}
          onChange={this.handleChange}
          value={body}
        ></textarea>
        <span className="text-sm mx-auto text-red-500">{errors.body}</span>

        <input
          type="text"
          name="tagList"
          placeholder="Enter Tags"
          className={`px-6 py-2 my-2 rounded-md border-1 border-solid border-slate-400 focus:outline-blue-300 ${
            errors.tagList ? "border-red-400" : ""
          }`}
          onChange={this.handleChange}
          value={tagList}
        />
        <span className="text-sm mx-auto text-red-500">{errors.tagList}</span>

        <input
          type="submit"
          value="Publish Article"
          className="bg-amber-500 mr-0 ml-auto px-6 py-2 mt-4 text-white
      rounded-md text-lg cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-400 "
          disabled={!title || !description || !body || !tagList}
        />
      </form>
    );
  }
}
export default withRouter(NewPost);
