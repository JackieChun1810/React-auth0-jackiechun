import React, { useEffect, useState } from "react";

const Private = (props) => {
  const { getAccessToken } = props.auth;
  console.log(getAccessToken());
  const [message, setMessage] = useState("");
  useEffect(() => {
    fetch("/private", {
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error("Network response is not ok");
      })
      .then((response) => {
        setMessage(response.message);
      })
      .catch((err) => setMessage(err.message));
  }, []);
  return <p>{message}</p>;
};

export default Private;
