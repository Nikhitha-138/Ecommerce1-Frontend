import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHeart, FaShareAlt } from 'react-icons/fa';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { FaFacebookSquare } from "react-icons/fa";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { FiInstagram } from "react-icons/fi";
import { useDispatch } from 'react-redux';
import { increment } from '../../redux/counterslice';
import './detail.css';


const Detail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState({});
  const [products, setProducts] = useState([]);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
 const dispatch=useDispatch()
  const navigate = useNavigate();

  
  const fetchProductDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/product/${productId}`);
      const data = res.data.product || res.data;
      setProduct(data);
      if (data.image && data.image.length > 0) {
        setMainImage(data.image[0]);
      }
    } catch (e) {
      console.log(e.message || 'Cannot fetch product details');
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

   const onClickCart=()=>{
    dispatch(increment())
   }
 
  const addToCart = async alertMessage => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Please login first.');
      return navigate('/login');
    }
   
    try {
      await axios.post('http://localhost:8000/cartadded', {
        userId,
        productId,
        quantity,
        size: selectedSize || product.size ,
      });
     localStorage.setItem('selectedSize', selectedSize );
   console.log('Sending size to backend:', selectedSize);

      alert(alertMessage);

      navigate(`/cart/${userId}`);
    } catch (err) {
      console.error('Add to cart failed:', err.message);
      alert('Failed to add item to cart.');
    }
  };

  const handleAddToCart = () => addToCart('Item added to cart successfully!');
  const handleBuyNow = () =>
    addToCart(
      'You can buy this item now!It will stored in Cart and you can buy this item with cart items'
    );

  const fetchDetails = async () => {
    try {
      const res = await axios.get('http://localhost:8000/product');
      setProducts(res.data.user || res.data);
    } catch (e) {
      console.log(e.message || 'Fetching Failed');
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  return (
    <div className="details">
      <div className="detail">
        <div className="detail6">
          <div className="detail8">
            <div className="detail7">
              {mainImage && <img src={mainImage} alt="" className="main" />}
            </div>

            <div className="thumbs">
              {product.image?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setMainImage(img)}
                  className="thumb"
                  alt=""
                />
              ))}
            </div>

            <div className="detail9">
              <button className="button1" onClick={handleBuyNow}>
                Buy Now
              </button>
              <button className="button2" onClick={()=>{handleAddToCart(),onClickCart()}} >
                Add to Cart <MdOutlineShoppingCart />
              </button>
            </div>

            <div className="size-selector">
 
<div  className='size-options'>
  {product.category === 'Fashion' ? (
  <div>
    
    <div>
      <h4>Select Size:</h4>
      {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((ite, i) => (
        <button
          key={i}
          onClick={() => setSelectedSize(ite)}
          style={{
            margin: '5px',
            padding: '6px 10px',
            cursor: 'pointer',
            border: '2px solid black' ,
            backgroundColor: 'gray',
            borderRadius:'10px',
            color:'white',
          }}
        >
          {ite}
        </button>
      ))}
    </div>
    {selectedSize && <p>Selected: {selectedSize}</p>}
  </div>
) : (
  <div>
    <h4>Size:Free Size</h4>
   
  </div>
)}

</div>



</div>

          </div>
        </div>

        <div className="infosection">
          <h3 className="product-description">{product.name}</h3>
          <p className="product-price">₹{product.price}</p>

          <div className="rating">
            <button>{product.rating}</button>
            <label className='free' >Free Delivery</label>

            <div className="extra-actions">
              <button className="wishlist">
                <FaHeart /> Wishlist
              </button>
              <button className="share">
                <FaShareAlt /> Share
              </button>
            </div>
          </div>
          <h3 className='m'>Description</h3>
          <ul className="desc">
            {product.description &&
              product.description
                .split(/;|\./)
               .filter(item => item.trim())
    .map((ite, i) => (
      <li key={i}>{ite}</li>
    ))}
          </ul>
        </div>
        <div className="ano"></div>
      </div>

      <div className="detaill">
        {products
          .filter(
            item => item._id !== productId && item.category === product.category
          )
          .map(item => (
            <div
              className="all2"
              key={item._id}
              onClick={() => navigate(`/detail/${item._id}`)}
            >
              <div className="image-container">
                <img src={item.image[0]} alt={item.name} className="image" />
              </div>
              <h3 className="hh">₹{item.price}</h3>
              <h3 className="name">{item.name}</h3>
              <h3>stock:{item.stock}</h3>
              <p>Condition:{item.option}</p>

            </div>
          ))}
      </div>
        <section id="about" className="about-section">
  <h2 className='rev'>About Us</h2>
  <p className='revo'>
   <span className='revoo'> Revoo — Where New Meets Renewed</span> <br />
    Revoo is a fresh marketplace where new items meets renewed.
    It is the  place where brand-new and secondhand  items come together.
    Revoo connects buyers and sellers of both new and renewed items . It’s your one-stop platform to give products a second life and discover great deals.
    This platform helps you to buy items at less price ,also you can sell your new and old products in this platform,so all are welcome
  </p>
</section>
      <div className="footer">
              <div className="contacts">
             <div className="contact">
      
               <h3>Connect us with</h3>
               
               <a href="https://www.instagram.com/"  className='ico1' > <FiInstagram/></a>
               <a href="https://www.facebook.com/" className='ico2'><FaFacebookSquare/></a>
               <a href="https://web.whatsapp.com/" className='ico3'><IoChatbubbleEllipsesOutline/></a>
               </div>
               <div className="con">
                <h3>Contact us for any queries</h3>
                <h4>+919745478133</h4>
               </div>
             
             </div>
             <div className="foots">
            <footer>All rights reserved © 2026-2027 OldNew Sales</footer></div>
          </div>
    </div>
  );
};

export default Detail;
