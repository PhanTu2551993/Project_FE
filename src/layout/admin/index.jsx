import React, { useState } from 'react';
import {
    BellOutlined,
    DashboardOutlined,
  DownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MessageOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Image, Layout, Menu, Space, theme } from 'antd';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slice/authSlice';
const { Header, Sider, Content } = Layout;
const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();
  const dispatch = useDispatch(); 

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      dispatch(logout());
      navigate("/")
    } else {
      message.info(`Click on item ${key}`);
    }
  };

  const dropDownItem = [
    {
    key: 'logout',
    label: 'Log out',
  },
  ];

  const items=[
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: <NavLink to="/admin">Tổng quan</NavLink>,
    },
    {
      key: '2',
      icon: <UserOutlined />,
      label: <NavLink to="/admin/users">Quản lý tài khoản</NavLink>,
    },
    {
      key: '3',
      icon: <UploadOutlined />,
      label: <NavLink to="/admin/category">Quản lý danh mục</NavLink>,
    },
    {
      key: '4',
      icon: <UploadOutlined />,
      label: <NavLink to="/admin/product">Quản lý sản phẩm</NavLink>,
    },
    {
      key: '5',
      icon: <UploadOutlined />,
      label: <NavLink to="/admin/productDetail">Chi tiết sản phẩm</NavLink>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={items}
        />
      </Sider>
      <Layout>
        <Header
           style={{
            width : "100vw",
            padding: 0,
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor : 'lightskyblue',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              outline: "none",
              width: 64,
              height: 64,
            }}
          />
          <Space size={16} wrap style={{position: 'absolute', right: 50, top : 5}}>
            <BellOutlined style={{ fontSize: '25px' }} />
            <MessageOutlined style={{ fontSize: '25px'}} />
            <Image
              width={50}
              style={{ borderRadius: '50%' }}
            //   src={userData.avatar}
            />
            <Dropdown
              menu={{
                items : dropDownItem,
                onClick: handleMenuClick,
              }}
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  {/* {userData.fullName} */}
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet/>
        </Content>
      </Layout>
    </Layout>
  );
};
export default LayoutAdmin;