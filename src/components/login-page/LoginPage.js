import React, { useState } from "react";
import axios from "axios";
import "./LoginPage.css";
import { getToken, setSiteidSession, setUserSession } from "../Utils/Common";
import { removeUserSession } from "../Utils/Common";
import { Link } from "react-router-dom";
import config from "../../config.json";
function LoginPage(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleLogin = () => {
    setError(null);
    axios
      .post(`/api/auth/signin`, {
        username: username,
        password: password,
      })
      .then((response) => {
        setUserSession(response.data.accessToken, response.data.user);
        setTimeout(function () {
          removeUserSession();
          props.history.push("/");
        }, (response.data.time_expire - response.data.time_start) * 1000);
        setSiteidSession(response.data.user.siteid[0]);
        props.history.push(
          `/dashboard/site-monitor/siteview/${response.data.user.siteid[0]}`
        );
      })
      .catch((error) => {
        if (error.response.status === 401 || error.response.status === 404) {
          setError(error.response.data.message);
        } else {
          setError("something went wrong.Please try again later.");
        }
      });
    //props.history.push("/dashboard");
  };
  return (
    <div className="LoginPage">
      <div className="BoxContainer">
        <div className="TopContainer">
          <div className="BackDrop" />
          <div className="HeaderContainer">
            <h2 className="HeaderText">Welcome</h2>
            <h2 className="HeaderText">Back</h2>
            <h5 className="SmallText">Please sign in to continue!</h5>
          </div>
        </div>
        <div className="InnerContainer">
          <div className="text">Username</div>
          <input
            type="text"
            placeholder="Enter your username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="text">Password</div>
          <input
            type="password"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="error">{error}</div>
          <div className="login" onClick={handleLogin}>
            Login
          </div>
          <Link to="/public/forget-password" className="forget-password-link">
            Forget Password ?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
