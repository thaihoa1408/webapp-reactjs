import React, { useState } from "react";
import "./CreateUser.css";
import axios from "axios";
import config from "../../../../config.json";
function CreateUser(props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleSignup = () => {
    setStatus(null);
    setError(null);
    setLoading(true);
    if (!username) {
      setError("username must be filled!");
      setLoading(false);
      return;
    }
    if (!email) {
      setError("email must be filled!");
      setLoading(false);
      return;
    }
    if (!password) {
      setError("password must be filled!");
      setLoading(false);
      return;
    }
    if (password != confirmpassword) {
      setError("password didn't match. Try again!");
      setLoading(false);
      return;
    }
    axios
      .post(`/api/auth/signup`, {
        username: username,
        email: email,
        password: password,
      })
      .then((response) => {
        setLoading(false);

        setStatus("user has been created successfully!");
        document.getElementById("myInput1").value = "";
        document.getElementById("myInput2").value = "";
        document.getElementById("myInput3").value = "";
        document.getElementById("myInput4").value = "";
      })
      .catch((error) => {
        setLoading(false);
        setError(error.response.data.message);
      });
  };
  return (
    /*<div className="createuser-box">
      <div className="create-user-header">Create new user</div>
      <div className="create-user-body">
        <div>
          Username
        <br />
          <input
            id="myInput1"
            type="text"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          Email
        <br />
          <input
            id="myInput2"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          Password
        <br />
          <input
            id="myInput3"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <div className="error">{error}</div>}
        {status && <div className="status">{status}</div>}
        <input
          type="button"
          value={loading ? "Loading..." : "Create"}
          disabled={loading}
          onClick={handleSignup}
        />
      </div>
    </div>*/
    <div className="create-user-body">
      <div className="create-user-body-row-1">
        <h2>Create new user</h2>
      </div>
      <div className="create-user-body-row-2">
        <div>
          <div>Username:</div>
          <input
            id="myInput1"
            type="text"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <div>Email:</div>
          <input
            id="myInput2"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <div>Password:</div>
          <input
            id="myInput3"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <div>Confirm password:</div>
          <input
            id="myInput4"
            type="password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
        </div>
      </div>
      <div className="create-user-body-row-3">
        <input
          type="button"
          value={loading ? "Loading..." : "Create"}
          disabled={loading}
          onClick={handleSignup}
        />
        {error && <div className="error">{error}</div>}
        {status && <div className="status">{status}</div>}
      </div>
    </div>
  );
}

export default CreateUser;
