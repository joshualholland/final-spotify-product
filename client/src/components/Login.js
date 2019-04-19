import React from 'react';
import './css/Login.css';

import LoginLogo from './svg/LoginLogo';


const Login = () => {

  let LOGIN_URI = ''

  if (process.env.NODE_ENV === 'production') {
    LOGIN_URI = 'https://synesthesiaspotify.herokuapp.com/login'
  } else {
    LOGIN_URI = 'http://localhost:3000/login'
  }

  console.log(process.env.NODE_ENV);
  console.log(LOGIN_URI);

  return (
    <div className="Login">
      <LoginLogo id='login-logo' />
      <a href={LOGIN_URI}>
        <button className='btn login-button text-white'>Login with Spotify</button>
      </a>
    </div>
  )
};

export default Login;

