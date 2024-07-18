import logo from './logo.svg';
import './App.css';
// client/src/App.js
import React, { useState, useEffect } from 'react';
import { fetchUserData, unfollowUser } from './api';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [nonFollowers, setNonFollowers] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await fetchUserData();
        setFollowers(data.followers);
        setFollowing(data.following);

        const nonFollowersList = data.following.filter(user =>
          !data.followers.some(follower => follower.id === user.id)
        );
        setNonFollowers(nonFollowersList);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    getData();
  }, []);

  const handleUnfollow = async (userId) => {
    try {
      await unfollowUser(userId);
      setNonFollowers(nonFollowers.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error unfollowing user', error);
    }
  };

  const handleBatchUnfollow = async () => {
    for (const user of nonFollowers) {
      await handleUnfollow(user.id);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Delay to avoid rate limits
    }
  };

  return (
    <div className="container">
      <h1>Instagram Unfollower App</h1>
      <h2>Non-Followers</h2>
      <button className="btn btn-primary mb-3" onClick={handleBatchUnfollow}>Batch Unfollow</button>
      <ul className="list-group">
        {nonFollowers.map(user => (
          <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
            {user.username}
            <button className="btn btn-danger" onClick={() => handleUnfollow(user.id)}>Unfollow</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
