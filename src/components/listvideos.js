import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./Navbar";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import checkAuth from "./auth/checkAuth";

function ListVideo() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [search, page]);

  function fetchPosts() {
    axios.get(`http://localhost:8000/api/listvideo`, {
      params: { search: search, page: page },
      headers: { Authorization: `Token ${user.token}` }
    })
    .then(response => {
      setPosts(response.data.videos);
      setTotalPages(response.data.total_pages);
    })
    .catch(error => {
      console.error('Error fetching posts:', error);
    });
  }

  function checkSubscriptionAndNavigate(postId) {
    if (!user || !user.token) {
      alert('You need to log in to view this video.');
      navigate('/login');
      return;
    }

    axios.get('http://localhost:8000/api/check_subscription', {
      headers: { Authorization: `Token ${user.token}` }
    })
    .then(response => {
      if (response.data.has_active_subscription) {
        navigate(`/viewvideo/${postId}`);
      } else {
        alert('You need an active subscription to view this video.');
        navigate('/listplan');
      }
    })
    .catch(error => {
      console.error('Error checking subscription:', error);
      alert('Error checking subscription.');
    });
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1 className="my-4 mt-4 text-center" style={{ color: " rgba(37, 99, 130, 0.9)" }}>Videos</h1>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search videos..."
            value={search}
            onChange={handleSearchChange}
            className="form-control"
          />
        </div>

        <div className="row">
          {posts.map((post) => (
            <div key={post.id} className="col-md-4">
              <div className="card mb-5">
                <img
                  className="card-img-top"
                  style={{ height: 310 }}
                  src={`http://localhost:8000${post.thumbnail}`}
                  alt={post.title}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{post.title}</h5>
                  <button onClick={() => checkSubscriptionAndNavigate(post.id)} className="btn btn-danger" >Watch Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <nav aria-label="Page navigation example">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(page - 1)} aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
                <span className="sr-only">Previous</span>
              </button>
            </li>
            {[...Array(totalPages).keys()].map((num) => (
              <li key={num + 1} className={`page-item ${page === num + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(num + 1)}>{num + 1}</button>
              </li>
            ))}
            <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(page + 1)} aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
                <span className="sr-only">Next</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default checkAuth(ListVideo);
