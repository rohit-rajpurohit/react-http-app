import React, { Component } from "react";
import http from "./services/httpService";
import config from "./config.json";
import "./App.css";

class App extends Component {
  state = {
    posts: [],
  };

  async componentDidMount() {
    //promise is initially in pending state changes to resolved(success) or rejected(failure) once the opertaion is completed
    //const promise = http.get(config.apiEndpoint);
    //const response = await promise;
    //console.log(response);
    const { data: posts } = await http.get(config.apiEndpoint);
    this.setState({ posts });
  }

  handleAdd = async () => {
    const obj = { title: "a", body: "b" };
    const { data: post } = await http.post(config.apiEndpoint, obj);
    console.log(post);

    const posts = [post, ...this.state.posts];
    this.setState({ posts });
  };

  handleUpdate = async (post) => {
    post.title = "UPDATED";
    //use put to update whole object
    await http.put(`${config.apiEndpoint}/${post.id}`, post);
    console.log(post);
    //use patch to update specific properties of an object
    // await http.patch(`${config.apiEndpoint}/${post.id}`, { title: post.title });
    //console.log(post);

    const posts = [...this.state.posts];
    const index = posts.indexOf(post);
    posts[index] = { ...post };
    this.setState({ posts });
  };

  handleDelete = async (post) => {
    const originalPosts = this.state.posts;
    const posts = this.state.posts.filter((p) => p.id !== post.id);
    this.setState({ posts });

    try {
      await http.delete(`${config.apiEndpoint}/${post.id}`);
      console.log(post);
      //to check this optimistic updating uncomment error statement
      // throw new Error("");
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        console.log(ex.response);
        alert("This post has already been deleted!");
      }

      this.setState({ posts: originalPosts });
    }
  };

  render() {
    return (
      <React.Fragment>
        <button className="btn btn-primary m-2" onClick={this.handleAdd}>
          Add
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.state.posts.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => this.handleUpdate(post)}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => this.handleDelete(post)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default App;
