import React, { useEffect, useState } from 'react';
import { Button, Col, Divider, InputNumber, Layout, Row, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';

import RelatedProducts from '../../components/RelatedProduct';

const { Title, Text } = Typography;

export default function ProductDetail() {
    const dispatch = useDispatch();
    return (
        <Layout>
            
            <HeaderHomePage />
            <Content style={{ padding: '0 50px', marginTop: 64 }}>
                <Row gutter={16}>
                    <Col span={10}>
                        <img 
                            src={productDel.imageUrl} 
                            alt={productDel.productName} 
                            style={{ width: '100%', marginBottom: '16px' }}
                        />
                    </Col>
                    <Col span={14}>
                        <Title level={2}>{productDel.productName}</Title>
                        <Text strong style={{ fontSize: '24px' }}>

                        {handleFormatMoney(productDel.price)} 

                            <Text delete style={{ marginLeft: '8px', color: 'gray' }}>
                                {productDel.oldPrice} 
                            </Text>
                            <Text type="danger" style={{ marginLeft: '8px' }}>
                                {productDel.discount}
                            </Text>
                        
                            
                        </Text>
                        <Divider />
                        <Text strong>Chọn màu sắc:</Text>
                        <div>
                            {/* Add color buttons */}
                        </div>
                        <Divider />
                        <Text strong>Chọn size:</Text>
                        <div>
                            {/* Add size buttons */}
                        </div>
                        <Divider />
                        <Text strong>Chọn số lượng:</Text>
                        <InputNumber min={1} defaultValue={1} style={{ marginLeft: '8px' }} />
                        <Divider />
                        <Button type="primary" onClick={() => addToCart(productDel.id)} icon={<ShoppingCartOutlined />} style={{ marginRight: '8px' }}>
                            Thêm vào giỏ hàng
                        </Button>
                        <Button onClick={() => addToWishList(productDel.id)} icon={<HeartOutlined />}>Yêu thích</Button>
                        <Divider />
                        <Comments productId={productDel.id} />
                    </Col>
                </Row>
                <Divider />
                <Title level={3}>Mô Tả Sản Phẩm</Title>
                <Text>
                    {productDel.description}
                </Text>
                <Divider />
                <Title level={3}>Sản Phẩm Liên Quan</Title>
                <RelatedProducts categoryId={productDel.categoryId} /> {/* Add the RelatedProducts component */}
            </Content>
        </Layout>
    );
}
