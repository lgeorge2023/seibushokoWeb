import instance from "./axiosInstance";
// Function to format error messages
const formatErrorMessage = (error) => {
  if (!error.response) {
    return 500; // Internal Server Error
  }
  const { status, data } = error.response;

  if (status === 404) {
    return 404; // Not Found
  }
  if (typeof data === 'object') {
    const errorMessages = Object.values(data).map(value => ` ${value}`);
    return errorMessages.join(', ');
  }
  return 'ERROR_OCCURED';
};

// Common function to handle requests and errors
const handleRequest = async (requestFn, ...params) => {
  try {
    const response = await requestFn(...params);
    return response.data;
  } catch (error) {
    throw formatErrorMessage(error);
  }
};

// GET request
export const get = async (url) => {
  return handleRequest(instance.get, url);
};

// POST request
export const post = async (url, data) => {
  return handleRequest(instance.post, url, data);
};

// PUT request
export const put = async (url, data) => {
  return handleRequest(instance.put, url, data);
};

// DELETE request
export const del = async (url) => {
  return handleRequest(instance.delete, url);
};

// PATCH request
export const patch = async (url,data) => {
  return handleRequest(instance.patch, url, data);
}
