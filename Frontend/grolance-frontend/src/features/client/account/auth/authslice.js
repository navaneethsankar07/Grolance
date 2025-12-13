import { createSlice } from "@reduxjs/toolkit";
import { loginThunk,fetchUser } from "./authThunks";

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading:true,
  
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
       finishLoading: (state) => {
      state.loading = false;
    }
  },

  extraReducers: (builder) => {
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      const { user, access, refresh } = action.payload;
      state.user = user;
      state.accessToken = access;
      state.refreshToken = refresh;
      state.isAuthenticated = true;
    })
    .addCase(fetchUser.pending,(state)=>{
        state.loading = true
    })
    .addCase(fetchUser.fulfilled, (state, action) => {
  state.user = action.payload;
  state.isAuthenticated = true;
  state.loading = false;
})
.addCase(fetchUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      });
  
  },
});

export const { logout,setCredentials,finishLoading } = authSlice.actions;
export default authSlice.reducer;
