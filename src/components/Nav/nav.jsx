import { MdOutlineShoppingCart } from 'react-icons/md';
import { IoPeople } from 'react-icons/io5';
import {
  FaSearch,
  FaUserCircle,
  FaBoxOpen,
  FaTrashAlt,
  FaSignOutAlt,
} from 'react-icons/fa';
import { FcAbout } from "react-icons/fc";
import { IoBag } from "react-icons/io5";
import { useSelector } from 'react-redux';
import './nav.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Nav = () => {
  const nav = useNavigate();
  const [username, setUsername] = useState(localStorage.getItem('name'));
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [mores, setMores] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [num,setNum]=useState(0)

  const fetchDetails = async () => {
    try {
      const res = await axios.get('http://localhost:8000/product');
      
      setProducts(res.data);
      console.log('Fetched successfully');
    } catch (e) {
      console.log(e.message || 'Fetching Failed');
    }
  };

  useEffect(() => {
    fetchDetails();
    setUsername(localStorage.getItem('name'));
  }, []);
  
const count=useSelector(state=>{
  return state.counter.count
  
})
/*useEffect(() => {
    localStorage.setItem("count", count);
  }, [count]);*/

  const onLogin = () => nav('/login');

  const onLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    setUsername('');
    setProfileOpen(false);
    nav('/');
  };

  const onClicks = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Please login to view your cart');
      nav('/login');
    } else {
      nav(`/cart/${userId}`);
    }
  };

  const more = () => {
    if (!username) setMores(true);
    else nav('/sellLog');
  };

  const goLogin = () => nav('/login');
  const closeModal = () => setMores(false);

 const onSearch = e => {
  const val = e.target.value;
  setSearchTerm(val);

  if (val.trim() === '') {
    setFiltered([]);
  } else {
    const results = products.filter(
      ite =>
        ite.name?.toLowerCase().includes(val.toLowerCase()) ||
        ite.category?.toLowerCase().includes(val.toLowerCase())
    );
    setFiltered(results);
  }
};

  const goToProduct = id => {
    nav(`/detail/${id}`);
    setSearchTerm('');
    setFiltered([]);
  };

  const scrollToSection = id => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const onDelete = async () => {
    try {
      const userId = localStorage.getItem('userId');
      await axios.delete(`http://localhost:8000/user/${userId}`);
      console.log('user deleted successfuly');
     
      localStorage.removeItem('token');
      localStorage.removeItem('name');
      localStorage.removeItem('userId');
      setUsername('');
      setProfileOpen(false);
      alert('Account deleted successfully!');
    } catch (e) {
      console.log(e.message || 'product deletion failed');
    }
  };

  const userProduct = () => {
    const userId = localStorage.getItem('userId');
    nav(`/user/${userId}`);
    console.log(userId);
  };


  const onChangePassword = () => {
    setProfileOpen(false);
    nav('/changepassword');
  };

  const onOrder=()=>{
    setProfileOpen(false);
    nav('/order');
  }

  return (
    <div className="nav">
      {mores && (
        <>
          <div className="landing6"></div>
          <div className="landing5">
            <h4>You Are Not Logged In. Please Login Or SignUp to Continue.</h4>
            <button onClick={goLogin}>Go to Login Page</button>
            <button onClick={closeModal}>Close</button>
          </div>
        </>
      )}

      <div className="nav1">
        <div className="nav2">
          <h3 onClick={() => { nav('/allproducts'); }}>Revoo</h3>
        </div>
         <div className="navs">
        <div className="nav4">
          <div className="search-box">
            <div className="sea">
              <input
                type="search"
                placeholder="Search for products"
                value={searchTerm}
                onChange={onSearch}
              />
              <FaSearch className="search" />
            </div>
            {filtered.length > 0 && (
              <div className="search-results">
                {filtered.map(item => (
                  <div
                    key={item._id}
                    className="search-item"
                    onClick={() => goToProduct(item._id)}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {username ? (
          <div className="profile-container">
            <div
              className="profile-icon"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <FaUserCircle className='face' size={28} />
              <span className="profile-label">Hello, {username}</span>
            </div>

            {profileOpen && (
              <div className="profile-dropdown">
                <div className="profile-menu">
                  <button onClick={() => { userProduct(); setProfileOpen(false); }}>
                    <FaBoxOpen /> My Account
                  </button>

               
                  <button onClick={onChangePassword}>
                    <FaUserCircle /> Change Password
                  </button>

                  <button
                    onClick={() => {
                      onOrder();
                   
                    }}
                  >
                    <IoBag /> My Orders
                  </button>


                  <button
                    onClick={() => {
                      onDelete();
                      nav('/');
                    }}
                  >
                    <FaTrashAlt /> Delete Account
                  </button>

                  <button onClick={onLogout}>
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button onClick={onLogin}>
            <IoPeople className='face' />
            Login
          </button>
        )}

        <div className="nav3" onClick={onClicks}>
          <h1>{count}</h1>
          <h1>
            <MdOutlineShoppingCart className="icon" />
          </h1>
          <span>Cart</span>
        </div>

        <div className="se">
          <button className="sell" onClick={more}>
            Sell Product
          </button>
        </div>

        <button onClick={() => scrollToSection('about')}>
          About Us
        </button>


        <button onClick={()=>{nav('/old')}}  >Second-Products</button>
      </div>
      </div>
    </div>
  );
};

export default Nav;
