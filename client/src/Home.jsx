import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get the token from local storage
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // If no token, redirect to login
      return;
    }

    // Fetch user details from the backend
    axios
    
    .get("http://localhost:3001/getUser", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        setUserDetails(response.data); // Set user data
      })
      .catch((error) => {
        console.error(error);
        navigate("/login"); // Redirect if there is any error
      });
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center text-gray-800">Welcome to your Dashboard!</h2>

        {userDetails ? (
          <div className="mt-6 space-y-6">
            <div className="text-center">
              <p className="text-lg text-gray-700">Name: {userDetails.name}</p>
              <p className="text-lg text-gray-700">Email: {userDetails.email}</p>
              
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => navigate("/edit-profile")}
              >
                Edit Profile
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/login"); // Logout user
                }}
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p>Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;