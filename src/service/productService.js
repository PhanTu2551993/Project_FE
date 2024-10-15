import { createAsyncThunk } from "@reduxjs/toolkit";
import BASE_URL from "../api";
import { DELETE, GET, PATCH, POST } from "../constants/httpMethod";
import Cookies from "js-cookie";

export const getAllProducts = createAsyncThunk(
  "product/getAllProducts",
  async () => {
    try {
      const response = await BASE_URL[GET](`admin/products`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const searchAndPagingProducts = createAsyncThunk(
  "product/searchAndPagingProducts",
  async ({ searchText = "", page = 0, size = 5 } = {}) => {
    try {
      const response = await BASE_URL[GET](
        `admin/products/search?searchText=${searchText}&page=${page}&size=${size}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const deleteProduct = createAsyncThunk("category/deleteProduct",
  async (id) => {
      try{
          const response = await BASE_URL[DELETE](
              `admin/product/${id}`,
              {
                  headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`,
                  },
              }
          );
          return response.data
      }
      catch(error){
          console.log(error); 
      }
  }
);

export const addNewProduct = createAsyncThunk("product/addNewProduct", async (addForm) => {
  try{
    const response = await BASE_URL[POST](
      `admin/product`, 
      addForm,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      return response.data;
  }catch(error){
    console.log(error);
  }
});


export const updateProduct = createAsyncThunk("product/updateProduct", async ({id,formEditData}) => {
  try{
    const response = await BASE_URL[PATCH](
      `admin/product/${id}`, 
      formEditData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      return response.data;
  }catch(error){
    console.log(error);
  }
});

export const findAllProducts =  createAsyncThunk("product/findAllProducts", async () => {
  try{
    const response = await BASE_URL[GET](
      `admin/findAllProducts`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });      
      return response.data;
  }catch(error){
    console.log(error);
  }
});




