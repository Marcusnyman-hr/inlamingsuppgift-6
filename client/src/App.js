import './App.css';
import React, {useContext, useState} from 'react'
import {Route, BrowserRouter, Switch, Redirect} from 'react-router-dom';
import { AuthTokenContext } from './context/Auth-token-context/AuthTokenContext'
import LoginAndRegister from './components/login-and-register/login-and-register.component'
import GDPRnotification from './components/GDPR-notification/GDPR-notification.component'

import Money from './components/money/money.component'

function App() {
  const [authToken] = useContext(AuthTokenContext);
  const [gdprConsent, setGdprConsentToggle] = useState(true);

  return (
      <div className="App">
      <BrowserRouter>
        <Switch>
        {gdprConsent ? <GDPRnotification setGdprConsentToggle={setGdprConsentToggle}/> : (
          null
        )}
        <Route exact path='/' component={LoginAndRegister} />
        <Route exact path="/money" render={() => {
        return (
         authToken.token ?
         <Money /> :
         <Redirect to="/" /> 
       )
       }}
       />
        </Switch>
      </BrowserRouter>
      
      </div>
  );
}

export default App;
