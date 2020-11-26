import React from 'react'

import './form-input.styles.scss';

//icons fron fontawesome
const renderIcon = (icon) => {
if (icon === 'user') return <i className="fas fa-user"></i>
if (icon === 'password') return <i className="fas fa-key"></i>
if (icon === 'email') return <i className="fas fa-envelope"></i>
else return null
}


export default function FormInput({ handleChange, label, icon, ...otherProps }) {
  return (
    <div className='form-group'>
    <input className='form-input' onChange={handleChange} {...otherProps} />
    <label className={`${
          otherProps.value.length ? 'active' : ''
        } form-input-label`}>
        {label}
      </label>
    <div className='form-input-icon'>
    {renderIcon(icon)}
    </div>
  </div>
  )
}

