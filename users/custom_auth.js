const axios = require('axios');

module.exports = async (userContext, events, done) => {
  try {
    // Implement your custom authentication logic here
    const response = await axios.post('http://localhost:3001/auth', {
      username: 'admin3',
      password: 'admin3',
    });

    // Extract the authentication token from the response
    const authToken = response.data.token;

    // Attach the obtained token to the userContext, which will be accessible as a placeholder in the test script
    userContext.vars.authToken = authToken;

    return done();
  } catch (error) {
    console.error('Error during authentication:', error.message);
    return done(error);
  }
};
