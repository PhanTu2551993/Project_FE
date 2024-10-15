import { createAsyncThunk } from "@reduxjs/toolkit";
import BASE_URL from "../api";
import { DELETE, GET, PATCH, POST } from "../constants/httpMethod";
import Cookies from "js-cookie";

export const findAllProductDetails = createAsyncThunk("productDetail/findAllProductDetails", async ()=>{
    try{
        const response = await BASE_URL[GET](
            `admin/findAllProductDetails`,
            {
                headers : {
                    Authorization : `Bearer ${Cookies.get("token")}`
                }
            }
        )
        return response.data
    }catch(error){
        console.log(error);
        
    }
});
export const searchAndPagingProductDetails = createAsyncThunk(
    "productDetail/searchAndPagingProductDetails",
    async ({ searchText = "", page = 0, size = 5 } = {}) => {
      try {
        const response = await BASE_URL[GET](
          `admin/productDetails/search?searchText=${searchText}&page=${page}&size=${size}`,
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

  export const addNewProductDetail = createAsyncThunk("productDetail/addNewProductDetail", async (addForm) => {
    try{
      const response = await BASE_URL[POST](
        `admin/productDetail`, 
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

  export const deleteProductDetail = createAsyncThunk("productDetail/deleteProductDetail",
    async (id) => {
        try{
            const response = await BASE_URL[DELETE](
                `admin/productDetail/${id}`,
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

export const updateProductDetail = createAsyncThunk("productDetail/updateProductDetail", async ({id,formEditData}) => {
  try{
    const response = await BASE_URL[PATCH](
      `admin/productDetail/${id}`, 
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

  // Detail Color Size

  export const addDetailColorSize = createAsyncThunk("productDetail/addDetailColorSize", async ({proDetailId,formDetailData}) => {
    try{
      const response = await BASE_URL[POST](
        `admin/productDetail/productDetailSizeColor/${proDetailId}`, 
        formDetailData,
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

  export const findAllDetailColorSize = createAsyncThunk("productDetail/findAllDetailColorSize", async ()=>{
    try{
        const response = await BASE_URL[GET](
            `admin/productDetail/productDetailSizeColor`,
            {
                headers : {
                    Authorization : `Bearer ${Cookies.get("token")}`
                }
            }
        )
        return response.data
    }catch(error){
        console.log(error);
        
    }
});

export const deleteDetailSizeColor = createAsyncThunk("productDetail/deleteDetailSizeColor",
  async ({productDetailId,sizeId,colorId}) => {
      try{
          const response = await BASE_URL[DELETE](
              `admin/productDetail/productDetailSizeColor/${productDetailId}-${sizeId}-${colorId}`,
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

export const updateDetailSizeColor = createAsyncThunk("productDetail/updateDetailSizeColor", async ({productDetailId,sizeId,colorId,formEditDetailData}) => {
  try{
    const response = await BASE_URL[PATCH](
      `admin/productDetail/productDetailSizeColor/${productDetailId}-${sizeId}-${colorId}`, 
      formEditDetailData,
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


