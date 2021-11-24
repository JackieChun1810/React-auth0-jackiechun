import React, { useEffect, useState } from "react";

const Public = (props) => {
  const [message, setMessage] = useState("");
  useEffect(() => {
    fetch("/public")
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

export default Public;
