import axios from 'axios'

// Configure axios base URL
const baseURL = process.env.NODE_ENV === 'production' 
  ? 'https://your-app-name.vercel.app'  // Replace with your actual Vercel URL
  : 'http://localhost:5000'

axios.defaults.baseURL = baseURL

export default axios
