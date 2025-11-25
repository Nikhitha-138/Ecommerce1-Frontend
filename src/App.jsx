import { Route, Routes, useLocation } from 'react-router-dom';
import Nav from './components/Nav/nav';
import Login from './pages/Login/login';
import SignUp from './pages/SignUp/signup';
import Landing from './pages/Landing/landing';
import AllProduct from './pages/AllProduct/allproduct';
import PrivateRoute from './components/PrivateRoute';
import Detail from './pages/DetailProduct/detail';
import ChangePassword from './pages/Change/change';
import Cart from './pages/AddToCart/cart';
import Sell from './pages/SellProduct/sell';
import UserPrdouct from './pages/userProduct/userproduct';
import SellLog from './pages/Selllog/selllog';
import Buy from './pages/Buy/buy';
import Order from './pages/Order/order';
import Old from './pages/old/old';
import './App.css';

const App = () => {
  const location = useLocation();
  const hideNavPaths = ["/signup", "/login","/buy","/sell",'/sellLog','/changepassword'];
  const shouldHideNav = hideNavPaths.includes(location.pathname) ||
    location.pathname.startsWith("/cart/")||
  location.pathname.startsWith("/user/");
  return (
    <div className="app">
      {!shouldHideNav && <Nav />}
      <div className="app1">
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/' element={<Landing />} />
          <Route element={<PrivateRoute />}>
            <Route path='/detail/:productId' element={<Detail />} />
            <Route path='/allproducts' element={<AllProduct />} />
           <Route path='/cart/:userId' element={<Cart/>} />
           <Route path='/sell' element={<Sell/>} />
           <Route path='/changepassword' element={<ChangePassword/>} />
           <Route path='/order' element={<Order/>} />
           <Route path="/edit/:productId" element={<Sell />} />
           <Route path='/user/:userId' element={<UserPrdouct/>} />
           <Route path='/sellLog' element={<SellLog/>} />
           <Route path='/buy' element={<Buy/>} />
           <Route path='/old' element={<Old/>} />
         </Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
