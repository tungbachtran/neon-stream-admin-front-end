import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`||'http://localhost:3001',
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axiosInstance.post('/auth/refresh');
        const newAccessToken = res.data?.accessToken;

        if (newAccessToken && typeof window !== 'undefined') {
          localStorage.setItem('access_token', newAccessToken);
        }
        return axiosInstance(originalRequest);
      } catch {
        // ✅ Lazy import — chỉ resolve khi hàm được gọi, store đã sẵn sàng
        const { store } = await import('@/store');
        const { logoutThunk } = await import('@/store/slices/authSlice');
        store.dispatch(logoutThunk());
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
