const axios = require("axios");
const cookieParser = require('cookie-parser');
const express = require("express");

const app = express();

app.use(express.json());
app.use(cookieParser());

const API_BASE = "https://app.mural.co";

const config = {
  clientId: "7a25ce4c-2a02-4022-a724-ba1da496e799", // replace this value with your app's client ID
  clientSecret: "2113fbcf36498100cf49a20da1df4ed0d2751e21e5acd0b988fdab49d60c35f8ec3bc3fcccda5d772d0c7cb63c83373f7b72e42b7b0b641baafc416be429bf18", // replace this value with your app's client secret
  redirectUri: "https://areumhan0423.github.io/HDF/callback.html", // this should point back to this express server
  scopes: [
    // put any scopes you are using in here
    "murals:read"
    //"murals:write",
    //"rooms:read",
    //"workspaces:read",
    //"identity:read",
  ],
  serverPort:5000,
  authorizationUri: `${API_BASE}/api/public/v1/authorization/oauth2/`,
  accessTokenUri: `${API_BASE}/api/public/v1/authorization/oauth2/token`,
  refreshTokenUri: `${API_BASE}/api/public/v1/authorization/oauth2/refresh`,
};

/**
 * If someone has not been authenticated, you can request a url from this endpoint to redirect them to
 * first. You can optionally pass a `state` query parameter and a `redirectUri` query parameter.
 * @param state
 * @param redirectUri
 */
app.get(
  "/auth",
  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  (req, res) => {
    // decide where we are redirecting after being authenticated.
    const redirectUri = req.query.redirectUri
      ? req.query.redirectUri.toString()
      : undefined;
    // is there any state that needs to be passed through the auth process
    const state = req.query.state ? req.query.state.toString() : undefined;

    const query = new URLSearchParams();
    query.set("client_id", config.clientId);
    query.set("redirect_uri", config.redirectUri);
    query.set("response_type", "code");

    if (state) {
      query.set("state", state);
    }

    if (config.scopes && config.scopes.length) {
      query.set("scope", config.scopes.join(" "));
    }
    // This will return a url string that will allow you to authenticate your app
    // and it can also redirect back to your client application
    res.cookie('redirectUri', redirectUri)
    res.redirect(302, `${config.authorizationUri}?${query}`);
  }
);


app.get(
    '/auth/token',
    /**
     *
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (
        req,
        res,
    ) => {

      const redirectUrl = new URL(req.cookies.redirectUri || req.protocol+'://'+req.hostname+'/');

      console.log(req.cookies.redirectUri, redirectUrl.href);

      const payload = {
        data: {
          client_id: config.clientId,
          client_secret: config.clientSecret,
          code: req.query.code,
          grant_type: 'authorization_code',
          redirect_uri: req.query.redirectUri || config.redirectUri,
        },
        method: 'POST',
        url: config.accessTokenUri
      };

      const response = await axios.request(payload);
      if (response.status !== 200) {
        throw 'token request failed';
      }

      redirectUrl.searchParams.set('accessToken',response.data.access_token);
      redirectUrl.searchParams.set('refreshToken', response.data.refresh_token);

      res.redirect(302, redirectUrl.href);
    },
);

app.post(
    '/auth/refresh',
    /**
     *
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {

      const payload= {
        data: {
          client_id: config.clientId,
          client_secret: config.clientSecret,
          grant_type: 'refresh_token',
          refresh_token: req.body.refreshToken,
          scope: config.scopes,
        },
        method: 'POST',
        url: config.refreshTokenUri,
      };

      const response = await axios.request(payload);
      if (response.status !== 200) {
        throw 'refresh token request failed';
      }

      res.json({
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
      });
    },
);


app.listen(config.serverPort, ()=>{
    console.log(`Example app listening at http://localhost:${config.serverPort}`);
});