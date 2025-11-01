import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { assets, dummyOrders } from '../../assets/assets';
import axios from 'axios';
import toast from 'react-hot-toast';


const Orders = () => {
  const { currency } = useAppContext();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    // Simulated API call
    try {
      const {data}=await axios.get('/api/order/seller');
      if(data.success){
        setOrders(data.orders)
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    // setOrders(dummyOrders);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
      <div className="md:p-10 p-4 space-y-4">
        <h2 className="text-lg font-medium">Orders List</h2>

        {orders.length === 0 && (
          <p className="text-center text-gray-500">No orders available.</p>
        )}

        {orders.map((order, index) => (
          <div
            key={index}
            className="flex flex-col md:items-center md:flex-row gap-5 justify-between p-5 max-w-4xl rounded-md border border-gray-300"
          >
            {/* Left - Order Items */}
            <div className="flex gap-5 max-w-80">
              <img
                className="w-12 h-12 object-cover"
                src={assets.box_icon}
                alt="boxIcon"
              />
              <div>
                {order.items.map((item, i) => (
                  <div key={i} className="flex flex-col">
                    <p className="font-medium">
                      {item.product.name}{' '}
                      <span className="text-primary">x {item.quantity}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Middle - Shipping Address */}
            <div className="text-sm md:text-base text-black/60">
              <p className="text-black/80 font-medium">
                {order.address.firstName} {order.address.lastName}
              </p>
              <p>
                {order.address.street}, {order.address.city}
              </p>
              <p>
                {order.address.state}, {order.address.zipCode},{' '}
                {order.address.country}
              </p>
              <p>{order.address.phone}</p>
            </div>

            {/* Right - Amount */}
            <p className="font-medium text-lg my-auto whitespace-nowrap">
              {currency}
              {order.amount}
            </p>

            {/* Far Right - Payment Details */}
            <div className="flex flex-col text-sm text-black/60">
              <p>
                <span className="font-medium text-black">Method:</span>{' '}
                {order.paymentType}
              </p>
              <p>
                <span className="font-medium text-black">Date:</span>{' '}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium text-black">Payment:</span>{' '}
                {order.isPaid ? 'Paid' : 'Pending'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
