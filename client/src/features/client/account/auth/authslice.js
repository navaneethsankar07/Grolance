import { createSlice } from "@reduxjs/toolkit";

import { loginThunk,fetchUser, logoutThunk, refreshSession, deleteAccount } from "./authThunks";

const initialState = {
  user: null,
  accessToken: null,
  loading:false,
  initialized: false,
  
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
    },
       finishLoading: (state) => {
      state.loading = false;
    }
  },

  extraReducers: (builder) => {
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      const { user, access } = action.payload;
      state.user = user;
      state.accessToken = access;
    })
    .addCase(fetchUser.pending,(state)=>{
        state.loading = true
    })
    .addCase(fetchUser.fulfilled, (state, action) => {
  state.user = action.payload;
  state.loading = false;
  state.initialized = true
})
.addCase(fetchUser.rejected, (state) => {
        state.loading = false;
        state.initialized = true
      })
  .addCase(logoutThunk.fulfilled, (state) => {
    state.user = null;
    state.accessToken = null;
    state.loading = false;
    state.initialized = true
  }).addCase(deleteAccount.fulfilled, (state) => {
  state.user = null;
  state.initialized = true;
})

  
  .addCase(refreshSession.fulfilled, (state, action) => {
      state.accessToken = action.payload;
      state.initialized = true;
    })
    .addCase(refreshSession.rejected, (state) => {
      state.user = null;
      state.accessToken = null;
      state.initialized = true;
    });
  },
});

export const { logout,setCredentials,finishLoading } = authSlice.actions;
export default authSlice.reducer;
