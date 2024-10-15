import { createAsyncThunk } from "@reduxjs/toolkit";
import BASE_URL from "../api";
import { DELETE, GET, PATCH, POST } from "../constants/httpMethod";
import Cookies from "js-cookie";

export const getAllCategories = createAsyncThunk("category/getAllCategories", async () => {
    try{
        const response = await BASE_URL[GET](
            `admin/category`,
            {
                headers: {
                  Authorization: `Bearer ${Cookies.get("token")}`,
                },
            });

            console.log("response",response);
            
        return response.data      

    }catch (error){
        console.error(error); 
    }
});

export const searchAndPagingCategory = createAsyncThunk("category/searchAndPagingCategory", 
    async ({ searchText = '', page = 0, size = 5} = {}) => {
    try{
        const response = await BASE_URL[GET](
            `admin/category/search?searchText=${searchText}&page=${page}&size=${size}`,
            {
                headers: {
                  Authorization: `Bearer ${Cookies.get("token")}`,
                },
            });

        return response.data    

    }catch (error){
        console.log(error);
        
    }
});

export const deleteCategory = createAsyncThunk("category/deleteCategory",
    async (id) => {
        try{
            const response = await BASE_URL[DELETE](
                `admin/category/${id}`,
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

export const addNewCategory = createAsyncThunk("category/addNewCategory", async (formData) => {
    try{
      const response = await BASE_URL[POST](
        `admin/category`, 
        formData,
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
  
  
  export const updateCategory = createAsyncThunk("product/updateCategory", async ({id,formEditData}) => {
    try{
      const response = await BASE_URL[PATCH](
        `admin/category/${id}`, 
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

  export const fetchAllCategories = createAsyncThunk("category/fetchAllCategories", async () => {
    try{
        const response = await BASE_URL[GET](
            `admin/categories`,
            {
                headers: {
                  Authorization: `Bearer ${Cookies.get("token")}`,
                },
            });
        return response.data      
  
    }catch (error){
        console.error(error); 
    }
  });
  

