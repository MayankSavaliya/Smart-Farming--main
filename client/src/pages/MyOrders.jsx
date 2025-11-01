import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Using direct axios import
import { useAppContext } from '../context/AppContext';

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { currency, user } = useAppContext(); // Removed axios from here to avoid conflict

  const fetchMyOrders = async () => {
    try {
const { data } = await axios.post('/api/order/user', { userId: user._id });
      if (data.success) {
        setMyOrders(data.orders);
      } else {
        console.error('Error:', data.message);
      }
    } catch (error) {
      console.error('Fetch Orders Error:', error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  const getStatusText = (status) => {
  const statusMap = {
    'Processing': 'Order Processing',
    'Shipped': 'Order Shipped',
    'Delivered': 'Order Delivered',
    'Cancelled': 'Order Cancelled'
  };
  return statusMap[status] || 'Unknown';
};


  return (
    <div className="mt-16 pb-16">
      <div className="flex flex-col items-end w-max mb-8">
        <p className="text-2xl font-medium uppercase">My Orders</p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>

      {myOrders.length === 0 && (
        <p className="text-center text-gray-500">No orders found.</p>
      )}

      {myOrders.map((order, index) => (
        <div
          key={index}
          className="border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl"
        >
          <p className="flex justify-between md-items-center text-gray-400 md:font-medium max-md:flex-col">
            <span>Order ID: {order._id}</span>
            <span>Payment: {order.paymentType}</span>
            <span>Total Amount: {currency}{order.amount}</span>
          </p>
              {/* console.log(Order ID); */}
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className={`relative bg-white text-gray-500/70 ${
                order.items.length !== idx + 1 && 'border-b'
              } border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl`}
            >
              <div className="flex items-center mb-4 md:mb-0">
                <div className="bg-primary/10 p-4 rounded-lg">
                  <img
                    src={item.product?.image?.[0] || '/placeholder.png'}
                    alt={item.product?.name || 'Product'}
                    className="w-16"
                  />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-medium text-gray-800">
                    {item.product?.name || 'Unnamed Product'}
                  </h2>
                  <p>Category: {item.product?.category || 'N/A'}</p>
                </div>
              </div>

              <div className="flex flex-col justify-center md:ml-8 mb-4 md:mb-0">
                <p>Quantity: {item.quantity || '1'}</p>
                <p>Status: {getStatusText(order.status)}</p>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>

             <p className="text-primary text-lg font-medium">
              Amount: {currency}
              {(item.product?.offerPrice || 0) * (item.quantity || 1)}
            </p>

            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
