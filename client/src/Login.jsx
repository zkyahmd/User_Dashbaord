import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/login", { email, password })
      .then((result) => {
        console.log(result);
        if (result.data.token) {
          localStorage.setItem("token", result.data.token); // save token
          navigate("/home"); // go to dashboard
        } else {
          alert(result.data.message || "Login failed");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Login error");
      });
  };

  return (
    <div className="flex justify-center items-center bg-gray-200 h-screen">
      <div className="bg-white p-6 rounded-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              autoComplete="off"
              name="email"
              className="form-input mt-2 w-full p-2 border border-gray-300 rounded-md"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block font-medium">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Create Password"
              autoComplete="off"
              name="password"
              className="form-input mt-2 w-full p-2 border border-gray-300 rounded-md"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="bg-green-500 text-white w-full py-2 rounded-md hover:bg-green-600">
            Login
          </button>
          <p className="mt-4 text-center">Don't have an account?</p>
        </form>
        <Link to="/register" className="block text-center mt-2 text-blue-500 hover:text-blue-600">
          Register
        </Link>
      </div>
    </div>
  );
}

export default Login;
