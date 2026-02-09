/**
 * @fileoverview Express.js HTTP server with two endpoints: a root endpoint that
 * responds with "Hello, World!" and an evening endpoint that responds with "Good evening".
 * This module creates an Express.js application for demonstration and testing purposes.
 *
 * @module server
 * @author hxu
 * @version 1.1.0
 * @license MIT
 * @requires express
 * @see {@link https://expressjs.com/} Express.js Documentation
 */

// Import Express.js web framework for HTTP routing and server creation
const express = require('express');

/**
 * Server hostname/IP address to bind to.
 * @constant {string}
 * @default '127.0.0.1'
 */
const hostname = '127.0.0.1';

/**
 * Server port number to listen on.
 * @constant {number}
 * @default 3000
 */
const port = 3000;

/**
 * Express application instance.
 * Creates the core Express.js app that handles HTTP routing and middleware.
 *
 * @type {import('express').Express}
 */
const app = express();

/**
 * Root route handler — serves the Hello World response.
 * Responds with plain text "Hello, World!\n" to maintain backward compatibility
 * with the original raw http module implementation.
 *
 * @name GET /
 * @function
 * @param {import('express').Request} req - The Express request object
 * @param {import('express').Response} res - The Express response object
 * @returns {void} Sends HTTP 200 with Content-Type: text/plain
 */
app.get('/', (req, res) => {
  // Set Content-Type to text/plain and send the Hello World response body
  res.type('text').send('Hello, World!\n');
});

/**
 * Evening route handler — serves the Good Evening response.
 * Responds with plain text "Good evening" as the new feature endpoint.
 *
 * @name GET /evening
 * @function
 * @param {import('express').Request} req - The Express request object
 * @param {import('express').Response} res - The Express response object
 * @returns {void} Sends HTTP 200 with Content-Type: text/plain
 */
app.get('/evening', (req, res) => {
  // Set Content-Type to text/plain and send the Good Evening response body
  res.type('text').send('Good evening');
});

/**
 * Start the server and begin listening for incoming connections.
 *
 * @example
 * // Start the server
 * // $ node server.js
 * // Server running at http://127.0.0.1:3000/
 *
 * @example
 * // Test the root endpoint
 * // $ curl http://127.0.0.1:3000/
 * // Hello, World!
 *
 * @example
 * // Test the evening endpoint
 * // $ curl http://127.0.0.1:3000/evening
 * // Good evening
 */
app.listen(port, hostname, () => {
  // Log server URL to console once the server is ready to accept connections
  console.log(`Server running at http://${hostname}:${port}/`);
});
