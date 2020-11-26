import React, {useContext} from 'react';
import {withRouter} from 'react-router-dom';
import { AuthTokenContext } from '../../context/Auth-token-context/AuthTokenContext'

import './money-header.styles.scss';
//Header component for income/expenses
function MoneyHeader({toggleAddEntry, history}) {
  const [authToken, setAuthToken] = useContext(AuthTokenContext)

  function logOut() {
    setAuthToken({token: null})
    history.push('/')
  }
  return (
    <div className='money-header'>
      <h4>Your finances</h4>
      <ul className='money-header-menu'>
        <li className='money-header-menu-item' onClick={toggleAddEntry}>
          Add new entry
        </li>
        <li className='money-header-menu-item' onClick={logOut}>
          Logout
        </li>
      </ul>
    </div>
  )
}

export default withRouter(MoneyHeader)
