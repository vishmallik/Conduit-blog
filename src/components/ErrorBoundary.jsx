import { Component } from "react";
export default class ErrorBoundary extends Component {
  state = {
    hasError: false,
  };
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <center className="min-h-screen bg-amber-300">
          <h2 className="py-20 text-4xl font-bold">
            Oopss..Something Went Wrong!!!
          </h2>
          <a href="/">
            <button className="rounded-md bg-lime-500 py-4 px-6 text-xl text-white">
              Back to home
            </button>
          </a>
        </center>
      );
    }
    return this.props.children;
  }
}
