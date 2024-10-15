import React, { useState } from 'react'
import "./index.css"
import { DownOutlined, HeartOutlined, SearchOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'
import { Drawer, Dropdown, Image, Space } from 'antd'
import ShoppingCart from '../../page/user/shoppingCart';

export default function HomePageHeader() {
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
    <div className='header-container'>
      <div className='header-3'>
          <div className='search-container'>
                  <SearchOutlined className='searchOutlined'/>
                  <input
                    type="text"
                    placeholder="Tìm kiếm"
                    // onChange={handleSearchChange}
                  />
        </div>
        <div className='header-icons'>
                <HeartOutlined
                className="header-icon" 
                  // onClick={showDrawerWishList}
                />
                <ShoppingCartOutlined
                className="header-icon"
                  onClick={showDrawer}
                />
                <UserOutlined 
                className="header-icon" />      
        </div>
      </div>          
    </div>
    <ShoppingCart onClose={onClose} open={open}/>
  </>
  )
}
