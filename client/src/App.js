import React, { useState, useEffect } from "react";
import Login from './Login'
import './App.css';
import NowPlaying from "./NowPlaying";

function App() {

  const [token, setToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');

  const updateTokens = (newToken, newRefreshToken) => {
    if (newToken) {
      setToken(newToken);
    }

    if(newRefreshToken) {
      setRefreshToken(newRefreshToken);
    }
  }

  useEffect(() => {
    
    async function getToken() {
      const response = await fetch('/auth/token');
      const json = await response.json();
      setToken(json.access_token);
      setRefreshToken(json.refresh_token);
    }

    getToken();

  }, []);
  
  return (
    <>
      { (token === '') ? <Login/> : <NowPlaying token={token} refreshToken={refreshToken} updateTokens={updateTokens} /> }
    </>
  );
}

export default App;