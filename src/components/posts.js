import React, { useEffect, useState } from "react";
import http from "../services/httpService";
import config from "../config.json";

const Users = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    const { data } = await http.get(config.apiEndpoint);
    setPosts(data);
  };

  // const handleAdd = async () => {
  //   const obj = { title: "a", body: "b" };
  //   const { data: post } = await http.post(config.apiEndpoint, obj);
  //   console.log(post);

  //   const data = [post, ...posts];
  //   console.log(data);
  //   setPosts(data);
  // };

  const handleUpdate = async (post) => {
    post.title = "Updated";
    const data = [...posts];
    const index = data.indexOf(post);
    data[index] = { ...post };
    setPosts(data);

    await http.put(`${config.apiEndpoint}/${post.id}`, post);
    console.log(post);
  };

  const handleDelete = async (post) => {
    const originalPosts = posts;
    const data = posts.filter((p) => p.id !== post.id);
    console.log(data);
    setPosts(data);

    try {
      await http.delete(`${config.apiEndpoint}/${post.id}`);
      console.log(post);
      //to check this optimistic updating uncomment error statement
      // throw new Error("");
    } catch (ex) {
      if (ex.response && !ex.response.status === 404) {
        console.log(ex.response);
        alert("This post has already been deleted!");
      }

      setPosts(originalPosts);
    }
  };

  return (
    <>
      {/* <button className="btn btn-primary m-2" onClick={() => handleAdd()}>
        Add
      </button> */}
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>{post.title}</td>
              <td>
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => handleUpdate(post)}
                >
                  Update
                </button>
              </td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(post)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Users;
