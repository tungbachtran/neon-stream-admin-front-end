import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`||'http://localhost:3001',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axiosInstance.post('/auth/refresh');
        return axiosInstance(originalRequest);
      } catch {
        // ✅ Lazy import — chỉ resolve khi hàm được gọi, store đã sẵn sàng
        const { store } = await import('@/store');
        const { logoutThunk } = await import('@/store/slices/authSlice');
        store.dispatch(logoutThunk());
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
