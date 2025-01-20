import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL, // Backend URL from .env
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;


// for deployement
// import axios from 'axios';
// // Create an Axios instance
// const axiosInstance = axios.create({
//   baseURL: 'https://coabackend.lajiktech.com',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });


// export default axiosInstance;