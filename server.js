/**
 * @fileoverview Simple HTTP server that responds with "Hello, World!" to all requests.
 * This module creates a basic Node.js HTTP server for demonstration and testing purposes.
 *
 * @module server
 * @author hxu
 * @version 1.0.0
 * @license MIT
 * @requires http
 * @see {@link https://nodejs.org/api/http.html} Node.js HTTP Documentation
 */

// Import Node.js built-in HTTP module for creating the web server
const http = require('http');

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
 * HTTP server instance with request handler callback.
 *
 * @callback requestHandler
 * @param {http.IncomingMessage} req - The incoming HTTP request object
 * @param {http.ServerResponse} res - The HTTP response object to send data back
 *
 * @type {http.Server}
 */
const server = http.createServer((req, res) => {
  // Set HTTP status code to 200 (OK) indicating successful request
  res.statusCode = 200;

  // Set Content-Type header to indicate plain text response format
  res.setHeader('Content-Type', 'text/plain');

  // Send response body and signal that the response is complete
  res.end('Hello, World!\n');
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
 * // Test the endpoint
 * // $ curl http://127.0.0.1:3000/
 * // Hello, World!
 */
server.listen(port, hostname, () => {
  // Log server URL to console once the server is ready to accept connections
  console.log(`Server running at http://${hostname}:${port}/`);
});
