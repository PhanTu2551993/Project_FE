import React, { useEffect, useState } from 'react'
import "./index.css"
import { Button, Form, Input, message, Modal, Select, Space, Table, Upload } from 'antd';
import PaginationComponent from '../../../components/base/PaginationComponent';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { addNewProduct, deleteProduct, getAllProducts, searchAndPagingProducts, updateProduct } from '../../../service/productService';
import useDebounce from '../../../hooks/useDebounce';
import { UploadOutlined } from '@ant-design/icons';
import { fetchAllCategories } from '../../../service/categoryService';
export default function AdminProduct() {

  const {Search} = Input;
  const { confirm } = Modal;

  const dispatch = useDispatch();
  const products = useSelector(state => state.product.content);
  const categories = useSelector(state => state.category.categories);
  const total = useSelector(state => state.product.total);
  const totalElements = useSelector(state => state.product.totalElements);
  const [pageSize,setPageSize] = useState(5);
  const [currentPage,setcurrentPage] = useState(0);
  const [searchKey,setSearchKey] = useState("");
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [filePrev,setFilePrev] = useState(null);
  const [proId,setProId] = useState();
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const debounce = useDebounce(searchKey,300);

  useEffect(()=>{
    dispatch(fetchAllCategories())
  },[]);

  const handleGetPageSize = (current,pageSizeOptions) =>{
    setPageSize(pageSizeOptions);
    setcurrentPage(current-1)
  }

  useEffect(()=>{
    dispatch(searchAndPagingProducts({searchText : debounce,page : currentPage,size :pageSize}))
  },[debounce,pageSize,currentPage,dispatch]);

    const handleSearch = (e) => {
      const value = e.target.value;
      setSearchKey(value);
      setcurrentPage(0)
    };

  const handleAddNewProduct = async () => {
      try {
        
        const values = await addForm.validateFields();
        const formData = new FormData();
        formData.append('productName', values.productName);
        formData.append('description', values.description);
        formData.append('categoryId', values.categoryId);
        if (file) {
          formData.append('image', file);
        }
        await dispatch(addNewProduct(formData)).unwrap(); 
          message.success('Product added successfully');
          addForm.resetFields()
          setIsAddModalVisible(false);
          setFile(null);
          setFilePrev(null);
          dispatch(searchAndPagingProducts({searchText : debounce,page : currentPage,size :pageSize}))
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Failed to add product';
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
         await dispatch(deleteProduct(id)).then(() => {
          message.success('Deleted Product successfully');
         dispatch(searchAndPagingProducts({searchText : debounce,page : currentPage,size :pageSize}))
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
    
    const handleEditProduct = async (id) => {
      try {
        const values = await editForm.validateFields();
        const formEditData = new FormData();
        formEditData.append('productName', values.productName);
        formEditData.append('description', values.description);
        formEditData.append('categoryId', values.categoryId);
        if (file) {
          formEditData.append('image', file);
        }
        await dispatch(updateProduct({id,formEditData})).unwrap();
          setIsEditModalVisible(false);
          setFile(null);
          setFilePrev(null);
          dispatch(searchAndPagingProducts({searchText : debounce,page : currentPage,size :pageSize}))

      } catch (error) {
        console.log(error);
        
      }
    };

    const handleClickEdit = (product) =>{
      console.log("product",product);
      setIsEditModalVisible(true);
      setProId(product.productId);
        editForm.setFieldsValue({
              productName: product.productName,
              description: product.description,
              categoryId : product.categoryId,
          });
          setFilePrev(product.image); 
          setFile(null);
  };

    const columns = [
        {
          title: 'ID',
          dataIndex: 'productId',
          key: 'id',
          sorter: (a, b) => a.productId - b.productId,
        },
        {
          title: 'Product_Name',
          dataIndex: 'productName',
          key: 'productName',
          sorter: (a, b) => a.productName.localeCompare(b.productName),
        }, 

        {
          title: 'Sku',
          dataIndex: 'sku',
          key: 'sku',
          render: (text) => text.length > 10 ? `${text.substring(0, 10)}...` : text,
        },
        {
          title: 'Category',
          dataIndex: 'categoryId',
          key: 'categoryId',
          render : (categoryId) => {
            const category = categories.find(cat => cat.categoryId == categoryId)
            return category ? category.categoryName :'Unknown Category';
          }
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
          render: (image) => (image ? <img src={image} alt="product" style={{ width: 50, height: 50 }} /> : 'No Image'),
        },
        {
          title: 'CreatedAt',
          dataIndex: 'createdAt',
          key: 'createdAt',
          sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
          render: (text) => moment(text).format('DD/MM/YYYY'),
        },
        {
            title: 'UpdatedAt',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
            render: (text) => moment(text).format('DD/MM/YYYY'),
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
                onClick={() => handleDelete(record.productId)}
              >Delete</Button>
            </Space>
          ),
        },
      ];
      const data =  products?.map((item) => ({
        key : item.productId,
        productId : item.productId,
        productName : item.productName,
        sku : item.sku,
        categoryId : item.category.categoryId,
        description : item.description,
        image : item.image,
        createdAt : item.createdAt,
        updatedAt : item.updatedAt,
      }));

  return (
    <>
    <div className='table-product'>
    <Button type="primary" 
            onClick={() => setIsAddModalVisible(true)} 
            style={{ marginBottom: 16 }}>
            Add New Product
    </Button>
    <Search
            placeholder="Search....."
            value={searchKey}
            onChange={handleSearch}
            className='search-product'
          />
    <Table 
    className="custom-table-product"  
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
        title="Add New Product"
        open={isAddModalVisible}
        onOk={handleAddNewProduct}
        onCancel={handleAddModalCancel}
      >
        <Form form={addForm} layout="vertical">
          <Form.Item
            name="productName"
            label="Product Name"
            rules={[{ required: true, message: 'Product Name is required' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>
          <Form.Item name="categoryId" label="Category" rules={[{ required: true, message: 'Category is required' }]}>
          <Select
            placeholder="Select a category"
            // onChange={(value) => addForm.setFieldsValue({ categoryId: value })}
          >
            {categories && categories.map((cat) => (
              <Select.Option key={cat.categoryId} value={cat.categoryId}>
                {cat.categoryName}
              </Select.Option>
            ))}
          </Select>
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
        title="Edit Product"
        open={isEditModalVisible}
        onOk={() => handleEditProduct(proId)}
        onCancel={handleEditModalCancel}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="productName"
            label="Product Name"
            rules={[{ required: true, message: 'Product Name is required' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>
          <Form.Item name="categoryId" label="Category" rules={[{ required: true, message: 'Category is required' }]}>
        <Select
          placeholder="Select a category"
          // onChange={(value) => editForm.setFieldsValue({ categoryId: value })}
        >
          {categories && categories.map((cat) => (
            <Select.Option key={cat.categoryId} value={cat.categoryId}>
              {cat.categoryName}
            </Select.Option>
          ))}
        </Select>
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
