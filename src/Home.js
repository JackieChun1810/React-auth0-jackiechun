import React, { Component } from "react";
import { Link } from "react-router-dom";

class Home extends Component {
  render() {
    const { login, isAuthenticated } = this.props.auth;
    return (
      <div>
        <h1>It's Home</h1>
        {isAuthenticated() ? (
          <Link to="/profile">Profile</Link>
        ) : (
          <button onClick={() => login()}>Log in</button>
        )}
      </div>
    );
  }
}

export default Home;
