import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as TiIcons from "react-icons/ti";
import "./ResetPassword.css";
import axios from "axios";
import config from "../../config.json";
export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const handleSubmit = () => {
    if (password === "" || confirmPassword === "") {
      setError("Password is required");
    } else if (password != confirmPassword) {
      setError("Entered passwords do not match !");
    } else {
      axios
        .post(`/reset_password_email`, {
          token: token,
          password: password,
        })
        .then((response) => {
          setStatus(response.data.message);
          setError("");
        })
        .catch((error) => {
          setError(error.response.data.message);
          setStatus("");
        });
    }
  };
  return (
    <div className="LoginPage">
      <div className="BoxContainer">
        <div className="TopContainer">
          <div className="BackDrop" />
          <div className="HeaderContainer">
            <h2 className="HeaderText">Reset</h2>
            <h2 className="HeaderText">Password</h2>
          </div>
        </div>
        <div className="InnerContainer">
          <div className="text">New Password</div>
          <input
            type="password"
            placeholder="Enter your new password"
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
              setStatus("");
            }}
          />
          <div className="text">Confirm New Password</div>
          <input
            type="password"
            placeholder="Enter your password again"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError("");
              setStatus("");
            }}
          />
          <div className={error != "" ? "error" : "reset-password-status"}>
            {error}
            {status}
          </div>
          <div className="login" onClick={handleSubmit}>
            Submit
          </div>
          <div className="back-to-login">
            <TiIcons.TiArrowBack />
            <Link to="/" className="back-to-login-link">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
