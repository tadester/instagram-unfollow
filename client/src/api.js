import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const fetchUserData = () => API.get('/user/data');
export const unfollowUser = (userId) => API.post(`/user/unfollow/${userId}`);
