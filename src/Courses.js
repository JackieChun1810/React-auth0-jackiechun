import React, { useEffect, useState } from "react";

const Courses = (props) => {
  const { getAccessToken } = props.auth;
  const [courses, setCoures] = useState([]);
  useEffect(() => {
    fetch("/courses", {
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error("Network response is not ok");
      })
      .then((response) => {
        setCoures(response.courses);
      })
      .catch((err) => setCoures([]));

    fetch("/admin", {
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error("Network response is not ok");
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => setCoures([]));
  }, []);
  return (
    <ul>
      {courses.map((course) => {
        return <li key={course.id}>{course.title}</li>;
      })}
    </ul>
  );
};

export default Courses;
