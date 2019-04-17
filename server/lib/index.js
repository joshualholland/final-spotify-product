"use strict";

var _path = _interopRequireWildcard(require("path"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var express = require('express');

var request = require('request');

var cors = require('cors');

var querystring = require('querystring');

var cookieParser = require('cookie-parser');

var cluster = require('cluster');

var numCPUs = require('os').cpus().length;

var history = require('connect-history-api-fallback');

require('dotenv').config();

var CLIENT_ID = process.env.CLIENT_ID;
var CLIENT_SECRET = process.env.CLIENT_SECRET;
var REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:3000/callback';
var FRONTEND_URI = process.env.FRONTEND_URI || 'http://localhost:3000/home#';
console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV !== 'production') {
  REDIRECT_URI = 'http://localhost:3000/callback';
  FRONTEND_URI = 'http://localhost:3000/home#';
}
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */


var generateRandomString = function generateRandomString(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

var stateKey = 'spotify_auth_state'; // Multi-process to utilize all CPU cores.

if (cluster.isMaster) {
  console.warn("Node cluster master ".concat(process.pid, " is running")); // Fork workers.

  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', function (worker, code, signal) {
    console.error("Node cluster worker ".concat(worker.process.pid, " exited: code ").concat(code, ", signal ").concat(signal));
  });
} else {
  var app = express();
  var p = (0, _path.join)(__dirname, '../../client');
  console.log(p);
  app.use(express.static(p));
  app.use(express.json());
  app.use(express.static(p)).use(cors()).use(cookieParser()).use(history({
    verbose: true,
    rewrites: [{
      from: /\/login/,
      to: '/login'
    }, {
      from: /\/callback/,
      to: '/callback'
    }, {
      from: /\/refresh_token/,
      to: '/refresh_token'
    }],
    disableDotRule: true
  })).use(express.static(p));
  app.get('/', function (req, res) {
    res.render(_path.default.resolve(__dirname, '../client'));
  });
  app.use(express.static(__dirname + '/public')).use(cors()).use(cookieParser());
  app.get('/login', function (req, res) {
    var state = generateRandomString(16);
    res.cookie(stateKey, state); // your application requests authorization

    var scope = 'user-read-private user-read-email user-top-read user-read-recently-played user-library-read user-read-currently-playing user-read-playback-state user-modify-playback-state';
    res.redirect('https://accounts.spotify.com/authorize?' + querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT_URI,
      state: state
    }));
  });
  app.get('/callback', function (req, res) {
    // your application requests refresh and access tokens
    // after checking the state parameter
    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
      res.redirect('/#' + querystring.stringify({
        error: 'state_mismatch'
      }));
    } else {
      res.clearCookie(stateKey);
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: REDIRECT_URI,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': 'Basic ' + new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
        },
        json: true
      };
      request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          var access_token = body.access_token,
              refresh_token = body.refresh_token;
          var options = {
            url: 'https://api.spotify.com/v1/me',
            headers: {
              'Authorization': 'Bearer ' + access_token
            },
            json: true
          }; // use the access token to access the Spotify Web API

          request.get(options, function (error, response, body) {
            console.log(body);
          }); // we can also pass the token to the browser to make requests from there

          res.redirect(FRONTEND_URI + querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
        } else {
          res.redirect('/#' + querystring.stringify({
            error: 'invalid_token'
          }));
        }
      });
    }
  });
  app.get('/refresh_token', function (req, res) {
    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': 'Basic ' + new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
      },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    };
    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        res.send({
          'access_token': access_token
        });
      }
    });
  });
  app.use('*', function (req, res, next) {
    res.sendFile((0, _path.join)(__dirname, '../client/index.html'));
  });
  var port = process.env.PORT || 3000;
  app.listen(port, function () {
    console.log("Server listening on port: ".concat(port));
  });
}