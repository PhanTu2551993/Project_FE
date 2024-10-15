import { ShoppingCartOutlined } from '@ant-design/icons';
import { Button, Card } from 'antd';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { searchAndPagingProducts } from '../../../service/productService';
import "./index.css"
import useDebounce from '../../../hooks/useDebounce';
import Search from 'antd/es/transfer/search';
import PaginationComponent from '../../../components/base/PaginationComponent';

const { Meta } = Card;

export default function ProductList() {
    const dispatch = useDispatch();
    const products = useSelector(state => state.product.content);
    const total = useSelector(state => state.product.total);
    const totalElements = useSelector(state => state.product.totalElements);
    const [pageSize,setPageSize] = useState(5);
    const [currentPage,setcurrentPage] = useState(0);
    const [searchKey,setSearchKey] = useState("");
    
    console.log(products);

    const debounce = useDebounce(searchKey,300);

    useEffect(()=>{
        dispatch(searchAndPagingProducts({searchText : debounce,page : currentPage,size :pageSize}))
    },[debounce,pageSize,currentPage,dispatch]);

    const handleGetPageSize = (current,pageSizeOptions) =>{
        setPageSize(pageSizeOptions);
        setcurrentPage(current-1)
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchKey(value);
        setcurrentPage(0)
      };

    

    
  return (
    <>
    
    <div className='productList-container'>
        <h1 style={{fontSize : 40,textAlign : 'center', padding : 20}}>Danh sách sản phẩm</h1>
        <div className='productList'> 
        {/* <Search
            placeholder="Search....."
            value={searchKey}
            onChange={handleSearch}
            className='search-productList'
          /> */}
        {products?.map((product)=>(
            <Card
            key={product.productId}
            hoverable
            // style={{
            //   width: '100%',
            //   height: '100%',
            // }}
                    cover={<img 
                        className="transform transition-transform duration-300 hover:scale-110"
                        style={{ maxHeight: 200}}
                        alt={product.productName}
                        src={product.image} 
                        />}
                    >
                    <h3>{product.productName}</h3>    
                    <Button type="primary" 
                    // onClick={() => addToCart(product)}
                    >
                    <ShoppingCartOutlined />
                        Thêm vào giỏ hàng
                    </Button>
            </Card>
       
        ))}
        </div>
    </div>
    
    <PaginationComponent 
    total={totalElements}
    pageSize={pageSize}
    currentPage={currentPage+1}
    totalPages={total}
    // showSizeChanger = {null} 
    onChange={handleGetPageSize}
    align = {"center"}
    />
    </>
  )
}
