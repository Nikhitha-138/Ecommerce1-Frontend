import React, { useEffect, useState } from "react";
import axios from "axios";
import "./order.css";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/orders/${userId}`);
        setOrders(res.data);
      } catch (err) {
        console.log("Error fetching orders:", err.message);
      }
    };
    fetchOrders();
  }, [userId]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <h4>Order ID: {order._id}</h4>
            <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            <p>Payment: {order.paymentMethod}</p>
            <p>Status: {order.status}</p>
            <h5>Items:</h5>
            {order.items.map((item, i) => (
              <div key={i} className="order-item">
                <img src={item.productId?.image?.[0]} alt={item.productId?.name} />
                <div>
                  <p>{item.productId?.name}</p>
                  <p>Qty: {item.quantity}</p>
                  <p>₹{item.price}</p>
                </div>
              </div>
            ))}
            <h4>Total: ₹{order.totalAmount}</h4>
          </div>
        ))
      )}
    </div>
  );
};

export default Order;
