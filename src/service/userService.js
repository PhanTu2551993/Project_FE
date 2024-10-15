import { createAsyncThunk } from "@reduxjs/toolkit";
import BASE_URL from "../api";
import { GET, PATCH } from "../constants/httpMethod";
import Cookies from "js-cookie";



export const fetchAllUser = createAsyncThunk(
    "user/fetchAllUser",
    async ({ page, size } = {}) => {
      try {
        const response = await BASE_URL[GET](
          `admin/users?page=${page}&size=${size}`, 
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        return response.data
      } catch (error) {
        console.error(error); 
      }
    }
  );

  export const searchAndPagingUser = createAsyncThunk(
    "user/searchAndPagingUser",
    async ({ searchText = '', page = 0, size = 5} = {}) => {
      try {
        const response = await BASE_URL[GET](
          `admin/users/search?searchText=${searchText}&page=${page}&size=${size}`, 
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );     
        return response.data;
      } catch (error) {
        console.error(error); 
      }
    }
  );

  export const changeStatusUser = createAsyncThunk("user/changeStatusUser",
    async (userId) => {
      try {
        const response = await BASE_URL[PATCH](
          `admin/user/changeStatus/${userId}`,{} ,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );     
        return response.data;
      }catch(error){
          console.error(error);
          throw error;
      }
    }
  );

  export const changeRoleUser = createAsyncThunk("user/changeRoleUser",
    async ({userId,newRole}) => {
      try {
        const response = await BASE_URL[PATCH](
          `admin/user/changeRole/${userId}`,{ newRole },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        )
        return response.data
      }catch(error){
        console.log(error);
        throw error;
      }
    }
  );

  //http://localhost:8080/api/v1/admin/users/search?searchText=tuextra2&page=2&size=3