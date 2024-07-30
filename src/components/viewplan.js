import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./Navbar";
import axios from "axios";

function ViewPlan() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (postId) {
      fetchPlan();
    }
  }, [postId, user]);

  function fetchPlan() {
    axios.get(`http://localhost:8000/api/viewplan/${postId}`)
      .then(response => {
        setPost(response.data);
      })
      .catch(error => {
        console.error('Error fetching plan details:', error);
      });
  }

  const handleSubscribe = () => {
    if (!user || !user.token) {
      console.error('User is not defined or does not have a token');
      return;
    }
  
    const requestData = {
      user: user.userId,
      plan: postId
    };
  
    axios.post('http://localhost:8000/api/subscribe/', requestData, {
      headers: { Authorization: `Token ${user.token}` }
    })
    .then(response => {
      console.log('Subscription successful:', response.data);
      alert("Subscribed successfully!");
      navigate('/listvideos'); // Navigate to the desired page after success
    })
    .catch(error => {
      console.error('Error subscribing:', error);
  
      let errorMessage = 'An error occurred while subscribing to the plan.';
      if (error.response) {
        if (error.response.status === 400 && error.response.data.error === 'User already has an active subscription.') {
          errorMessage = 'You already have an active subscription.';
        } else if (error.response.data && error.response.data.message) {
          errorMessage = `Error: ${error.response.data.message}`;
        } else {
          errorMessage = `Error: ${error.response.status} ${error.response.statusText}`;
        }
      } else {
        errorMessage = `Error: ${error.message}`;
      }
  
      alert(errorMessage);
    });
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1 className="my-4" style={{ color: " rgba(37, 99, 130, 0.9)" }}>Plan Details</h1>
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="card mt-5">
              <div className="card-body">
                <h5 className="card-title text-center">{post.title}</h5>
                <p className="card-text text-center">{post.description}</p>
                <p className="card-text text-center">{post.duration} days</p>
                <p className="card-text text-center"><strong>${post.price}</strong></p>
                {user && (
                  <div className="mt-3 text-center">
                    <button onClick={handleSubscribe} className="btn btn-danger">Subscribe</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewPlan;
