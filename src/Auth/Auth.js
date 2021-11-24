import auth0 from "auth0-js";

// Stored outside class since private
// eslint-disable-next-line no-unused-vars
let _idToken = null;
let _accessToken = null;
let _scopes = null;
let _expiresAt = null;

export default class Auth {
  constructor(history) {
    this.history = history;
    this.userProfile = null;
    this.requestedScopes = "openid profile email read:courses";
    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      responseType: "token id_token",
      scope: this.requestedScopes,
    });
  }

  login = () => {
    this.auth0.authorize();
  };

  handleAuthentication = () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        this.history.push("/");
      } else if (err) {
        this.history.push("/");
        alert(`Error: ${err.error}. Check the console for further details.`);
        console.log(err);
      }
    });
  };

  setSession = (authResult) => {
    // Set the time that the access token will expire
    _expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
    // If there is a value on the `scope` param from the authResult,
    // use it to set scopes in the sessions for the user. Otherwise
    // use the scopes as requested. If no scope were requested
    // set it to nothing
    _scopes = authResult.scope || this.requestedScopes || "";
    // Can use jwt-decode to read the user's data out from ID Token JWT
    _idToken = authResult.idToken;
    _accessToken = authResult.accessToken;
    this.scheduleTokenRenewal();
  };

  isAuthenticated() {
    return _expiresAt > new Date().getTime();
  }

  logout = () => {
    this.auth0.logout({
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      redirectUri: "http://localhost:3000",
    });
  };

  getAccessToken = () => {
    if (!_accessToken) {
      throw new Error("No access token");
    }
    return _accessToken;
  };

  getProfile = (cb) => {
    if (this.userProfile) return cb(this.userProfile);
    this.auth0.client.userInfo(this.getAccessToken(), (err, profile) => {
      if (profile) this.userProfile = profile;
      cb(profile, err);
    });
  };

  userHasScope(scopes) {
    const grantedScopes = (_scopes || "").split(" ");
    return scopes.every((scope) => grantedScopes.includes(scope));
  }

  renewToken(cb) {
    this.auth0.checkSession({}, (err, result) => {
      if (err) {
        console.log(`Error: ${err.error} - ${err.error_description}`);
      } else {
        this.setSession(result);
      }
      if (cb) cb(err, result);
    });
  }

  scheduleTokenRenewal() {
    const delay = _expiresAt - Date.now();
    if (delay > 0) setTimeout(() => this.renewToken, delay);
  }
}
