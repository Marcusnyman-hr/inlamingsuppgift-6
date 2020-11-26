import React from 'react'

import './custom-button.styles.css';

export default function CustomButton({ children, inverted, ...otherProps}) {
  return (
    <button 
    className={inverted ? 'custom-button inverted' : 'custom-button'} {...otherProps}>
      {children}
    </button>
  )
}
