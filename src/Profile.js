import React, { useEffect, useState } from "react";

const Profile = (props) => {
  const { getProfile } = props.auth;
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    getProfile((profile, err) => {
      setProfile(profile);
      setError(err);
    });
  }, []);
  if (!profile) return null;
  return (
    <>
      <h1>It's Profile</h1>
      <p>{profile.nickname}</p>
      <img
        style={{ maxWidth: 50, maxHeight: 50 }}
        src={profile.picture}
        alt="profile pic"
      />
      <pre>{JSON.stringify(profile, null, 2)}</pre>
    </>
  );
};

export default Profile;
