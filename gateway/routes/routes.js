const API_PREFIX = "api/v1";
const USER_URL = process.env.USER_URL || "http://[::1]:3001"; // Replace with your actual environment variable name
const FLOW_URL = process.env.FLOW_URL || "http://[::1]:3002";
const DEVICE_URL = process.env.FLOW_URL || "http://[::1]:3003";
const DEPARTEMENT_URL = process.env.FLOW_URL || "http://[::1]:3004";
const CAMERA_URL = process.env.CAMERA || "http://[::1]:3006";
const WEMO_URL = process.env.WEMO || "http://[::1]:3007";
exports.routes = [
  {
    url: `/${API_PREFIX}/auth`,
    proxy: {
      target: `${USER_URL}/auth`,
      changeOrigin: true,
      pathRewrite: {
        [`^/${API_PREFIX}/auth`]: "",
      },
    },
  },
  {
    url: `/${API_PREFIX}/refresh`,
    authenticationRequired: true,
    applyBodyParser: true,
    rateLimit: {
      windowsMs: 15 * 60 * 1000,
      max: 5,
    },
    proxy: {
      target: `${USER_URL}/refresh`,
      changeOrigin: true,
      timeout: 3000,
      pathRewrite: {
        [`^/${API_PREFIX}/refresh`]: "",
      },
    },
  },
  {
    url: `/${API_PREFIX}/admin`,
    proxy: {
      target: `${USER_URL}/admin`,
      changeOrigin: true,
      pathRewrite: {
        [`^/${API_PREFIX}/admin`]: "",
      },
    },
  },
  {
    url: `/${API_PREFIX}/users`,
    authenticationRequired: true,
    proxy: {
      target: `${USER_URL}/users`,
      changeOrigin: true,
      pathRewrite: {
        [`^/${API_PREFIX}/users`]: "",
      },
    },
  },
  {
    url: `/${API_PREFIX}/departement`,
    authenticationRequired: true,
    proxy: {
      target: `${DEPARTEMENT_URL}/departement`,
      changeOrigin: true,
      pathRewrite: {
        [`^/${API_PREFIX}/departement`]: "",
      },
    },
  },
  {
    url: `/${API_PREFIX}/flow`,
    authenticationRequired: true,
    proxy: {
      target: `${FLOW_URL}/flow`,
      changeOrigin: true,
      pathRewrite: {
        [`^/${API_PREFIX}/flow`]: "",
      },
    },
  },
  {
    url: `/${API_PREFIX}/devices`,
    authenticationRequired: true,
    proxy: {
      target: `${DEVICE_URL}/devices`,
      changeOrigin: true,
      pathRewrite: {
        [`^/${API_PREFIX}/devices`]: "",
      },
    },
  },
  {
    url: `/${API_PREFIX}/camera`,
    authenticationRequired: true,
    proxy: {
      target: `${CAMERA_URL}/camera`,
      changeOrigin: true,
      pathRewrite: {
        [`^/${API_PREFIX}/camera`]: "",
      },
    },
  },
  {
    url: `/${API_PREFIX}/wemo`,
    authenticationRequired: true,
    proxy: {
      target: `${WEMO_URL}/wemo`,
      changeOrigin: true,
      pathRewrite: {
        [`^/${API_PREFIX}/wemo`]: "",
      },
    },
  },
  // Add more routes as needed
];
