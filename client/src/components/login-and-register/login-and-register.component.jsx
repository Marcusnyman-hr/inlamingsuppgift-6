import React, {useState} from 'react';
import Login from '../login/login.component'
import Register from '../register/register.component'
import './login-and-register.styles.scss';

//Component for that contains login and register components.
export default function LoginAndRegister() {
  //State to toggle login/register
  const [loginToggle, setLoginToggle] = useState(true);
  return (
    <div className='login-and-register'>
      <div className='login-and-register-form-container'>
      {
        loginToggle ? <Login /> : <Register setLoginToggle={setLoginToggle}/>
      }
      <span className='login-register-link' onClick={() => setLoginToggle(!loginToggle)}>{loginToggle ? 'Dont have an account? Register now!' : 'Already have an account? Log in!'}</span>
      </div>
      <div className='login-hero'>
        <h1 className='login-hero-text'>“A Penny Saved is a Penny Earned”</h1>
      </div>
    </div>
    )
    
  }

