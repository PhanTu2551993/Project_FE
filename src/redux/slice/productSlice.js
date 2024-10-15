import { createSlice } from "@reduxjs/toolkit";
import { IDLE } from "../../constants/status";
import { addNewProduct, deleteProduct, findAllProducts, getAllProducts, searchAndPagingProducts, updateProduct } from "../../service/productService";

const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: IDLE,
    content: [],
    products : [],
    error: null,
    total: 0,
    totalElements: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(getAllProducts.fulfilled,(state,action)=>{
      state.loading = "successed";
      state.content = action.payload.content;
    })
    .addCase(searchAndPagingProducts.fulfilled,(state,action) =>{
      state.loading = "succeeded";
      state.content = action.payload.content;
      state.total = action.payload.totalPages;
      state.totalElements = action.payload.totalElements;
    })
    .addCase(deleteProduct.fulfilled,(state,action) =>{
      state.loading = "succeeded";
    })
    .addCase(addNewProduct.fulfilled,(state,action)=>{
      state.loading = "succeeded";
    })
    .addCase(updateProduct.fulfilled,(state,action)=>{
      state.loading = "succeeded";
    })
    .addCase(findAllProducts.fulfilled,(state,action) =>{
      state.loading = "succeeded";
      state.products = action.payload;
    })
  },
});

export default productSlice.reducer
