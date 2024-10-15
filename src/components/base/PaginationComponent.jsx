import { Pagination } from 'antd'
import React from 'react'

export default function PaginationComponent({ total, pageSize, currentPage, onChange,align,showSizeChanger }) {
  return (
    <>
    <Pagination style={{marginTop : 20}} 
      current={currentPage}
      pageSize={pageSize}
      total={total}
      onChange={onChange}
      showSizeChanger={showSizeChanger}
      showQuickJumper
      align={align}
      />;
    </>
  )
}
