import React, {Component} from 'react';
import axios from 'axios';
import FormInput from '../form-input/form-input.component';
import CustomButton from '../custom-button/custom-button.component';
import './register.styles.scss';

//Component to handle user-registration
class Register extends Component {
  state = {
    name: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    registerSuccess: false,
  }
  //handle form changes
  handleChange = event => {
    const {name, value} = event.target;
    this.setState({[name]:value})
  }
  //handle form submits
  handleSubmit = (event) => {
    const {name, lastName, email, username, password} = this.state;
    event.preventDefault()
    const url = 'http://localhost:5000/api/user/register';
    const user = {
      name,
      lastName,
      email,
      username,
      password,
    }

    axios.post(url, user)
      .then((res) => {
        if (res.status === 200) {
          this.setState({registerSuccess: true})
            setTimeout(() => {
              this.props.setLoginToggle(true)
            }, 3000)
        }
      })
      .catch((error) => {
        console.log(error)
      });
    }
  
  render() {
    //Desctructure state
    const {password, username, name, lastName, email, registerSuccess} = this.state;
    return (
      <div className='register'>
        <h3>Register to get access</h3>
        <div className='register-form'>
        <form className="register-form" onSubmit={this.handleSubmit}>
          <FormInput 
          label="Name"
          type='text'
          name='name'
          value={name}
          autoComplete="off"
          required
          onChange={this.handleChange}
          />
          <FormInput 
          label="Lastname"
          type='text'
          name='lastName'
          value={lastName}
          autoComplete="off"
          required
          onChange={this.handleChange}
          />
          <FormInput 
          label="Email"
          type='email'
          name='email'
          value={email}
          autoComplete="off"
          required
          onChange={this.handleChange}
          />
          <FormInput 
          label="Username"
          icon="user"
          type='text'
          name='username'
          value={username}
          autoComplete="off"
          required
          onChange={this.handleChange}
          />

          <FormInput 
          label="Password" 
          type="password" 
          icon="password"
          name='password'
          value={password}
          autoComplete="current-password"
          required
          onChange={this.handleChange}
          />
          <CustomButton>Register</CustomButton>
        </form>
        
        </div>
        {
          //Show sucess screen. Very clonky, need a rewrite.
          registerSuccess ? <div className='register-success'>Successfully registered user, please login!</div> : null
        }
      </div>
    )
  }
}

export default Register;
