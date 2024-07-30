import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Navbar from "./Navbar";
import checkAuth from "./auth/checkAuth";
import "./listvideos.css";
function Myplan() {
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user && user.token) {
      fetchCurrentPlan();
    }
  }, [user]);

  function fetchCurrentPlan() {
    axios.get('http://localhost:8000/api/current_plan', {
      headers: { Authorization: `Token ${user.token}` }
    })
    .then(response => {
      setPlan(response.data);
      setError(null);
    })
    .catch(error => {
      console.error('Error fetching current plan:', error);
      if (error.response && error.response.status === 404) {
        setError('No active subscription found.');
      } else {
        setError('An error occurred while fetching the plan.');
      }
      setPlan(null);
    });
  }

  if (!plan && !error) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1 className="my-4"style={{ color: " rgba(37, 99, 130, 0.9)" }}>Current Plan</h1>
        <div className="row">
          <div className="col-md-4">
            <div className="card mb-5 h-100">
              <div className="card-body d-flex flex-column">
                {plan ? (
                  <>
                    {plan.plan && (
                      <>
                        <h5 className="card-title text-center">{plan.plan.title}</h5>
                        <p className="card-text flex-grow-1">{plan.plan.description}</p>
                        <p className="card-text flex-grow-1">Duration: {plan.plan.duration} days</p>
                        <p className="card-text"><strong>${plan.plan.price}</strong></p>
                        <p className="card-text"><strong>Subscribed Date: {new Date(plan.subscribed_at).toLocaleDateString()}</strong></p>
                        <p className="card-text"><strong>Expiry Date: {new Date(plan.ExpiryDate).toLocaleDateString()}</strong></p>
                      </>
                    )}
                  </>
                ) : (
                  <p className="text-danger">{error}</p>
                )}
              </div>
            </div>
          </div>
        </div>

       </div>
    </div>
  );
}

export default checkAuth(Myplan);
