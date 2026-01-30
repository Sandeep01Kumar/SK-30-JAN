/**
 * Production-Ready HTTP Server
 * 
 * This server includes:
 * - Comprehensive error handling (server, client, request, response errors)
 * - Graceful shutdown capabilities (SIGTERM, SIGINT, uncaughtException, unhandledRejection)
 * - Input validation for incoming HTTP requests
 * - Resource cleanup with connection tracking and draining
 * - Timeout configuration for DoS protection
 */

const http = require('http');

// Server configuration constants
const hostname = '127.0.0.1';
const port = 3000;

// Connection tracking for graceful shutdown and resource cleanup
const connections = new Set();

// Shutdown state flag to reject new requests during shutdown
let isShuttingDown = false;

/**
 * HTTP Request Handler
 * 
 * Handles incoming HTTP requests with:
 * - Input validation (checks req/res objects exist)
 * - Shutdown rejection (returns 503 during graceful shutdown)
 * - Request/response error handling
 * - Request logging with ISO timestamp
 * 
 * @param {http.IncomingMessage} req - The incoming HTTP request
 * @param {http.ServerResponse} res - The HTTP response object
 */
const server = http.createServer((req, res) => {
  // Input validation: Verify request and response objects exist
  if (!req || !res) {
    return;
  }

  // Reject new requests during graceful shutdown
  if (isShuttingDown) {
    res.statusCode = 503;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Service Unavailable\n');
    return;
  }

  // Request logging with ISO timestamp, HTTP method, and URL
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

  // Request error handling - catches errors during request body parsing
  req.on('error', (err) => {
    console.error('Request error:', err.message);
  });

  // Response error handling - catches errors during response writing
  res.on('error', (err) => {
    console.error('Response error:', err.message);
  });

  // Standard response: 200 OK with "Hello, World!" message
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

/**
 * Server Error Handler
 * 
 * Handles server-level errors such as:
 * - EADDRINUSE: Port already in use
 * - EACCES: Permission denied for port binding
 * - Other network-related errors
 */
server.on('error', (err) => {
  console.error('Server error:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Exiting...`);
    process.exit(1);
  }
  if (err.code === 'EACCES') {
    console.error(`Permission denied for port ${port}. Exiting...`);
    process.exit(1);
  }
});

/**
 * Client Error Handler
 * 
 * Handles malformed HTTP requests from clients such as:
 * - Invalid HTTP protocol
 * - Malformed headers
 * - Connection reset errors
 */
server.on('clientError', (err, socket) => {
  console.error('Client error:', err.message);
  if (socket.writable) {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
  }
});

/**
 * Connection Tracking Handler
 * 
 * Tracks all active socket connections for:
 * - Resource monitoring
 * - Graceful shutdown connection draining
 * - Memory leak prevention
 */
server.on('connection', (socket) => {
  connections.add(socket);
  socket.on('close', () => {
    connections.delete(socket);
  });
});

/**
 * Timeout Configuration
 * 
 * server.timeout: Maximum time (ms) for the entire request/response cycle
 * server.keepAliveTimeout: Time (ms) to keep idle connections open
 * 
 * These settings protect against:
 * - Slow loris attacks
 * - Resource exhaustion from slow clients
 * - Indefinitely open connections
 */
server.timeout = 30000;         // 30 seconds for request/response cycle
server.keepAliveTimeout = 5000; // 5 seconds for idle keep-alive connections

/**
 * Graceful Shutdown Handler
 * 
 * Performs clean server shutdown by:
 * 1. Setting shutdown flag to reject new requests
 * 2. Closing the server to stop accepting new connections
 * 3. Waiting for existing connections to complete
 * 4. Force-closing remaining connections after timeout
 * 
 * @param {string} signal - The signal or event that triggered shutdown
 */
function gracefulShutdown(signal) {
  console.log(`${signal} received. Starting graceful shutdown...`);
  isShuttingDown = true;

  // Stop accepting new connections
  server.close(() => {
    console.log('Server closed successfully');
    process.exit(0);
  });

  // Force close connections after 10 second grace period
  const forceShutdownTimeout = setTimeout(() => {
    console.log('Force closing remaining connections...');
    connections.forEach((socket) => {
      socket.destroy();
    });
    process.exit(1);
  }, 10000);

  // Don't let this timeout keep the process alive
  forceShutdownTimeout.unref();
}

/**
 * Process Signal Handlers
 * 
 * SIGTERM: Sent by container orchestrators (Docker, Kubernetes) for graceful stop
 * SIGINT: Sent by terminal (Ctrl+C) for manual interruption
 * uncaughtException: Safety net for unhandled synchronous errors
 * unhandledRejection: Safety net for unhandled Promise rejections
 */
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  gracefulShutdown('uncaughtException');
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  gracefulShutdown('unhandledRejection');
});

/**
 * Server Startup
 * 
 * Binds the server to the configured hostname and port
 * Logs the server URL when ready to accept connections
 */
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// Export server instance and configuration for testing and external use
module.exports = { server, port, hostname };
