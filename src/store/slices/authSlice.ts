import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '@/services/auth.service';
import type { AuthUser } from '@/types/auth';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;       // dùng cho fetchMeThunk (initial check)
  isSubmitting: boolean;    // dùng cho loginThunk
  error: string | null;
  initialized: boolean;     // đã gọi getMe xong chưa
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isSubmitting: false,
  error: null,
  initialized: false,
};

// ── Thunks ────────────────────────────────────────────────

/** Gọi khi app khởi động — kiểm tra session hiện tại */
export const fetchMeThunk = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getMe();
    } catch {
      return rejectWithValue(null);
    }
  },
);

/** Login */
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (
    payload: { identifier: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await authService.login(payload);
      // Lưu token để axiosInstance dùng
      localStorage.setItem('access_token', res.accessToken);
      return res;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || 'Login failed',
      );
    }
  },
);

/** Logout */
export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch {
      // ignore — vẫn clear state
    } finally {
      localStorage.removeItem('access_token');
    }
  },
);

// ── Slice ─────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    // Dùng khi cần set user thủ công (hiếm dùng)
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    // ── fetchMe ──
    builder
      .addCase(fetchMeThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMeThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.initialized = true;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchMeThunk.rejected, (state) => {
        state.isLoading = false;
        state.initialized = true;
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem('access_token');
      });

    // ── login ──
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.initialized = true;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });

    // ── logout ──
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.initialized = false;
    });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
