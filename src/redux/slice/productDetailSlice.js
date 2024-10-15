import { createSlice } from "@reduxjs/toolkit";
import { addDetailColorSize, addNewProductDetail, deleteDetailSizeColor, deleteProductDetail, findAllDetailColorSize, findAllProductDetails, searchAndPagingProductDetails, updateDetailSizeColor, updateProductDetail } from "../../service/productDetailService";
import { IDLE } from "../../constants/status";

const productDetailSlice = createSlice({
    name :"productDetail",
    initialState : {
        loading : IDLE,
        content : [],
        error : null,
        productDetails : [],
        detailColorSize : [],
        total : 0,
        totalElements : 0
    },
    reducers :{},
    extraReducers : (builder)=>{
        builder.addCase(findAllProductDetails.fulfilled,(state,action) =>{
            state.loading = "succeeded"
            state.content = action.payload.content
        })
        .addCase(searchAndPagingProductDetails.fulfilled,(state,action) =>{
          
          
            state.loading = "succeeded";
            state.content = action.payload.content;
            state.total = action.payload.totalPages;
            state.totalElements = action.payload.totalElements;
          })
          .addCase(addNewProductDetail.fulfilled,(state,action)=>{
            state.loading = "succeeded";
          })
          .addCase(deleteProductDetail.fulfilled,(state,action) =>{
            state.loading = "succeeded";
          })
          .addCase(updateProductDetail.fulfilled,(state,action)=>{
            state.loading = "succeeded";
          })
          .addCase(addDetailColorSize.fulfilled,(state,action)=>{
            state.loading = "succeeded";
          })
          .addCase(findAllDetailColorSize.fulfilled,(state,action) =>{          
            state.loading = "succeeded"
            state.detailColorSize = action.payload
          })
          .addCase(deleteDetailSizeColor.fulfilled,(state,action) =>{
            state.loading = "succeeded";
          })
          .addCase(updateDetailSizeColor.fulfilled,(state,action)=>{
            state.loading = "succeeded";
          })
    }
})

export default productDetailSlice.reducer