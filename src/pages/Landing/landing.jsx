import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFacebookSquare } from "react-icons/fa";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { FiInstagram } from "react-icons/fi";
import axios from 'axios';
import './landing.css';

const Landing = () => {
  const [product, setProduct] = useState([]);
  const [sortType, setSortType] = useState('newest');
  const [category, setCategory] = useState('All Category');
  const [mores, setMores] = useState(false);
   const categories = [
    'All Category',
    'Electronics',
    'MobilePhone',
    'HomeDecors',
    'Fashion',
    'Beauty',
    'Toys',
    'Grocery',
    'Books',
  ];
  const navigate = useNavigate();
  const username = localStorage.getItem('name') || '';
  const getProductDetails = async () => {
    try {
      const response = await axios.get('http://localhost:8000/product');
      console.log('fetching successful',response);
      setProduct(response.data);
    } catch (e) {
      console.log(e.message || 'fetching failed');
    }
  };

  useEffect(() => {
    getProductDetails();
  }, []);

  const sortedProducts = [...product].sort((a, b) => {
    if (sortType === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortType === 'price-low') {
      return a.price - b.price;
    } else if (sortType === 'price-high') {
      return b.price - a.price;
    } else if (sortType === 'rating') {
      return b.rating - a.rating;
    }
    return 0;
  });

 const onChangeCategory = ite => {
    setCategory(ite);
  };

  const filteredProduct =
    category === 'All Category'
      ? sortedProducts
      : sortedProducts.filter(
          item => item.category?.toLowerCase() === category.toLowerCase()
        );
  const limitedProducts = filteredProduct.slice(0, 7);

  const more = () => {
    if (!username) {
      setMores(true);
    } else {
      navigate('/allproducts');
    }
  };

  const goLogin = () => {
    navigate('/login');
  };
  const closeModal = () => {
    setMores(false);
  };

  return (
    <div className="landing">
      <div
        className="landing6"
        style={{ display: mores ? 'block' : 'none' }}
      ></div>
      {mores && (
        <div className="landing5" style={{ display: mores ? 'block' : 'none' }}>
          <h4>
            You Are Not Logged In .Please Login Or SignUp to Continue this Site
          </h4>
          <button onClick={goLogin}>Go to Login Page</button>
          <button onClick={closeModal}>Close</button>
        </div>
      )}

      <div className="all5">
        {categories.map((ite, index) => (
  <div className="all4" key={index} onClick={() => onChangeCategory(ite)}>
    {ite}
  </div>
))}

      </div>
      <h1 className="new">New Products</h1>
      <select value={sortType} onChange={e => setSortType(e.target.value)} className='sort' >
        <option value="newest">Newest First</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="rating">Top Rated</option>
      </select>

      <div className="landing1">
        {limitedProducts.length > 0 ? (
          limitedProducts.map(item => (
            <div className="landing2" key={item._id} onClick={more}>
              <div className="landing3">
                <img
                  src={item.image[0]}
                  alt={item.name}
                  style={{ width: '150px' }}
                />
              </div>
              <h3 className="hh">${item.price}</h3>
              <h3 className="name">{item.name}</h3>
              <p>⭐ {item.rating}</p>
            </div>
          ))
        ) : (
          <h1 className="noo">No products found under this category</h1>
        )}
      </div>

      {filteredProduct.length > 7 && (
        <h3
          className="more-text"
          onClick={more}
          style={{
            cursor: 'pointer',
            textAlign: 'center',
            color: '#007bff',
            marginTop: '20px',
          }}
        >
          More...
        </h3>
      )}
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
            <footer>All rights reserved © 2026-2027 Revoo Sales</footer></div>
          </div>
         
    </div>
  );
};

export default Landing;
