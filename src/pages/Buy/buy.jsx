import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LiaPaypal } from "react-icons/lia";
import Confetti from "react-confetti";
import { IoBagCheckOutline } from "react-icons/io5";
import { MdOutlineSummarize } from "react-icons/md";
import "./buy.css";

const Buy = () => {
  const [address, setAddress] = useState(null);
   const [paymentMethod, setPaymentMethod] = useState("");
  const [editing, setEditing] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    houseNo: "",
    street: "",
    locality: "",
    city: "",
    state: "",
    pincode: "",
   
  });
  const [cartItems, setCartItems] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

 
  const fetchAddress = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/address/${userId}`);
      setAddress(res.data);
      setEditing(false);
    } catch (err) {
      console.log("No address found");
      setAddress(null);
    }
  };


  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/cart/${userId}`);
      setCartItems(res.data);
    } catch (err) {
      console.log("Error fetching cart:", err.message);
    }
  };

  const saveAddress = async () => {
   

    try {
      const res = await axios.post("http://localhost:8000/address", {
        userId,
        ...newAddress,
      });
      alert(res.data.message);
      fetchAddress(); 
      setNewAddress({
        name: "",
        phone: "",
        houseNo: "",
        street: "",
        locality: "",
        city: "",
        state: "",
        pincode: "",
        
      });
    } catch (err) {
      console.log(err);
      alert("Failed to save address");
    }
  };

 
  const placeOrder = async () => {
  if (!address) {
    alert("Please add a delivery address before placing order!");
    return;
  }

  if (!paymentMethod) {
    alert("Please select a payment method before placing the order!");
    return;
  }

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
    0
  );

  try {
    
    await axios.post("http://localhost:8000/orders", {
      userId,
      items: cartItems.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        size: item.size,
        price: item.productId.price,
      })),
      address,
      paymentMethod,
      totalAmount,
    });

   
    await axios.delete(`http://localhost:8000/cart/user/${userId}`);

    setOrderPlaced(true);
  } catch (error) {
    console.error("Error placing order:", error.message);
    alert("Failed to place order. Try again!");
  }
};


  useEffect(() => {
    fetchAddress();
    fetchCart();
  }, []);

  return (
    <div className="buy">
      {orderPlaced && (
        <div className="overlay">
          <Confetti width={window.innerWidth} height={window.innerHeight} />
          <div className="order-confirmation">
            <h2>🎉 Your Order Has Been Placed!🎉🎉</h2>
            <p>It will be delivered to your address within <b>5–7 days</b>.</p>
            <button onClick={() => navigate("/allproducts")}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {!orderPlaced && (
        <div className="buy-container">
          <h2><IoBagCheckOutline className="bag" /> Checkout</h2>

          <div className="address-section">
            <h3>Delivery Address</h3>

            {address && !editing ? (
              <div className="address-display">
                <p><b>{address.name}</b> ({address.phone})</p>
                <p>
                  {address.houseNo}, {address.street}, {address.locality}
                </p>
                <p>
                  {address.city}, {address.state} - {address.pincode}
                </p>
                
                <button
                  onClick={() => {
                    setEditing(true);
                    setNewAddress(address);
                  }}
                >
                  Change Address
                </button>
              </div>
            ) : (
              <div className="address-form">
                <input
                  placeholder="Full Name"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({  name: e.target.value })}
                />
                <input
                  placeholder="Phone Number"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({  phone: e.target.value })}
                />
                <input
                  placeholder="House No."
                  value={newAddress.houseNo}
                  onChange={(e) => setNewAddress({  houseNo: e.target.value })}
                />
                <input
                  placeholder="Street"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                />
                <input
                  placeholder="Locality"
                  value={newAddress.locality}
                  onChange={(e) => setNewAddress({ ...newAddress, locality: e.target.value })}
                />
                <input
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                />
                <input
                  placeholder="State"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                />
                <input
                  placeholder="Pincode"
                  value={newAddress.pincode}
                  onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                />
                
                <div className="address-buttons">
                  <button onClick={saveAddress}>Save Address</button>
                  {address && (
                    <button onClick={() => setEditing(false)}>Cancel</button>
                  )}
                </div>
              </div>
            )}
          </div>

       
          <div className="order-summary">
            <h3    ><MdOutlineSummarize/>Order Summary</h3>
            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div key={item._id} className="summary-item">
                    <img
                      src={item.productId?.image?.[0]}
                      alt={item.productId?.name}
                    />
                    <div>
                      <p>{item.productId?.name}</p>
                      <p>Size: {item.size}</p>
                      <p>Qty: {item.quantity}</p>
                      <p>₹{item.productId?.price}</p>
                    </div>
                  </div>
                ))}
                <hr />
                <h4>
                  Total: ₹
                  {cartItems.reduce(
                    (sum, item) =>
                      sum + (item.productId?.price || 0) * item.quantity,
                    0
                  )}
                </h4>
              </>
            )}
          </div>
          <div className="payment-section">
            <h3> <LiaPaypal/> Payment Method</h3>
            <label>
              <input
                type="radio"
                name="payment"
                value="Cash on Delivery"
                checked={paymentMethod === "Cash on Delivery"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery
            </label>

            <label>
              <input
                type="radio"
                name="payment"
                value="UPI"
                checked={paymentMethod === "UPI"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              UPI Payment
            </label>

            <label>
              <input
                type="radio"
                name="payment"
                value="Credit/Debit Card"
                checked={paymentMethod === "Credit/Debit Card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Credit / Debit Card
            </label>
          </div>

          <button className="place-btn" onClick={placeOrder}>
            Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default Buy;
