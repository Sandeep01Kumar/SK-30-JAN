const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

// Graceful shutdown timeout in milliseconds
const SHUTDOWN_TIMEOUT = 5000;

const server = http.createServer((req, res) => {
  // Consume and discard the request body to prevent
  // resource leaks on requests with payloads
  req.resume();

  // Handle request-level errors to prevent unhandled
  // exceptions from crashing the server
  req.on('error', (err) => {
    console.error('Request error:', err.message);
    if (!res.headersSent) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
    }
    res.end('Bad Request\n');
  });

  // Only allow GET and HEAD methods; reject all others
  // with 405 Method Not Allowed per HTTP semantics
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, {
      'Content-Type': 'text/plain',
      'Allow': 'GET, HEAD'
    });
    res.end('Method Not Allowed\n');
    return;
  }

  // Route only the root path; return 404 for all others
  if (req.url !== '/') {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found\n');
    return;
  }

  // Serve the Hello World response for valid
  // GET / requests
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, World!\n');
});

// Handle client protocol errors (malformed HTTP requests)
// by sending a 400 Bad Request instead of silently dropping
server.on('clientError', (err, socket) => {
  console.error('Client error:', err.message);
  if (socket.writable) {
    socket.end(
      'HTTP/1.1 400 Bad Request\r\n\r\n'
    );
  }
});

// Handle server-level errors such as EADDRINUSE to
// prevent unhandled exception crash on port conflict
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `Port ${port} is already in use`
    );
  } else {
    console.error('Server error:', err.message);
  }
  process.exit(1);
});

// Graceful shutdown handler: stop accepting new
// connections, let in-flight requests finish, then exit
function gracefulShutdown(signal) {
  console.log(
    `${signal} received. Shutting down gracefully...`
  );
  server.close(() => {
    console.log('Server closed. Exiting.');
    process.exit(0);
  });

  // Force shutdown if connections are not drained
  // within the timeout period
  setTimeout(() => {
    console.error(
      'Shutdown timeout. Forcing exit.'
    );
    process.exit(1);
  }, SHUTDOWN_TIMEOUT);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Last-resort error handlers to log unexpected failures
// and exit cleanly instead of crashing silently
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  process.exit(1);
});

server.listen(port, hostname, () => {
  console.log(
    `Server running at http://${hostname}:${port}/`
  );
});
