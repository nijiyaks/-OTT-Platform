import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./Navbar";
import axios from "axios";
import { Link } from "react-router-dom";
import checkAuth from "./auth/checkAuth";
function Listplan() {
  const [posts, setPosts] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchPosts();
  }, []);

  function fetchPosts() {
    axios.get('http://localhost:8000/api/listplans')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
      });
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1 className="my-4 text-center" style={{ color: " rgba(37, 99, 130, 0.9)" }}>Plans</h1>
        <div className="row justify-content-center">
        {posts.map((post) => (
          <div className="col-md-4"  key={post.id}>
            <div className="card mb-5 h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-center">{post.title}</h5>
                <p className="card-text flex-grow-1 text-justify text-center">
                {post.description}
</p>
                <p className="card-text text-center"><strong>{post.duration} days</strong></p>
                <p className="card-text text-center"><strong>${post.price}</strong></p>
                {user && (
                    <div className="mt-auto text-center justify-content-center">
                      <Link to={`/viewplan/${post.id}`} className="btn btn-danger">Subscribe</Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          

                ))}
        
        </div>
      </div>
    </div>
  );
}

export default checkAuth(Listplan);
