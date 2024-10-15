import { createSlice } from "@reduxjs/toolkit";
import { addNewCategory, deleteCategory, fetchAllCategories, getAllCategories, searchAndPagingCategory, updateCategory } from "../../service/categoryService";
import { IDLE } from "../../constants/status";

const categorySlice = createSlice({
    name : "category",
    initialState : {
        loading : IDLE,
        content : [],
        categories : [],
        error : null,
        total : 0,
        totalElements : 0
    },
    reducers : {},
    extraReducers : (builder) => {
        builder
        .addCase(getAllCategories.fulfilled, (state,action) => {
            console.log("action",action);
            state.loading = "succeeded";
            state.categories = action.payload.content;
        })
        .addCase(searchAndPagingCategory.fulfilled, (state,action)=>{
            state.loading = "succeeded";
            state.content = action.payload.content;
            state.total = action.payload.totalPages;
            state.totalElements = action.payload.totalElements;  
        })
        .addCase(deleteCategory.fulfilled,(state,action) => {
            console.log("action",action);
            state.loading = "succeeded";
        })
        .addCase(addNewCategory.fulfilled,(state,action)=>{
            state.loading = "succeeded";
        })
        .addCase(updateCategory.fulfilled,(state,action)=>{
            state.loading = "succeeded";
        })
        .addCase(fetchAllCategories.fulfilled,(state,action) =>{
            state.loading = "succeeded";
            state.categories = action.payload;
          })
    }
})

export default categorySlice.reducer