module.exports = {
    secret: "supersecret",
    jwtExpiration: 36000,           // 1 hour
    jwtRefreshExpiration: 86400,   // 24 hours
  
    /* for test */
    // jwtExpiration: 60,          // 1 minute
    // jwtRefreshExpiration: 300,  // 2 minutes
  };