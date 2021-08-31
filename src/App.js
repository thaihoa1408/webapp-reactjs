import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import LoginPage from "./components/login-page/LoginPage";
import { BrowserRouter, Switch } from "react-router-dom";
import PublicRoute from "./components/Utils/PublicRoute";
import PrivateRoute from "./components/Utils/PrivateRoute";
import Dashboard from "./components/Dashboard/Dashboard";
import { useEffect, useState } from "react";
import config from "./config.json";
import {
  getToken,
  removeUserSession,
  setUserSession,
} from "./components/Utils/Common";
import ForgetPassword from "./components/forget-password-page/ForgetPassword";
import ResetPassword from "./components/reset-password-page/ResetPassword";

function App() {
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      return;
    }
    axios
      .get(`${config.SERVER_URL}/verifyToken?token=${token}`)
      .then((response) => {
        setUserSession(response.data.accessToken, response.data.user);
        setAuthLoading(false);
      })
      .catch((error) => {
        removeUserSession();
        setAuthLoading(false);
      });
  }, []);
  if (authLoading && getToken()) {
    return <div className="content">Checking Authentication...</div>;
  }
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <PublicRoute exact path="/" component={LoginPage} />
          <PublicRoute
            path="/public/forget-password"
            component={ForgetPassword}
          />
          <PublicRoute path="/public/reset/:token" component={ResetPassword} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
