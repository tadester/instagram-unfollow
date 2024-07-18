
const axios = require('axios');
const User = require('../models/User');

exports.getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const followersResponse = await axios.get(`https://api.instagram.com/v1/users/self/followed-by?access_token=${user.accessToken}`);
    const followingResponse = await axios.get(`https://api.instagram.com/v1/users/self/follows?access_token=${user.accessToken}`);

    const followers = followersResponse.data.data;
    const following = followingResponse.data.data;

    res.json({ followers, following });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const unfollowResponse = await axios.post(`https://api.instagram.com/v1/users/${req.params.userId}/relationship`, {
      action: 'unfollow',
      access_token: user.accessToken
    });

    res.json({ success: true, message: 'User unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unfollow user' });
  }
};
