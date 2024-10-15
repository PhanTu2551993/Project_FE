import { Button, Form, Input, message, Modal, notification, Select, Space, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import "./index.css"
import { useDispatch, useSelector } from 'react-redux';
import { changeRoleUser, changeStatusUser, fetchAllUser, searchAndPagingUser } from '../../../service/userService';
import PaginationComponent from '../../../components/base/PaginationComponent';
import useDebounce from '../../../hooks/useDebounce';

  const {Search} = Input;
  const { Option } = Select;

export default function AdminUser() {
    const dispatch = useDispatch();
    const user = useSelector((state)=> state.user.content);  
    const total = useSelector((state) => state.user.total);
    // const test = useSelector((state) => {console.log("state",state);});
    const totalElements = useSelector((state) => state.user.totalElements);
    // const roles = useSelector((state) => state.user.roles);
    // const searchText = useSelector((state) => state.user.searchText);
    const [searchKey,setSearchKey] = useState("");
    const [pageSize,setPageSize] = useState(5);
    const [currentPage,setcurrentPage] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newRole,setNewRole] = useState("");
    
    //delay 300ms(3s)
    const debounce = useDebounce(searchKey,300);
    
    useEffect(()=>{
      dispatch(searchAndPagingUser({searchText: debounce,page : currentPage,size : pageSize}));
      // dispatch(fetchAllUser({ page : currentPage,size : pageSize }));
    },[debounce,pageSize,currentPage,dispatch])

    const handleSearch = (e) => {
      const value = e.target.value;
      setSearchKey(value);
      setcurrentPage(0)
    };

    const handleGetPageSize = (current,pageSizeOptions)=>{
      setPageSize(pageSizeOptions);
      setcurrentPage(current-1);
    };

    const handleInfo = (user) => {
      setSelectedUser(user);
      setIsModalVisible(true);
    };
  
    const handleModalCancel = () => {
      setIsModalVisible(false);
      setSelectedUser(null);
    };

    const handleBlockUser = (userId)=>{
      dispatch(changeStatusUser(userId)).then(()=>{
        dispatch(searchAndPagingUser({searchText: debounce,page : currentPage,size : pageSize}));
      })
      .catch((error) => {
        notification.error({
          message: 'Error',
        });
        console.error("Error blocking/unblocking user:", error);
      });
    };

    const handleChangeRoleUser = (userSelect) =>{
      setIsRoleModalVisible(true);
      setNewRole(null);
      setSelectedUser(userSelect);
    }

    const handleRoleSubmit = () => {
      if (selectedUser && newRole) {
        dispatch(changeRoleUser({ userId: selectedUser.userId, newRole }))
          .then(() => {
            setIsRoleModalVisible(false);
            setNewRole(null)
            dispatch(searchAndPagingUser({ searchText: debounce, page: currentPage, size: pageSize }));
          })
          .catch((error) => {
            console.error("Failed to change role:", error);
          });
      } else {
        console.log("Missing user or role");
      }
    };

    const handleRoleModalCancel = ()=>{
      setIsRoleModalVisible(false);
    };

    const handleRoleChange = (value) =>{
      setNewRole(value)
    };
    const columns = [
        {
          title: 'ID',
          dataIndex: 'userId',
          key: 'id',
          sorter: (a, b) => a.userId - b.userId,
        },
        {
          title: 'Username',
          dataIndex: 'username',
          key: 'username',
          sorter: (a, b) => a.username.localeCompare(b.username),
        },
        {
          title: 'FullName',
          dataIndex: 'fullName',
          key: 'fullName',
          sorter: (a, b) => a.fullName.localeCompare(b.fullName),
        },
        {
          title: 'Avatar',
          dataIndex: 'avatar',
          key: 'avatar',
          render: (avatar) => (avatar ? <img src={avatar} alt="user" style={{ width: 50, height: 50 }} /> : 'No Image'),
        },
        {
          title: 'Phone',
          dataIndex: 'phone',
          key: 'phone',
          sorter: (a, b) => a.phone.localeCompare(b.phone),
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
          sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
          title: 'Role',
          dataIndex: 'roles',
          key: 'role',
          render: (roles) => {
            if (Array.isArray(roles)) {
              return roles.map(role => roleMapping[role.roleName] || role.roleName).join(", ");
            }
            return 'No Roles';
          },
          sorter: (a, b) => {
            const roleA = Array.isArray(a.roles) ? a.roles.map(role => roleMapping[role.roleName] || role.roleName).join(", ") : '';
            const roleB = Array.isArray(b.roles) ? b.roles.map(role => roleMapping[role.roleName] || role.roleName).join(", ") : '';
            return roleA.localeCompare(roleB);
          },
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          sorter: (a, b) => a.status - b.status,
          render: (status) => (status ? 'active' : 'inactive'),
        },
        {
          title: 'Action',
          key: 'action',
          render: (text, record) => (
            <Space size="middle">
              <Button type="link" 
              onClick={() => handleInfo(record)}
              >Info</Button>
              <Button type="link" danger 
              onClick={() => handleBlockUser(record.userId)}
              >
                {record.status ? 'Block' : 'UnBlock'}
              </Button>
              <Button type="link" 
              onClick={() => handleChangeRoleUser(record)}
              >Change Role</Button>
            </Space>
          ),
        },
      ];

      const roleMapping = {
        'ROLE_ADMIN': 'ADMIN',
        'ROLE_USER': 'USER',
        'ROLE_MANAGER': 'MANAGER',
      };

      const data =  user?.map((item) => ({
        key: item.userId,
        userId: item.userId,
        username: item.username,
        fullName: item.fullName,
        email: item.email,
        phone: item.phone,
        status: item.status,
        avatar: item.avatar,
        // address: addresses.map((addr, index) => (
        //   <div
        //     key={addr.addressId || index}
        //     style={{ display: "flex", alignItems: "center" }}
        //   >
        //     <div>
        //       {"Đc "} {index + 1}{" "}
        //       {" : " +
        //         addr.streetAddress +
        //         ", " +
        //         addr.ward +
        //         ", " +
        //         addr.district +
        //         ", " +
        //         addr.province}
        //     </div>
        //   </div>
        // )),
        creatAt : item.creatAt,
        updateAt : item.updateAt,
        roles: Array.isArray(item.roles) ? item.roles : [],
      }));
  return (
    <>
    <div className='table-user'>
    <Search
            placeholder="Search....."
            value={searchKey}
            onChange={handleSearch}
            className='search'
          />
    <Table 
    className="custom-table-user"  
    columns={columns} 
    dataSource={data} 
    pagination= {false}
    />
    <PaginationComponent 
    total={totalElements}
    pageSize={pageSize}
    currentPage={currentPage+1}
    showSizeChanger = {"showSizeChanger"} 
    totalPages={total} 
    onChange={handleGetPageSize}
    align = {"end"}
    />
    </div>
    <Modal
        title="User Info"
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        {selectedUser && (
          <div>
            <p><strong>ID:</strong> {selectedUser.userId}</p>
            <p><strong>Username:</strong> {selectedUser.username}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Full Name:</strong> {selectedUser.fullName}</p>
            <p><strong>Status:</strong> {selectedUser.status ? 'active' : 'inactive'}</p>
            <p><strong>Avatar:</strong> <img src={selectedUser.avatar} alt="user" style={{ width: 100, height: 100 }} /></p>
            <p><strong>Phone:</strong> {selectedUser.phone}</p>
            <p><strong>Address:</strong> {selectedUser.address}</p>
            <p><strong>Created At:</strong> {selectedUser.creatAt}</p>
            <p><strong>Updated At:</strong> {selectedUser.updateAt}</p>
          </div>
        )}
      </Modal>
      <Modal
        title="Change Role"
        open={isRoleModalVisible}
        onCancel={handleRoleModalCancel}
        onOk={handleRoleSubmit}
      >
        <Form>
          <Form.Item label="Role">
        <Select 
        value={newRole}
        onChange={handleRoleChange}
        // onChange={(value) => setNewRole(value)}
        placeholder="Chọn vai trò mới"
      >
        {Object.keys(roleMapping).map((roleKey) => (
          <Select.Option key={roleKey} value={roleKey}>
            {roleMapping[roleKey]} 
          </Select.Option>
        ))}
        </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
