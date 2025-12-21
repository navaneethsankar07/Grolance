import { createAsyncThunk } from "@reduxjs/toolkit";
import * as authApi from "../../../../api/auth/authApi";
import { logout } from "./authslice";


export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await authApi.loginUser({ email, password });
      return res; 
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, thunkAPI) => {
    try {
      const res = await authApi.getCurrentUser();
      return res.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message ||
          error.response.data.message ||
          error.response.data.error ||
          "Something went wrong");
    }
  }
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await authApi.logoutUser();          
      thunkAPI.dispatch(logout()); 
    } catch (err) {
      thunkAPI.dispatch(logout());
    }
  }
);