import { createSlice } from "@reduxjs/toolkit";
import { login } from "../../service/authService";
import { IDLE } from "../../constants/status";
import Cookies from "js-cookie";

const authSlice = createSlice({
    name : "auth",
    initialState : {
        loading : IDLE,
        data:null,
        error:null
    },
    reducers : {
        logout: (state) => {
            state.data = null;
            Cookies.remove("token");
          },
    },
    extraReducers : (builder) => {
        builder
        .addCase(login.pending, (state) => {
            state.loading = "loading";
            state.error = null;
          })
          .addCase(login.fulfilled, (state, action) => {
            state.loading = "succeeded";
            state.data = action.payload;
          })
          .addCase(login.rejected, (state, action) => {
            state.loading = "failed";
            state.error = action.error;
          })
    },


})

export default authSlice.reducer
export const { logout } = authSlice.actions;