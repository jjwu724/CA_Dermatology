const express = require('express');
const path = require('path');
const app = express();

// Configure CORS to allow requests from the local development server
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Replace with your local server URL
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Define the paths to the directories where your files are located
const mainFolderPath = __dirname; // Assuming server.js is in the main folder
const javascriptPath = path.join(__dirname, '..', '..', 'JavaScript');
const cssPath = path.join(__dirname, '..', '..', 'CSS');

app.use('/', express.static(mainFolderPath)); // Serve HTML and JavaScript files from the main folder
app.use('/JavaScript', express.static(javascriptPath)); // Serve JavaScript files from the ../../JavaScript route
app.use('/CSS', express.static(cssPath)); // Serve CSS files from the ../../CSS route

// Log when the server starts
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}. Access at: http://localhost:3000/`);
});
