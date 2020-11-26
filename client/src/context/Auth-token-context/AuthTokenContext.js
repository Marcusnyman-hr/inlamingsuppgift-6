import React, { useState } from 'react';

//passing in array with empty object and empty function
const AuthTokenContext = React.createContext([{}, () => {}]);

const AuthTokenProvider = (props) => {
  const [authToken, setAuthToken] = useState({});
  return (
    <AuthTokenContext.Provider value={[authToken, setAuthToken]}>
      {props.children}
    </AuthTokenContext.Provider>
  );
}

export { AuthTokenContext, AuthTokenProvider };