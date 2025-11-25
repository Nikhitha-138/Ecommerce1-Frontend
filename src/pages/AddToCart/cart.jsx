import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Confetti from 'react-confetti'; 
import './cart.css';

const Cart = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  const navigate = useNavigate();

  const fetchCart = async () => {
    const userId = localStorage.getItem('userId');
    
    
    console.log('userId from localStorage:', userId);

    if (!userId) {
      console.log(' No userId, redirecting to login');
      alert('Please login to view your cart');
      return navigate('/login');
    }
    const selectedSize = localStorage.getItem('selectedSize');
console.log('Selected sizess:', selectedSize);


    try {
      const res = await axios.get(`http://localhost:8000/cart/${userId}`);
      console.log(' Cart data received:', res.data);
      setItems(res.data);
    } catch (err) {
      console.error(' Error fetching cart:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return <div className="cart"><p>Loading cart...</p></div>;
  }

  const onDelete=async(id)=>{
    try{
    const res=await axios.delete(`http://localhost:8000/cart/${id}`)
    console.log('item deleted successfully ')
   fetchCart()}


    catch(e){
      console.log(e.message || "item not deleted")
    }
  }

 const clearCartAfterCheckout = async () => {
    const userId = localStorage.getItem('userId');
    try {
      await axios.delete(`http://localhost:8000/cart/user/${userId}`);
      console.log('All items removed after checkout');
      setItems([]); 
    } catch (e) {
      console.log('Failed to clear cart after checkout:', e.message);
    }
  };
  
  

  return (
    <div className="cart">


     

      <div className="carted">
      <h2 className='car'>Cart</h2>
      {items.length === 0 ? (
        <div  className='noitem'>
          <p>No items in cart.</p>
          <button className='cont' onClick={() => navigate('/allproducts')}>
            Continue Shopping
          </button>
        </div>
      ) : (
       <div className="cart-items">
  {items.map(item => (
    <div key={item._id} className="cartitem">
      <div className="cart-item">
        <div className="cartitems">
          <img src={item.productId?.image?.[0]} alt={item.productId?.name} />
          <div className="cart-item-details">
            <h3>{item.productId?.name}</h3>
            <p>₹{item.productId?.price} <span className="offer">33% Off on evey first order</span></p>
            <p>{item.stock}</p>
            
            <p>Anu issue easy returns within 10 Days</p>
            <p>Size: {item.size} • Qty: {item.quantity}</p>

            <p> Estimated Arrival:{item.dispatchDate}</p>

          </div>
        </div>

        <div className="cartchange">
          
          <button  onClick={()=>{onDelete(item._id)}} className="remove">✕ REMOVE</button>
        </div>
      </div>
      <div className="cartfooter">
       
        <span>Free Delivery</span>
      </div>
    </div>
  ))}

  <div className="cart-summary">
            <h3>Total Items: {items.length}</h3>
            <h3 className='total' >
              Total: ₹
              {items.reduce((sum, item) => 
                sum + (item.productId?.price || 0) * item.quantity, 0
              )}
            </h3>
            <button className="checkout-btn"onClick={()=>{navigate('/buy')}} >Proceed to Checkout</button>
          </div>
          
          <button  className='cont'  onClick={()=>{navigate('/allproducts')}}>Continue Shopping </button>
</div>

      )}
    </div>
    </div>
  );
};

export default Cart;
