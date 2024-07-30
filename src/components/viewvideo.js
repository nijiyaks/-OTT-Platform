import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Navbar from './Navbar';

function ViewVideo() {
  const { postId } = useParams();
  const [video, setVideo] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVideo();
  }, []);

  function fetchVideo() {
    if (!user || !user.token) {
      alert('You need to log in to view this video.');
      navigate('/login'); // Redirect to login page
      return;
    }

    axios.get(`http://localhost:8000/api/viewvideo/${postId}`, {
      headers: { Authorization: `Token ${user.token}` }
    })
    .then(response => {
      setVideo(response.data);
    })
    .catch(error => {
      console.error('Error fetching video details:', error);
      if (error.response && error.response.status === 403) {
        alert('You need an active subscription to view this video.');
        navigate('/listplan'); // Redirect to subscription page
      } else if (error.response && error.response.status === 401) {
        alert('Your session has expired. Please log in again.');
        navigate('/login'); // Redirect to login page
      } else {
        alert('Error fetching video details.');
      }
    });
  }
  return (
    <div>
      <Navbar />
      <div className="container">
        <h1 className="my-4 mt-4 text-center" style={{ color: " rgba(37, 99, 130, 0.9)" }}>Videos</h1>
        {video ? (
          <div>
            

        <video width="640" height="360" controls>
        <source src={`http://localhost:8000${video.video_file}`} type="video/mp4" />

        Your browser does not support the video tag.
      </video>
      <p>{video.description}</p>
        </div>
         
          ) : (
          <p>Loading video details...</p>
        )}
        </div>
          </div>    
  
  );
}

export default ViewVideo;






