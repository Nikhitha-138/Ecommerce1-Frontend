import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFacebookSquare } from "react-icons/fa";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { FiInstagram } from "react-icons/fi";
import axios from 'axios';
import './old.css';

const Old = () => {
    const nav=useNavigate()
  const [product, setProduct] = useState([]);
   const [visible, setVisible] = useState([]);      
   const [sortType, setSortType] = useState('newest');
  const [category, setCategory] = useState('All Category');
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
  const subCategories = {
    Electronics: ["Laptop", "Camera", "Headphones","AC","Refrigrator","Washine Machine","Microwave","Mixi","Grinder","Speaker","Earpodes","TV"],
    MobilePhone:["Samsung","Redmi","Oppo","Vivo","Iphone","Nokia","Nothing","Motorola","Realme"],
    HomeDecors: [
  "Wall Art",
  "Clocks",
  "Lamps & Lighting",
  "Curtains",
  "Cushions",
  "Indoor Plants",
  "Showpieces",
  "Candles",
  "Rugs & Carpets",
  "sofa"
],
    Fashion: ["Men Items", "Women Items", "Kids Items","Women Dress","Mens Dress","Kids Dress","Midi Dress","shiffon Dress", "Jewellery",
  "Bags",
  "Watches",
  "Winter Wear",
  "Ethnic Wear",
  "Sports Wear",
  "Accessories"],
  Beauty: [
  "Makeup",
  "Skincare",
  "Haircare",
  "Fragrances",
  "Bath & Body",
  "Nails",
  "Beauty Tools",
  "Personal Care",
  "Face wash",
  "Cream"
],
    Grocery: ["Fruits", "Vegetables", "Snacks","Eatables","Juice","Curry Powders","Flours"],
    Books: ["Fiction", "Education", "Comics","Horror","Comedy","Guides","Financial","Novels","Magazines"],
  };

  const fetchOldProducts = async () => {
    try {
      const res = await axios.get('http://localhost:8000/product');
      const oldProducts = res.data.filter(item => item.option === 'old');
      setProduct(oldProducts);
      setVisible(oldProducts)
    } catch (e) {
      console.log(e.message || 'Fetching Failed');
    }
  };
  useEffect(() => {
    fetchOldProducts();
  }, []);
const sortedProducts = [...visible].sort((a, b) => {
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
  const onChangeCategory = (cat) => {
    setCategory(cat);

    if (cat === "All Category") {
      setVisible(product);
    } else {
      const filtered = product.filter(
        (item) => item.category?.toLowerCase() === cat.toLowerCase()
      );
      setVisible(filtered);
    }
  };

  
 const onCategory = (sub) => {
  const words = sub.toLowerCase().split(/\s+/); 

  const filtered = product.filter((item) => {
    const text = (
      (item.name || "") +
      " " +
      (item.category || "") +
      " " +
      (item.description || "")
    ).toLowerCase();

    
    return words.every(word => text.includes(word));
  });

  setVisible(filtered);
};


  return (
    <div className="als">
      <h2>Renewed / Old Products</h2>
       <div className="all5">
        {categories.map((ite, idx) => (
            <div className="all4 " key={idx}>
              <div onClick={() => onChangeCategory(ite)}>
                {ite}
              </div>

              {subCategories[ite] && (
                <div className="dropdown-menu">
                  {subCategories[ite].map((item, id) => (
                    <div
                      key={id}
                      className="dropdown-item"
                      onClick={() => onCategory(item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

      </div>

      <select value={sortType} onChange={e => setSortType(e.target.value) } className='sort'>
        <option value="newest">Newest First</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="rating">Top Rated</option>
      </select>
      <div className="al1">
        {sortedProducts.length > 0 ? (
          sortedProducts.map(item => (
            <div className="all2" key={item._id} onClick={()=>{nav(`/detail/${item._id}`)}} >
              <img src={item.image[0]} alt={item.name} className="image" />
              <h3 className="hh">₹{item.price}</h3>
              <h3 className="name">{item.name}</h3>
              <p>⭐ {item.rating}</p>
            </div>
          ))
        ) : (
          <h3 className="noo">No old products found</h3>
        )}
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
                  <a href="https://www.instagram.com/" className='ico1'><FiInstagram /></a>
                  <a href="https://www.facebook.com/" className='ico2'><FaFacebookSquare /></a>
                  <a href="https://web.whatsapp.com/" className='ico3'><IoChatbubbleEllipsesOutline /></a>
                </div>
      
                <div className="con">
                  <h3>Contact us for any queries</h3>
                  <h4>+919745478133</h4>
                </div>
              </div>
      
              <div className="foots">
                <footer>All rights reserved © 2026-2027 Revoo Sales</footer>
              </div>
            </div>
    </div>
  );
};

export default Old;
