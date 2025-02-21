const express = require("express");
const app = express();

// Replace with your actual credentials
const CLIENT_ID = "7a25ce4c-2a02-4022-a724-ba1da496e799";
const REDIRECT_URI = "https://areumhan0423.github.io/HDF/callback.html"; // Must match what you registered

app.get("/login", (req, res) => {
    const authUrl = `https://app.mural.co/api/public/v1/authorization/oauth2/?` +
        `client_id=${7a25ce4c-2a02-4022-a724-ba1da496e799}&` +
        `redirect_uri=${encodeURIComponent(https://areumhan0423.github.io/HDF/callback.html)}&` +
        `scope=murals:read` +  // Specify the permissions needed
        `state=xyz123&` +  // A random string to prevent CSRF attacks
        `response_type=code`;

    res.redirect(authUrl);  // Redirect user to Mural authorization page
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
