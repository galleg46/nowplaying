const express = require('express');
const request = require('request'); // deprecated try something new
const dotenv = require('dotenv');
const axios = require('axios');

const port = 5000

global.access_token = ''

//loads secrets from .env file
dotenv.config()

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET

var spotify_redirect_uri = 'http://localhost:3000/auth/callback'

var randomStringGenerator = function (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

var app = express();

app.use(express.json()); // to parse JSON request bodies

app.get('/auth/login', (req, res) => {

    var scope = "user-read-currently-playing"
    var state = randomStringGenerator(16);
  
    var auth_query_parameters = new URLSearchParams({
      response_type: "code",
      client_id: spotify_client_id,
      scope: scope,
      redirect_uri: spotify_redirect_uri,
      state: state
    })
  
    res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
  })
  
  app.get('/auth/callback', (req, res) => {
  
    var code = req.query.code;
  
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: spotify_redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
        'Content-Type' : 'application/x-www-form-urlencoded'
      },
      json: true
    };
  
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        access_token = body.access_token;
        res.redirect('/')
      }
    });
  
  })
  
  app.get('/auth/token', (req, res) => {
    res.json({ access_token: access_token})
  })

  app.post('/now-playing', async (req, res) => {
    const token = req.body.token;

    var spotifyEndpoint = 'https://api.spotify.com/v1/me/player/currently-playing';

    if(!token) {
      return res.status(400).json({ error: `Token is missing` });
    }

    try {
      
      const spotifyResponse = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
          Authorization: `Bearer  ${token}`,
          'Content-Type': "application/json"
        },
        maxRedirects: 0, // This will prevent Axios from following redirects
      });
      
      res.json(spotifyResponse.data);
    } catch (error) {
      console.error('Error fetching data from Spotify: ', error);
      res.status(500).json({ error: 'Failed to fetch data from Spotify' })
    }
})
  
  app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
  })