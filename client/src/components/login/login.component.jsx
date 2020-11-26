import React, {useReducer, useContext} from 'react';
import {withRouter} from 'react-router-dom';
import { AuthTokenContext } from '../../context/Auth-token-context/AuthTokenContext'
import axios from 'axios';
import FormInput from '../form-input/form-input.component';
import CustomButton from '../custom-button/custom-button.component';
import './login.styles.scss';

//Login component
function Login({history}) {
  const [user, setUser] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
    username: '',
    password: '',
    errorMsg:''
    }
  )
  //Authtoken from context
  const [authToken, setAuthToken] = useContext(AuthTokenContext)
  //Handle formchanges
  function handleChange(event) {
    const {name, value} = event.target;
    setUser({[name]:value})
  }
  //Handle form submits
  function handleSubmit(event) {
    event.preventDefault()
    const url = 'http://localhost:5000/api/user/login';
    const userLoggingIn = {
      username: user.username,
      password: user.password
    }

    axios.post(url, userLoggingIn)
      .then((res) => {
        if (res.status === 200) {
          //sets the authtoken in context from response
          setAuthToken({token: res.data})
          history.push('/money'); 
        }
      })
      .catch((error) => {
        console.log(error.errMessage)
      });
    }
  
    return (
      <div className='login'>
        <h3>Login to manage your money</h3>
        <div className='login-form'>
        <form className="login-form" onSubmit={handleSubmit}>
          <FormInput 
          label="Username"
          icon="user"
          type='text'
          name='username'
          value={user.username}
          autoComplete="off"
          required
          onChange={handleChange}
          />
          <FormInput 
          label="Password" 
          type="password" 
          icon="password"
          name='password'
          value={user.password}
          autoComplete="current-password"
          required
          onChange={handleChange}
          />
          <CustomButton>Login!</CustomButton>
        </form>
        </div>
      </div>
    )
  }

  export default withRouter(Login)