exports.apiErrors = (error) => {
  // 1. Server responded with a status code outside the 2xx range
  if (error.response) {
    // The error message from the backend API body
    const message = error.response.data?.message || error.response.data;
    console.error('API Error Message:', message);
    console.error('HTTP Status:', error.response.status);
  }
  // 2. Request was made but no response was received (e.g., Network Error)
  else if (error.request) {
    console.error('Network error: No response received from server.');
  }
  // 3. Something went wrong setting up the request
  else {
    console.error('Request Error:', error.message);
  }
};
