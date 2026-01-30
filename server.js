const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

/**
 * Creates an HTTP server instance that responds with "Hello, World!" to all requests.
 * 
 * This function is exported for testability, allowing test suites to create
 * server instances without auto-starting the server on module load.
 * 
 * @returns {http.Server} An HTTP server instance ready to be started with listen()
 */
function createServer() {
  return http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello, World!\n');
  });
}

// Auto-start server only when run directly via `node server.js`
// When required as a module (for testing), the server is not auto-started
/* istanbul ignore next -- @preserve
   This block only runs when executed directly via `node server.js`.
   It cannot be covered by Jest as it requires `require.main === module`.
   Coverage is verified by the direct execution test in the test suite. */
if (require.main === module) {
  const server = createServer();
  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
}

// Export createServer function and configuration constants for testing
module.exports = { createServer, hostname, port };
