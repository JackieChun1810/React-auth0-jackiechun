import React, { useState, useEffect } from "react";
import { Route } from "react-router-dom";
import { Redirect, useHistory } from "react-router";
import Home from "./Home";
import Profile from "./Profile";
import Nav from "./Nav";
import Auth from "./Auth/Auth";
import Callback from "./Callback";
import Public from "./Public";
import Private from "./Private";
import Courses from "./Courses";
import SercureRoute from "./SercureRoute";
import AuthContext from "./Auth/AuthContext";
function App() {
  const history = useHistory();
  const auth = new Auth(history);
  const [tokenRenewalComplete, setTokenRenewalComplete] = useState(false);
  useEffect(() => {
    auth.renewToken(() => setTokenRenewalComplete(true));
  });

  // Show loading message until token renewal check is completed
  if (!tokenRenewalComplete) return "Loading....";
  return (
    <AuthContext.Provider value={auth}>
      <Nav auth={auth} />
      <div className="body">
        <Route
          path="/"
          exact
          render={(props) => <Home auth={auth} {...props} />}
        />
        <Route
          path="/callback"
          exact
          render={(props) => <Callback auth={auth} {...props} />}
        />
        <SercureRoute path="/profile" exact component={Profile} />
        <SercureRoute path="/private" exact component={Private} />
        <SercureRoute
          path="/courses"
          exact
          scopes={["read:courses"]}
          component={Courses}
        />
        <Route
          path="/public"
          exact
          render={(props) => <Public auth={auth} {...props} />}
        />
      </div>
    </AuthContext.Provider>
  );
}

export default App;
