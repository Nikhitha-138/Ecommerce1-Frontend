import axios from 'axios';
import { useState,useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import './login.css';

const Login = () => {

   const nav=useNavigate() 
  const [ecom, setEcom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const[eye,setEye]=useState(false)

  const emailref=useRef(null)
  const passwordref=useRef(null)
  const enterref=useRef(null)

  
  const loginDetails = async (e) => {
  e.preventDefault();
  setEcom('');
  if (!email || !password) {
    setEcom("Email or Password is required");
    return;
  }

  try {
    const response = await axios.post('http://localhost:8000/user/log-in', {
      email,
      password,
    });

    console.log(response.data, 'login successful');

    

    localStorage.setItem('token', response.data.token);
    localStorage.setItem('name', response.data.user.name);
    localStorage.setItem('userId', response.data.user._id); 
    console.log('User ID stored in localStorage:', localStorage.getItem('userId'));

    nav('/allproducts');
  } catch (e) {
    console.log(e.message);
    setEcom('Incorrect Email or Password');
  }
};

const handleKeyDown=(e,nextRef)=>{
     if(e.key=='Enter' && nextRef?.current){
      e.preventDefault()
      nextRef.current.focus()
     }
}
  return (
    <div className="login">
      <div className="login1">
        <div className="login2"></div>
        <form onSubmit={loginDetails} >
        <div className="login3">
        
          <h3>Welcome to the online  store</h3>
          <div className="email-container">
          <input
            type="text"
            ref={emailref}
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e=>handleKeyDown(e,passwordref)}
            placeholder="Enter email"
          /></div>
           <div className="password-container">
          <input  type={eye?'text':'password'} ref={passwordref} value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={e=>{handleKeyDown(e,enterref)}}
              placeholder="Enter password"/>
          {!eye && <FaEye onClick={() => setEye(true)} className="eye-icon" />}
            {eye && <FaEyeSlash onClick={() => setEye(false)} className="eye-icon" />}
              </div>
          <button  ref={enterref} onClick={loginDetails}>Login</button>
         <h4 className="forgot">
  <Link to="/forgot-password">Forgot Password?</Link>
</h4>

          <div className="login4">{ecom}</div>
          <p>If not a Revoo Customer? <Link to='/signup' >Sign Up</Link> </p>
        </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
