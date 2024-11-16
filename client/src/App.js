import React, { useState, useEffect } from "react";
import Login from './Login'
import './App.css';
import NowPlaying from "./NowPlaying";

function App() {

  const [token, setToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');

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
      { (token === '') ? <Login/> : <NowPlaying token={token} refreshToken={refreshToken} /> }
    </>
  );
}

export default App;