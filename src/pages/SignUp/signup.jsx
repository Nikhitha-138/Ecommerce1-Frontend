import axios from 'axios';
import { useState,useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './signup.css';

const SignUp = () => {
  const nav = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    phonenumber: '',
    password: '',
    confirmPassword: '',
  });
  
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);
  const signRef = useRef(null);
  
  const [passError, setPassError] = useState('');

  const onChange = e => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const onSignUp = async () => {
  if (user.password !== user.confirmPassword) {
    setPassError("Passwords don't match");
    return;
  }

  try {
    const response = await axios.post('http://localhost:8000/user/sign-up', user);

    
    alert(response.data.message || 'SignUp Successful');

    
    localStorage.setItem('userId', response.data.user._id);
    localStorage.setItem('name', response.data.user.name);

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }

    console.log('User ID stored in localStorage:', localStorage.getItem('userId'));

    nav('/allproducts');
  } catch (e) {
    console.error(e.response?.data || e.message);
    alert(e.response?.data?.message || 'SignUp Failed');
  }
};
 const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter' && nextRef?.current) {
      e.preventDefault();
      nextRef.current.focus();
    }}


  return (
    <div className="signup">
      <div className="signup1">
        <div className="signup2"></div>
        <div className="signup3">
          <h3>Get Started with your account</h3>
          <input type="text"  ref={nameRef} name="name" value={user.name} onChange={onChange} placeholder="Enter Name"  onKeyDown={e => handleKeyDown(e, emailRef)} />
          <input type="email" ref={emailRef} name="email" value={user.email} onChange={onChange} placeholder="Enter Email"   onKeyDown={e => handleKeyDown(e, phoneRef)}/>
          <input type="number" ref={phoneRef} name="phonenumber" value={user.phonenumber} onChange={onChange} placeholder="Enter Phone Number"  onKeyDown={e => handleKeyDown(e, passwordRef)}/>
          <input type="password" ref={passwordRef} name="password" value={user.password} onChange={onChange} placeholder="Enter Password"  onKeyDown={e => handleKeyDown(e, confirmRef)} />
          <input type="password" ref={confirmRef} name="confirmPassword" value={user.confirmPassword} onChange={onChange} placeholder="Confirm Password"  onKeyDown={e => handleKeyDown(e, signRef)} />
          <div className="signup4">{passError}</div>
          <div className="sign5">
            <button onClick={onSignUp} ref={signRef} >Sign Up</button>
            <Link className="link" to="/">Go Back</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
