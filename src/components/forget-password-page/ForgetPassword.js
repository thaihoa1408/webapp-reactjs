import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as TiIcons from "react-icons/ti";
import "./ForgetPassword.css";
import config from "../../config.json";
import axios from "axios";
export default function ForgetPassword() {
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const handleSubmit = () => {
    if (email === "" || confirmEmail === "") {
      setError("Email is required !");
    } else if (email != confirmEmail) {
      setError("Entered emails do not match!");
    } else {
      axios
        .post(`/forget_password`, {
          email: email,
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
            <h2 className="HeaderText">Forget</h2>
            <h2 className="HeaderText">Password</h2>
            <h4 className="SmallText">Please enter email to continue!</h4>
          </div>
        </div>
        <div className="InnerContainer">
          <div className="text">Email:</div>
          <input
            type="text"
            placeholder="Enter your email address"
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
              setStatus("");
            }}
          />
          <div className="text">Confirm Email:</div>
          <input
            type="text"
            placeholder="Enter your email address again"
            onChange={(e) => {
              setConfirmEmail(e.target.value);
              setError("");
              setStatus("");
            }}
          />
          <div className={error != "" ? "error" : "forget-password-status"}>
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
