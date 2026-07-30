import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const API = axios.create({
  baseURL: API_BASE_URL
});

export const fetchExecutiveMetrics = (filters) => API.get('/analytics/executive', { params: filters });
export const fetchBookingMetrics = (filters) => API.get('/analytics/booking', { params: filters });
export const fetchRevenueMetrics = (filters) => API.get('/analytics/revenue', { params: filters });
export const fetchCustomerMetrics = (filters) => API.get('/analytics/customer', { params: filters });
export const fetchRoomMetrics = (filters) => API.get('/analytics/room', { params: filters });
export const fetchOccupancyMetrics = (filters) => API.get('/analytics/occupancy', { params: filters });
export const fetchSeasonalMetrics = (filters) => API.get('/analytics/seasonal', { params: filters });
export const fetchPricingMetrics = (filters) => API.get('/analytics/pricing', { params: filters });
export const fetchCancellationMetrics = (filters) => API.get('/analytics/cancellation', { params: filters });
export const fetchInsights = () => API.get('/insights');
export const fetchRecommendations = () => API.get('/recommendations');

export default API;
