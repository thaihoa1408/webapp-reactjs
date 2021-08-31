import React from "react";
import { Redirect, Route } from "react-router-dom";
import { getSiteid, getToken, getUser } from "./Common";

function PublicRoute({ component: Component, ...rest }) {
  let siteid = getSiteid();
  var user = getUser();
  return (
    <Route
      {...rest}
      render={(props) => {
        return !getToken() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: `/dashboard/site-monitor/siteview/${siteid}`,
            }}
          />
        );
      }}
    />
  );
}

export default PublicRoute;
