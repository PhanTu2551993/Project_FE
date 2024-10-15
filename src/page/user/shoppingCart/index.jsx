import { DeleteOutlined, MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons'
import { Drawer, Image } from 'antd'
import React from 'react'
import "./index.css"

export default function ShoppingCart({onClose,open}) {
  return (
    <>
    <Drawer title="Shopping Cart" onClose={onClose} open={open}>
        <div className='shoppingcart-container'>
        <Image style={{width :50,height:50}}/>
        <p>Name</p>
        <div className="flex items-center">
                <MinusSquareOutlined
                //   onClick={() => handleUpdateQuantity(cart.id, cart.orderQuantity - 1)}
                //   className="cursor-pointer"
                />
                <PlusSquareOutlined
                //   onClick={() => handleUpdateQuantity(cart.id, cart.orderQuantity + 1)}
                //   className="cursor-pointer"
                />
                <DeleteOutlined
                //   onClick={() => handleRemoveItem(cart.id)}
                //   className="cursor-pointer text-red-500 ml-4"
                />
            </div>
        </div>
    </Drawer>
    </>
  )
}

