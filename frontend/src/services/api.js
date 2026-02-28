import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
    timeout: 60000,
});

// Attach JWT token to every request
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Helper for error catching
const handleRequest = async (requestPromise) => {
    try {
        const response = await requestPromise;
        return response.data;
    } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'An error occurred';
        throw new Error(errorMessage);
    }
}

// Auth
export async function login(email, password) {
    return handleRequest(apiClient.post('/api/auth/login', { email, password }));
}

export async function signup(email, password) {
    return handleRequest(apiClient.post('/api/auth/signup', { email, password }));
}

export async function fetchUser() {
    return handleRequest(apiClient.get('/api/auth/me'));
}

// Optimize resume
export async function optimizeResume(formData) {
    return handleRequest(apiClient.post('/api/optimize', formData));
}

// Fetch optimization history
export async function fetchHistory() {
    const data = await handleRequest(apiClient.get('/api/history'));
    return data.history || [];
}

export default apiClient;
