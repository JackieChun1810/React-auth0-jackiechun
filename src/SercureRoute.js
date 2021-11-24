import React, { useContext } from "react";
import { Route } from "react-router";
import PropTypes from "prop-types";
import AuthContext from "./Auth/AuthContext";
const SercureRoute = (props) => {
  const { component: Component, scopes, ...rest } = props;
  const auth = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={(props) => {
        // 1. Redirect to login if not logged in
        if (!auth.isAuthenticated()) {
          return auth.login();
        }

        // 2 Display message if user lacks required scope(s)
        if (scopes.length > 0 && !auth.userHasScope(scopes)) {
          return (
            <h1>
              Unauthorized - You need following scope(s) to view this page:{" "}
              {scopes.join(",")}
            </h1>
          );
        }

        // 3 Render component
        return <Component auth={auth} {...props} />;
      }}
    />
  );
};

SercureRoute.propTypes = {
  component: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  scopes: PropTypes.array,
};

SercureRoute.defaultProps = {
  scopes: [],
};

export default SercureRoute;
