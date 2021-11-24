const express = require("express");
require("dotenv").config();
const jwt = require("express-jwt"); // Validate JWT and set req.user
const jwksRsa = require("jwks-rsa"); // Retrieve RSA keys from a JSON Web Key set (JWKS) endpoint
const checkScope = require("express-jwt-authz"); // Validate JWT scope

const checkJWT = jwt({
  // Dynamically provide a signing key based on the kid in header
  // and the signing keys provided by JWKS endpoint
  secret: jwksRsa.expressJwtSecret({
    cache: true, // cache the signing key
    rateLimit: true,
    jwksRequestsPerMinute: 5, // prevent attackers from requesting more than 5 per minute
    jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  // Validate audience and issuer.
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,

  // This must match the algorithm selected in the Auth0 dashboard under your app's advance settings under OAuth tab
  algorithms: ["RS256"],
});

function checkRole(role) {
  return function (req, res, next) {
    const assignedRoles = req.user["http://localhost:3000/roles"];
    if (Array.isArray(assignedRoles) && assignedRoles.includes(role)) {
      return next();
    } else {
      return res.status(401).send("Insufficient role");
    }
  };
}

const app = express();

app.get("/public", function (req, res) {
  res.json({
    message: "Hello from a public API",
  });
});

app.get("/private", checkJWT, function (req, res) {
  res.json({
    message: "Hello from a private API",
  });
});

app.get("/admin", checkJWT, checkRole("admin"), function (req, res) {
  res.json({
    message: "Hello from an admin API",
  });
});

app.get(
  "/courses",
  checkJWT,
  checkScope(["read:courses"]),
  function (req, res) {
    res.json({
      courses: [
        { id: 1, title: "Course 1" },
        { id: 2, title: "Course 2" },
      ],
    });
  }
);

app.listen(3001);
console.log("API server listening on " + process.env.REACT_APP_AUTH0_AUDIENCE);
