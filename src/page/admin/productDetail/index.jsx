
import React, { useEffect, useState } from 'react'
import "./index.css"
import { Badge, Button, Dropdown, Form, Input, message, Modal, Select, Space, Switch, Table, Upload } from 'antd';
import PaginationComponent from '../../../components/base/PaginationComponent';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import {findAllProducts } from '../../../service/productService';
import useDebounce from '../../../hooks/useDebounce';
import { DownOutlined, UploadOutlined } from '@ant-design/icons';
import { addDetailColorSize, addNewProductDetail, deleteDetailSizeColor, deleteProductDetail, findAllDetailColorSize, findAllProductDetails, searchAndPagingProductDetails, updateDetailSizeColor, updateProductDetail } from '../../../service/productDetailService';

export default function AdminProductDetail() {
    const {Search} = Input;
    const { confirm } = Modal;


    const dispatch = useDispatch();
    const products = useSelector(state => state.product.products);
    const productDetails = useSelector(state => state.productDetail.content);
    // const test = useSelector(state => {console.log("state",state);})
    const detailColorSizes = useSelector(state => state.productDetail.detailColorSize);
    const total = useSelector(state => state.productDetail.total);
    const totalElements = useSelector(state => state.productDetail.totalElements);
    const [pageSize,setPageSize] = useState(5);
    const [currentPage,setcurrentPage] = useState(0);
    const [searchKey,setSearchKey] = useState("");
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isAddModalDetailVisible,setIsAddModalDetailVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isEditDetailModalVisible, setIsEditDetailModalVisible] = useState(false);
    const [file, setFile] = useState(null);
    const [fileDetail, setFileDetail] = useState(null);
    const [filePrev,setFilePrev] = useState(null);
    const [proDetailId,setProDetailId] = useState();
    const [detailSizeColor,setDetailSizeColor] = useState();
    const [addForm] = Form.useForm();
    const [addDetailForm] = Form.useForm();
    const [editForm] = Form.useForm();
    const [editDetailForm] = Form.useForm();
    
  
    const debounce = useDebounce(searchKey,300);
  
    useEffect(()=>{
        dispatch(findAllProducts());
        dispatch(findAllDetailColorSize())
        // dispatch(findAllProductDetails());
    },[]);
  
    const handleGetPageSize = (current,pageSizeOptions) =>{
      setPageSize(pageSizeOptions);
      setcurrentPage(current-1)
    }
  
    useEffect(()=>{
      dispatch(searchAndPagingProductDetails({searchText : debounce,page : currentPage,size :pageSize}))
    },[debounce,pageSize,currentPage,dispatch]);
  
      const handleSearch = (e) => {
        const value = e.target.value;
        setSearchKey(value);
        setcurrentPage(0)
      };
  
    const handleAddNewProductDetail = async () => {
        try {
          
          const values = await addForm.validateFields();
          const formData = new FormData();
          formData.append('productDetailName', values.productDetailName);
          formData.append('status', values.status);
          formData.append('productId', values.productId);
          if (file) {
            formData.append('image', file);
          }
          await dispatch(addNewProductDetail(formData)).unwrap(); 
            message.success('ProductDetail added successfully');
            addForm.resetFields()
            setIsAddModalVisible(false);
            setFile(null);
            setFilePrev(null);
            dispatch(searchAndPagingProductDetails({searchText : debounce,page : currentPage,size :pageSize}))
          } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to add productDetail';
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

      const handleChangeFileDetail = (info) => {
        const fileDetail = info.file;
        const fileReaderDetail = new FileReader();
        
        fileReaderDetail.onload = () => {
          setFilePrev(fileReaderDetail.result);
        };
      
        if (fileDetail) {
          fileReaderDetail.readAsDataURL(fileDetail);
          setFileDetail(fileDetail);
        } else {
          setFileDetail(null);
          setFilePrev(null);
        }
      };

    const handleAddDetail = (productDetail) => {
        setIsAddModalDetailVisible(true);
        setProDetailId(productDetail.productDetailId)
        addDetailForm.setFieldsValue({
           productDetailName : productDetail.productDetailName
        })
    }

    const handleAddDetailModalCancel = ()=>{
        setIsAddModalDetailVisible(false);
        setFileDetail(null);
        setFilePrev(null);
    }
  
    const handleAddNewProductDetailColorSize = async ()=>{
        try {
          
          const values = await addDetailForm.validateFields();
          const formDetailData = new FormData();
          formDetailData.append('colorName', values.colorName);
          formDetailData.append('sizeName', values.sizeName);
          formDetailData.append('quantity', values.quantity);
          formDetailData.append('price', values.price);
          formDetailData.append('description', values.description);
          if (fileDetail) {
            formDetailData.append('image', fileDetail);
          }
          await dispatch(addDetailColorSize({proDetailId,formDetailData})).unwrap(); 
            message.success('Color and Size added successfully');
            addDetailForm.resetFields()
            setIsAddModalDetailVisible(false);
            setFileDetail(null);
            setFilePrev(null);
            dispatch(findAllDetailColorSize())
            dispatch(searchAndPagingProductDetails({searchText : debounce,page : currentPage,size :pageSize}))
          } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to add Color and Size';
            message.error(errorMessage);
            console.error('Add error:', error);
          }
      }

      const handleDeleteProductDetail = (productDetail) => {
        confirm({
          title: 'Are you sure you want to delete this item?',
          content: 'Once deleted, the product detail will be removed permanently.',
          okText: 'Yes, Delete',
          okType: 'danger',
          cancelText: 'No, Cancel',
          onOk: async () => {
            try{
          await dispatch(deleteProductDetail(productDetail.productDetailId)).unwrap();
          message.success('Deleted ProductDetail successfully');
          dispatch(searchAndPagingProductDetails({searchText : debounce,page : currentPage,size :pageSize}))
        }catch(error){
            console.error('Delete error:', error);
        }
          },
          onCancel() {
            console.log('Cancel deletion');
          },
        });
      }

    
      const handleEditModalCancel = () => {
        setIsEditModalVisible(false);
      };
      
      const handleEditProductDetail = async (id) => {
        try {
          const values = await editForm.validateFields();
          const formEditData = new FormData();
          formEditData.append('productDetailName', values.productDetailName);
          formEditData.append('status', values.status);
          formEditData.append('productId', values.productId);
          if (file) {
            formEditData.append('image', file);
          }
          await dispatch(updateProductDetail({id,formEditData})).unwrap();
            setIsEditModalVisible(false);
            setFile(null);
            setFilePrev(null);
            dispatch(searchAndPagingProductDetails({searchText : debounce,page : currentPage,size :pageSize}))
  
        } catch (error) {
          console.log(error);
          
        }
      };

      const handleClickEditDetail = (productDetail) =>{
        setIsEditModalVisible(true);
        setProDetailId(productDetail.productDetailId);
          editForm.setFieldsValue({
            productDetailName: productDetail.productDetailName,
            productId: productDetail.productId,
            status : productDetail.status,
            });
            setFilePrev(productDetail.image); 
            setFile(null);
    };

    const handleDeleteDetailSizeColor = (detailSizeColor) =>{
      confirm({
        title: 'Are you sure you want to delete this item?',
        content: 'Once deleted, the product detail will be removed permanently.',
        okText: 'Yes, Delete',
        okType: 'danger',
        cancelText: 'No, Cancel',
        onOk: async () => {
          try {
            await dispatch(deleteDetailSizeColor({
              productDetailId: detailSizeColor.productDetailId,
              sizeId: detailSizeColor.sizeId,
              colorId: detailSizeColor.colorId
            })).unwrap();
            message.success('Deleted ProductDetail successfully');
            dispatch(findAllDetailColorSize());
            dispatch(searchAndPagingProductDetails({
              searchText: debounce,
              page: currentPage,
              size: pageSize
            }));
          } catch (error) {
            console.log(error);
            message.error('Failed to delete ProductDetail');
          }
        },
        onCancel() {
          console.log('Cancel deletion');
        },
      });
    };

    const handleEditDetailModalCancel = () =>{
      setIsEditDetailModalVisible(false);
    };

    const handleEditProductDetailColorSize = async (detailSizeColor)=>{
      try {
        
        const values = await editDetailForm.validateFields();
        const formEditDetailData = new FormData();
        formEditDetailData.append('colorName', values.colorName);
        formEditDetailData.append('sizeName', values.sizeName);
        formEditDetailData.append('quantity', values.quantity);
        formEditDetailData.append('price', values.price);
        formEditDetailData.append('description', values.description);
        if (fileDetail) {
          formEditDetailData.append('image', fileDetail);
        }
        await dispatch(updateDetailSizeColor({
          productDetailId: detailSizeColor.productDetailId,
          sizeId: detailSizeColor.sizeId,
          colorId: detailSizeColor.colorId,
          formEditDetailData
        })).unwrap(); 
          message.success('Color and Size added successfully');
          addDetailForm.resetFields()
          setIsEditDetailModalVisible(false);
          setFileDetail(null);
          setFilePrev(null);
          dispatch(findAllDetailColorSize())
          dispatch(searchAndPagingProductDetails({searchText : debounce,page : currentPage,size :pageSize}))
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Failed to add Color and Size';
          message.error(errorMessage);
          console.error('Add error:', error);
        }
    };

    const handleClickEditDetailSizeColor = (detailSizeColor)=>{
      setIsEditDetailModalVisible(true);
      setDetailSizeColor(detailSizeColor);
      editDetailForm.setFieldsValue({
        productDetailName : detailSizeColor.productDetailName,
        colorName : detailSizeColor.colorName,
        sizeName : detailSizeColor.sizeName,
        quantity : detailSizeColor.quantity,
        price : detailSizeColor.price,
        status : detailSizeColor.status,
        description : detailSizeColor.description
      })
      setFilePrev(detailSizeColor.image)
      setFileDetail(null)
    }

  
      const columns = [
          {
            title: 'ID',
            dataIndex: 'productDetailId',
            key: 'id',
            sorter: (a, b) => a.productDetailId - b.productDetailId,
          },
          {
            title: 'Product_Detail_Name',
            dataIndex: 'productDetailName',
            key: 'productDetailName',
            sorter: (a, b) => a.productDetailName.localeCompare(b.productDetailName),
          }, 
          {
            title: 'Product',
            dataIndex: 'productId',
            key: 'productId',
            render : (productId) => {
              const product = products.find(pro => pro.productId == productId)
              return product ? product.productName :'Unknown Product';
            }
          },
  
          {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
            sorter: (a, b) => a.stock - b.stock,
          },
   
          {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (image) => (image ? <img src={image} alt="product" style={{ width: 50, height: 50 }} /> : 'No Image'),
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
                onClick={() => handleAddDetail(record)}
                >Add Detail</Button>
                <Button type="link"  
                onClick={() => handleClickEditDetail(record)}
                >
                  Edit
                </Button>
                <Button type="link" danger
                  onClick={() => handleDeleteProductDetail(record)}
                >Delete</Button>
              </Space>
            ),
          },
        ];
        const data =  productDetails?.map((item) => ({
          key : item.productDetailId,
          productDetailId : item.productDetailId,
          productDetailName : item.productDetailName,
          productId : item.product.productId,
          stock : item.stock,
          image : item.image,
          status : item.status,
        }));

        const items = [
          {
            key: '1',
            label: 'Action 1',
          },
          {
            key: '2',
            label: 'Action 2',
          },
        ];

        const expandColumns = [
          {
            title: 'Index',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => index + 1,
          },
          {
            title: 'Color',
            dataIndex: 'colorName',
            key: 'colorName',
            sorter: (a, b) => a.colorName.localeCompare(b.colorName),
          },
          {
            title: 'Size',
            dataIndex: 'sizeName',
            key: 'sizeName',
            sorter: (a, b) => a.sizeName.localeCompare(b.sizeName),
          },
          {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            sorter: (a, b) => a.price - b.price,
          },
          {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            sorter: (a, b) => a.quantity - b.quantity,
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
            title: 'Action',
            key: 'operation',
            render: (text, record) => (
              <Space size="middle">
                <Button type="link"  
                onClick={() => handleClickEditDetailSizeColor(record)}
                >
                  Edit
                </Button>
                <Button type="link" danger
                  onClick={() =>
                    handleDeleteDetailSizeColor(record)
                  }
                >Delete</Button>
                <Dropdown
                  menu={{
                    items,
                  }}
                >
                  <a>
                    More <DownOutlined />
                  </a>
                </Dropdown>
              </Space>
            ),
          },
        ];
      
        const expandedRowRender = (record) => { 
          const expandDataSource = detailColorSizes
            ?.filter((item) => item.productDetail.productDetailId === record.productDetailId) 
            .map((item,index) => 
              ({
              key: index,
              index: index + 1,
              productDetailId : item.productDetail.productDetailId,
              colorName: item.color.colorName,
              colorId : item.color.colorId,
              sizeName: item.size.sizeName,
              productDetailName : item.productDetail.productDetailName,
              sizeId: item.size.sizeId,
              description : item.description,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
            })
          );
        
          return (
            <Table
              columns={expandColumns}
              dataSource={expandDataSource}
              pagination={false}
            />
          );
        };
  
    return (
      <>
      <div className='table-productDetail'>
      <Button type="primary" 
              onClick={() => setIsAddModalVisible(true)} 
              style={{ marginBottom: 16 }}>
              Add New Product_Detail
      </Button>
      <Search
              placeholder="Search....."
              value={searchKey}
              onChange={handleSearch}
              className='search-productDetail'
            />
      <Table 
      className="custom-table-productDetail"  
      columns={columns} 
      dataSource={data} 
      expandable={{
        expandedRowRender,
      }}
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
          title="Add New ProductDetail"
          open={isAddModalVisible}
          onOk={handleAddNewProductDetail}
          onCancel={handleAddModalCancel}
        >
          <Form form={addForm} layout="vertical">
            <Form.Item
              name="productDetailName"
              label="Product Detail Name"
              rules={[{ required: true, message: 'ProductDetail Name is required' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="status" label="Status" valuePropName="checked">
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
            <Form.Item name="productId" label="Product" rules={[{ required: true, message: 'Product is required' }]}>
            <Select
              placeholder="Select a product"
              // onChange={(value) => addForm.setFieldsValue({ categoryId: value })}
            >
              {products && products.map((pro) => (
                <Select.Option key={pro.productId} value={pro.productId}>
                  {pro.productName}
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
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Add Size Color"
          open={isAddModalDetailVisible}
          onOk={handleAddNewProductDetailColorSize}
          onCancel={handleAddDetailModalCancel}
        >
          <Form form={addDetailForm} layout="vertical">
            <Form.Item
              name="productDetailName"
              label="Product Detail Name"
            >
              <Input readOnly/>
            </Form.Item>
            <div style={{display : 'flex',justifyContent : 'space-between'}}>
               <Form.Item
              name="colorName"
              label="Color"
              rules={[{ required: true, message: 'Color is required' }]}
            >
              <Input/>
            </Form.Item>
            <Form.Item
              name="sizeName"
              label="Size"
              rules={[{ required: true, message: 'Size is required' }]}
            >
              <Input/>
            </Form.Item>
            </div>
            <div style={{display : 'flex',justifyContent : 'space-between'}}>
               <Form.Item
              name="quantity"
              label="Quantity"
              rules={[{ required: true, message: 'Quantity is required' }]}
            >
              <Input/>
            </Form.Item>
            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: 'Price Name is required' }]}
            >
              <Input/>
            </Form.Item>
            </div>
            <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>
            <Form.Item label="Image">
              <Upload
                beforeUpload={(fileDetail) => {
                  setFileDetail(fileDetail);
                  return false;
                }}
                onChange={handleChangeFileDetail}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>Select Image</Button>
              </Upload>
              {fileDetail && <p>{fileDetail.name}</p>}
              {filePrev && <img src={filePrev} alt="Preview" style={{ width: '100px', marginTop: '10px' }} />}
            </Form.Item>
          </Form>
        </Modal>
  
        <Modal
          title="Edit Product_Detail"
          open={isEditModalVisible}
          onOk={() => handleEditProductDetail(proDetailId)}
          onCancel={handleEditModalCancel}
        >
          <Form form={editForm} layout="vertical">
            <Form.Item
              name="productDetailName"
              label="Product Detail Name"
              rules={[{ required: true, message: 'ProductDetail Name is required' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="status" label="Status" valuePropName="checked">
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
            <Form.Item name="productId" label="Product" rules={[{ required: true, message: 'Product is required' }]}>
            <Select
              placeholder="Select a product"
              // onChange={(value) => addForm.setFieldsValue({ categoryId: value })}
            >
              {products && products.map((pro) => (
                <Select.Option key={pro.productId} value={pro.productId}>
                  {pro.productName}
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
            </Form.Item>
          </Form>
        </Modal>  

        <Modal
          title="Edit Size Color"
          open={isEditDetailModalVisible}
          onOk={() => handleEditProductDetailColorSize(detailSizeColor)}
          onCancel={handleEditDetailModalCancel}
        >
          <Form form={editDetailForm} layout="vertical">
            <Form.Item
              name="productDetailName"
              label="Product Detail Name"
            >
              <Input readOnly/>
            </Form.Item>
            <div style={{display : 'flex',justifyContent : 'space-between'}}>
               <Form.Item
              name="colorName"
              label="Color"
              rules={[{ required: true, message: 'Color is required' }]}
            >
              <Input/>
            </Form.Item>
            <Form.Item
              name="sizeName"
              label="Size"
              rules={[{ required: true, message: 'Size is required' }]}
            >
              <Input/>
            </Form.Item>
            </div>
            <div style={{display : 'flex',justifyContent : 'space-between'}}>
               <Form.Item
              name="quantity"
              label="Quantity"
              rules={[{ required: true, message: 'Quantity is required' }]}
            >
              <Input/>
            </Form.Item>
            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: 'Price Name is required' }]}
            >
              <Input/>
            </Form.Item>
            </div>
            <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>
            <Form.Item label="Image">
              <Upload
                beforeUpload={(fileDetail) => {
                  setFileDetail(fileDetail);
                  return false;
                }}
                onChange={handleChangeFileDetail}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>Select Image</Button>
              </Upload>
              {fileDetail && <p>{fileDetail.name}</p>}
              {filePrev && <img src={filePrev} alt="Preview" style={{ width: '100px', marginTop: '10px' }} />}
            </Form.Item>
          </Form>
        </Modal>     
      </>
    )
  }

