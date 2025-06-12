import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to attach token
api.interceptors.request.use(
    (config) => {
        // const token = localStorage.getItem('accessToken');
        // if (token) {
        //     config.headers['Authorization'] = `Bearer ${token}`;
        // }
        // return config;
        if (config.url === '/employee/refresh_token' || config.url === '/login') {
            return config;
        }
        
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            console.log(`Adding token to ${config.url}`);
        } else{
            console.warn(`No token found for ${config.url}`);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't retried yet
        // if (error.response.status === 401 && !originalRequest._retry) {
        //     originalRequest._retry = true;

        //     try {
        //         // Try to refresh the token
        //         const response = await api.get('/employee/refresh_token');
        //         const { accessToken } = response.data;

        //         // Save the new token
        //         localStorage.setItem('accessToken', accessToken);

        //         // Update the original request with the new token
        //         originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        //         // Retry the original request
        //         return api(originalRequest);
        //     } catch (refreshError) {
        //         // If refresh fails, redirect to login
        //         localStorage.removeItem('firstLogin');
        //         localStorage.removeItem('accessToken');
        //         window.location.href = '/login';
        //         return Promise.reject(refreshError);
        //     }
        // }
        if (
            error.response?.status === 401 && 
            !originalRequest._retry &&
            localStorage.getItem('firstLogin') &&
            !originalRequest.url.includes('/employee/refresh_token')
        ) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                const response = await api.get('/employee/refresh_token');
                const { accessToken } = response.data;

                // Save the new token
                localStorage.setItem('accessToken', accessToken);

                // Update the original request with the new token
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                // Retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, clean up and redirect to login
                localStorage.removeItem('firstLogin');
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;