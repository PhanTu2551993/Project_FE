import { createSlice } from "@reduxjs/toolkit";
import { IDLE } from "../../constants/status";
import { changeRoleUser, changeStatusUser, fetchAllUser, searchAndPagingUser } from "../../service/userService";

const userSlice = createSlice({
    name : "user",
    initialState : {
        loading : IDLE,
        content : [],
        error : null,
        roles : [],
        page : 0,
        total : 0,
        totalElements : 0
    },
    reducers : {
    },

    extraReducers : (builder) => {
        builder
        .addCase(fetchAllUser.pending, (state) => {
            state.loading = "loading";
            state.error = null;
          })
          .addCase(fetchAllUser.fulfilled, (state, action) => {
            state.loading = "succeeded";
            state.content = action.payload.content;            
          })
          .addCase(fetchAllUser.rejected, (state,action) => {
            state.loading = "failed";
            state.error = action.error;
          })
          .addCase(searchAndPagingUser.fulfilled, (state,action) => {
            state.loading = "succeeded";
            state.content = action.payload.content;
            state.total = action.payload.totalPages;
            state.totalElements = action.payload.totalElements;           
          })
          .addCase(changeStatusUser.fulfilled,(state,action) => {
            state.loading = "succeeded";
            // state.content = action.payload.content; 
          })
          .addCase(changeStatusUser.rejected, (state,action) => {
            console.log("action",action);
            
            state.loading = "failed";
            state.error = action.error;
          })
          .addCase(changeRoleUser.fulfilled,(state,action) => {
            state.loading = "succeeded";
            state.roles = action.payload.roles
            
      
            // state.content = action.payload.content; 
          })
    }
})
export default userSlice.reducer