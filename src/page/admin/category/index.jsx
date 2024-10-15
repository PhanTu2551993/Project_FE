import React, { useEffect, useState } from 'react'
import "./index.css"
import PaginationComponent from '../../../components/base/PaginationComponent'
import { Button, Form, Input, message, Modal, Space, Switch, Table, Upload } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { addNewCategory, deleteCategory, getAllCategories, searchAndPagingCategory, updateCategory } from '../../../service/categoryService'
import moment from 'moment'
import useDebounce from '../../../hooks/useDebounce'
import { UploadOutlined } from '@ant-design/icons'
import axios from 'axios'
import Cookies from 'js-cookie'
const {Search} = Input;
const { confirm } = Modal;

export default function AdminCategory() {
  const dispatch = useDispatch();
    const categories = useSelector((state) => state.category.content);
    const total = useSelector((state) => state.category.total);
    const totalElements = useSelector((state) => state.category.totalElements);
    const [searchKey,setSearchKey] = useState("");
    const [pageSize,setPageSize] = useState(5);
    const [currentPage,setcurrentPage] = useState(0);

    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [file, setFile] = useState(null);
    const [filePrev,setFilePrev] = useState(null);
    const [catId,setCatId] = useState();
    // const [form] = Form.useForm();
    const [addForm] = Form.useForm();
    const [editForm] = Form.useForm();

    const debounce = useDebounce(searchKey,300);
    useEffect(()=>{
      dispatch(searchAndPagingCategory({searchText : debounce,page : currentPage,size : pageSize}));
    },[debounce,pageSize,currentPage,dispatch]);
    
    const handleSearch = (e) => {
      const value = e.target.value;
      setSearchKey(value);
      setcurrentPage(0)
    };

    const handleGetPageSize = (current,pageSizeOptions)=>{
      setPageSize(pageSizeOptions);
      setcurrentPage(current-1);
    };

    const handleAddNewCategory = async () => {
      try {
        console.log("addForm",addForm);
        
        const values = await addForm.validateFields();
        console.log("values",values);

        const formData = new FormData();
        formData.append('categoryName', values.categoryName);
        formData.append('description', values.description);
        formData.append('status', values.status);
        if (file) {
          formData.append('image', file);
        }
  
        await dispatch(addNewCategory(formData)).then(()=>{
          message.success('Category added successfully');
          setIsAddModalVisible(false);
          setFile(null);
          setFilePrev(null);
          addForm.resetFields();
          dispatch(searchAndPagingCategory({searchText : debounce,page : currentPage,size : pageSize}));
        });
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Failed to add category';
          message.error(errorMessage);
          console.error('Add error:', error);
        }
      };

    const handleAddModalCancel = () => {
      setIsAddModalVisible(false);
      setFile(null);
      setFilePrev(null);
    };

    const handleChangeFile = (info) => {
      const file = info.file;
      const fileReader = new FileReader();
      
      fileReader.onload = () => {
        setFilePrev(fileReader.result);
      };
    
      if (file) {
        fileReader.readAsDataURL(file);
        setFile(file);
      } else {
        setFile(null);
        setFilePrev(null);
      }
    };

    const handleDelete = (id) => {
      confirm({
        title: 'Are you sure you want to delete this item?',
        content: 'Once deleted, the product detail will be removed permanently.',
        okText: 'Yes, Delete',
        okType: 'danger',
        cancelText: 'No, Cancel',
        onOk: async () => {
          try{
        await dispatch(deleteCategory(id)).then(() => {
          message.success('Deleted Category successfully');
        dispatch(searchAndPagingCategory({searchText : debounce,page : currentPage,size : pageSize}));  
        })
        }catch(error){
            console.error('Delete error:', error);
        }
        },
        onCancel() {
          console.log('Cancel deletion');
        },
      });
    };

    const handleEditModalCancel = () => {
      setIsEditModalVisible(false);
    };
    
    const handleEditCategory = async (id) => {
      try {
        const values = await editForm.validateFields();
        const formEditData = new FormData();
        formEditData.append('categoryName', values.categoryName);
        formEditData.append('description', values.description);
        formEditData.append('status', values.status);
        if (file) {
          formEditData.append('image', file);
        }
  
        await dispatch(updateCategory({id,formEditData})).then(()=>{
          setIsEditModalVisible(false);
          setFile(null);
          setFilePrev(null);
          dispatch(searchAndPagingCategory({searchText : debounce,page : currentPage,size : pageSize})); 
        })

      } catch (error) {
        console.log(error);
        
      }
    };

    const handleClickEdit = (category) =>{
      console.log("category",category);
      console.log("categories",categories);
      setIsEditModalVisible(true);
      setCatId(category.categoryId);
        editForm.setFieldsValue({
              categoryName: category.categoryName,
              description: category.description,
              status: category.status,
          });
          setFilePrev(category.image); 
          setFile(null);
  };

    const columns = [
        {
          title: 'ID',
          dataIndex: 'categoryId',
          key: 'id',
          sorter: (a, b) => a.categoryId - b.categoryId,
        },
        {
          title: 'Category_Name',
          dataIndex: 'categoryName',
          key: 'categoryName',
          sorter: (a, b) => a.categoryName.localeCompare(b.categoryName),
        },
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
        },
        {
          title: 'Image',
          dataIndex: 'image',
          key: 'image',
          render: (image) => (image ? <img src={image} alt="category" style={{ width: 50, height: 50 }} /> : 'No Image'),
        },
        {
          title: 'CreatedAt',
          dataIndex: 'createdAt',
          key: 'createdAt',
          sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
          render: (text) => moment(text).format('DD/MM/YYYY'),
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
            //   onClick={() => handleInfo(record)}
              >Info</Button>
              <Button type="link"  
              onClick={() => handleClickEdit(record)}
              >
                Edit
              </Button>
              <Button type="link" danger
                onClick={() => handleDelete(record.categoryId)}
              >Delete</Button>
            </Space>
          ),
        },
      ];
      const data =  categories?.map((item) => ({
        key : item.categoryId,
        categoryId : item.categoryId,
        categoryName : item.categoryName,
        description : item.description,
        image : item.image,
        createdAt : item.createdAt,
        status : item.status
      }));
  return (
    <>
    <div className='table-category'>
    <Button type="primary" 
            onClick={() => setIsAddModalVisible(true)} 
            style={{ marginBottom: 16 }}>
            Add New Category
    </Button>
    <Search
            placeholder="Search....."
            value={searchKey}
            onChange={handleSearch}
            className='search-cat'
          />
    <Table 
    className="custom-table-category"  
    columns={columns} 
    dataSource={data} 
    pagination= {false}
    />
    <PaginationComponent 
    total={totalElements}
    pageSize={pageSize}
    currentPage={currentPage+1}
    totalPages={total} 
    showSizeChanger = {"showSizeChanger"}
    onChange={handleGetPageSize}
    align = {"end"}
    />
    </div>
    <Modal
        title="Add New Category"
        open={isAddModalVisible}
        onOk={handleAddNewCategory}
        onCancel={handleAddModalCancel}
      >
        <Form form={addForm} layout="vertical">
          <Form.Item
            name="categoryName"
            label="Category Name"
            rules={[{ required: true, message: 'Category Name is required' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status" valuePropName="checked">
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
          <Form.Item label="Image">
            <Upload
              beforeUpload={(file) => {
                setFile(file);
                return false;
              }}
              onChange={handleChangeFile}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
            {file && <p>{file.name}</p>}
            {filePrev && <img src={filePrev} alt="Preview" style={{ width: '100px', marginTop: '10px' }} />}
            {/* <Image /> */}
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit Category"
        open={isEditModalVisible}
        onOk={() => handleEditCategory(catId)}
        onCancel={handleEditModalCancel}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="categoryName"
            label="Category Name"
            rules={[{ required: true, message: 'Category Name is required' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status" valuePropName="checked">
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
          <Form.Item label="Image">
            <Upload
              beforeUpload={(file) => {
                setFile(file);
                return false;
              }}
              onChange={handleChangeFile}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
            {file && <p>{file.name}</p>}
            {filePrev && <img src={filePrev} alt="Preview" style={{ width: '100px', marginTop: '10px' }} />}
            {/* <Image /> */}
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
