import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import backgroundImage1 from './components/images/img11.jpg';
import backgroundImage3 from './components/images/img13.jpg';
import aboutUsImage from './components/images/img14.jpg'; // Add an image for the about us section
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="content">
        <div className="text-section">
          <h1 className="title">World's Best Movies</h1>
          <p className="description">
            Silent classics, noirs, space operas, and everything in between: Somehow we managed to rank the best movies of all time.
          </p>
          <Link to="/listvideos" className="btn btn-lg">
            EXPLORE VIDEOS
          </Link>
        </div>
        <div className="image-section">
          <Carousel
            autoPlay
            interval={3000}
            infiniteLoop
            showThumbs={false}
            showStatus={false}
            showIndicators={false}
          >
            <div>
              <img src={backgroundImage1} alt="Background 1" />
            </div>
            <div>
              <img src={backgroundImage3} alt="Background 3" />
            </div>
          </Carousel>
        </div>
      </div>
      <div className="about-us">
        <div className="about-us-content">
          <div className="about-us-text">
            <h2>Need to know more about this website? We got you.</h2>
            <p>
              Welcome to <strong>World's Best Movies</strong>, your ultimate destination for the greatest films ever made. From the silent classics that pioneered the art of cinema to the gripping noirs that defined an era, and the epic space operas that expanded our imaginations, we've curated an unparalleled collection that celebrates the magic of movies.
            </p>
            <p>
              At <strong>World's Best Movies</strong>, we understand that film is more than just entertainment; it's an experience, a form of art that tells stories, evokes emotions, and transports us to different worlds. Our team of movie enthusiasts and experts has meticulously ranked the best movies of all time, ensuring that every film featured on our platform holds a special place in cinematic history.
            </p>
            <p>
              Whether you're a fan of heartwarming dramas, edge-of-your-seat thrillers, timeless romances, or mind-bending sci-fi adventures, you'll find a diverse selection that caters to all tastes. Dive deep into our curated lists and discover hidden gems, revisit old favorites, and explore new masterpieces that have left an indelible mark on audiences worldwide.
            </p>
            <p>
              Join us on this cinematic journey and celebrate the best of the best. <strong>World's Best Movies</strong> is here to guide you through the vast and wonderful world of film, where every viewing is an unforgettable experience.
            </p>
          </div>
          <div className="about-us-image" style={{ backgroundImage: `url(${aboutUsImage})`, backgroundColor: '#f0f0f0' }}></div>
        </div>
      </div>
      <div className="contact-us">
        <div className="contact-us-content">
          <h2>Contact Us</h2>
          <p>We'd love to hear from you! Reach out to us on any of the following platforms:</p>
          <div className="social-icons">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f" style={{color:'blue'}}></i>
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter" style={{color:'black'}}></i>
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram" style={{color:'#E1306C'}}></i>
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin-in" style={{color:'blue'}}></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
