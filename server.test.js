/**
 * Comprehensive Jest Test Suite for Node.js HTTP Server (server.js)
 * 
 * This test suite provides 100% coverage of the HTTP server implementation,
 * covering all test categories as specified in the Agent Action Plan:
 * 
 * Test Categories:
 * - Server Startup Tests (ST-001 to ST-003)
 * - HTTP Response Tests (HR-001 to HR-003)
 * - HTTP Method Tests (HM-001 to HM-006)
 * - URL Path Variation Tests (PV-001 to PV-003)
 * - Server Shutdown Tests (SS-001 to SS-002)
 * - Error Handling Tests (EH-001)
 * - Edge Case Tests (CR-001)
 * 
 * @module server.test
 * @requires supertest - HTTP testing library for request/response assertions
 * @requires http - Node.js built-in HTTP module for instanceof checks
 * @requires ./server - HTTP server module under test
 */

'use strict';

const request = require('supertest');
const http = require('http');
const { createServer, hostname, port } = require('./server');

/**
 * Main test suite for the HTTP Server (server.js)
 * 
 * Test organization follows the Agent Action Plan structure with
 * describe blocks for each test category and individual test functions
 * mapped to specific test IDs.
 */
describe('HTTP Server (server.js)', () => {
  /** @type {http.Server} Shared server instance for HTTP response tests */
  let server;

  /**
   * Setup: Create a fresh server instance before all tests in this suite.
   * Using beforeAll to create a single instance for efficiency.
   */
  beforeAll(() => {
    server = createServer();
  });

  /**
   * Teardown: Close the server after all tests complete.
   * Using callback-style to ensure proper cleanup and prevent open handles.
   */
  afterAll((done) => {
    if (server && server.listening) {
      server.close(done);
    } else {
      done();
    }
  });

  /**
   * Server Startup Tests
   * 
   * Verifies that the server initializes correctly and creates proper
   * instances. These tests validate the createServer function behavior.
   */
  describe('Server Startup', () => {
    /**
     * Test ST-001: Verify server creates http.Server instance
     * 
     * The createServer function must return a valid http.Server instance
     * that can be used for listening and handling requests.
     */
    test('should create http.Server instance (ST-001)', () => {
      expect(server).toBeInstanceOf(http.Server);
    });

    /**
     * Test ST-002: Verify server binds to configured port without errors
     * 
     * Server should successfully bind to an available port (using 0 for
     * ephemeral port assignment to avoid conflicts).
     */
    test('should bind to port without errors (ST-002)', (done) => {
      const testServer = createServer();
      testServer.listen(0, hostname, () => {
        const address = testServer.address();
        expect(address).not.toBeNull();
        expect(typeof address.port).toBe('number');
        testServer.close(done);
      });
    });

    /**
     * Test ST-003: Verify createServer function is properly exported
     * 
     * The createServer function must be a callable function exported
     * from the server module.
     */
    test('should export createServer function (ST-003)', () => {
      expect(typeof createServer).toBe('function');
    });

    /**
     * Test: Verify hostname constant is exported correctly
     * 
     * The hostname constant should be the expected value '127.0.0.1'.
     */
    test('should export hostname constant', () => {
      expect(hostname).toBe('127.0.0.1');
    });

    /**
     * Test: Verify port constant is exported correctly
     * 
     * The port constant should be the expected value 3000.
     */
    test('should export port constant', () => {
      expect(port).toBe(3000);
    });
  });

  /**
   * HTTP Response Tests
   * 
   * Validates the core HTTP response behavior including status code,
   * response body, and Content-Type header.
   */
  describe('HTTP Responses', () => {
    /**
     * Test HR-001: Verify 200 status code
     * 
     * All requests to the server should return HTTP 200 OK status.
     */
    test('should return 200 status code (HR-001)', async () => {
      const response = await request(server).get('/');
      expect(response.status).toBe(200);
    });

    /**
     * Test HR-002: Verify response body content
     * 
     * Response body must be exactly "Hello, World!\n" including
     * the trailing newline character.
     */
    test('should return "Hello, World!\\n" body (HR-002)', async () => {
      const response = await request(server).get('/');
      expect(response.text).toBe('Hello, World!\n');
    });

    /**
     * Test HR-003: Verify Content-Type header
     * 
     * Content-Type header must be set to "text/plain".
     */
    test('should set Content-Type to text/plain (HR-003)', async () => {
      const response = await request(server).get('/');
      expect(response.headers['content-type']).toBe('text/plain');
    });

    /**
     * Test: Verify response has correct content length
     * 
     * Content-Length should match the byte length of "Hello, World!\n".
     */
    test('should have correct content length', async () => {
      const response = await request(server).get('/');
      const expectedLength = Buffer.byteLength('Hello, World!\n');
      expect(parseInt(response.headers['content-length'], 10)).toBe(expectedLength);
    });
  });

  /**
   * HTTP Method Tests
   * 
   * Verifies that the server handles all HTTP methods consistently,
   * returning the same response regardless of the method used.
   */
  describe('HTTP Methods', () => {
    /**
     * Test HM-001: POST method returns correct response
     * 
     * POST requests should return 200 status with "Hello, World!\n" body.
     */
    test('POST returns 200 with correct body (HM-001)', async () => {
      const response = await request(server).post('/');
      expect(response.status).toBe(200);
      expect(response.text).toBe('Hello, World!\n');
    });

    /**
     * Test HM-002: PUT method returns correct response
     * 
     * PUT requests should return 200 status with "Hello, World!\n" body.
     */
    test('PUT returns 200 with correct body (HM-002)', async () => {
      const response = await request(server).put('/');
      expect(response.status).toBe(200);
      expect(response.text).toBe('Hello, World!\n');
    });

    /**
     * Test HM-003: DELETE method returns correct response
     * 
     * DELETE requests should return 200 status with "Hello, World!\n" body.
     */
    test('DELETE returns 200 with correct body (HM-003)', async () => {
      const response = await request(server).delete('/');
      expect(response.status).toBe(200);
      expect(response.text).toBe('Hello, World!\n');
    });

    /**
     * Test HM-004: PATCH method returns correct response
     * 
     * PATCH requests should return 200 status with "Hello, World!\n" body.
     */
    test('PATCH returns 200 with correct body (HM-004)', async () => {
      const response = await request(server).patch('/');
      expect(response.status).toBe(200);
      expect(response.text).toBe('Hello, World!\n');
    });

    /**
     * Test HM-005: OPTIONS method returns correct response
     * 
     * OPTIONS requests should return 200 status with "Hello, World!\n" body.
     */
    test('OPTIONS returns 200 with correct body (HM-005)', async () => {
      const response = await request(server).options('/');
      expect(response.status).toBe(200);
      expect(response.text).toBe('Hello, World!\n');
    });

    /**
     * Test HM-006: HEAD method returns headers without body
     * 
     * HEAD requests should return 200 status but with an empty body,
     * as per HTTP specification for HEAD method. Supertest returns
     * undefined for response.text on HEAD requests.
     */
    test('HEAD returns 200 with no body (HM-006)', async () => {
      const response = await request(server).head('/');
      expect(response.status).toBe(200);
      // HEAD requests have no body - supertest returns undefined for response.text
      expect(response.text === '' || response.text === undefined).toBe(true);
    });

    /**
     * Test: Verify Content-Type header is present for all methods
     * 
     * All HTTP methods should receive the Content-Type header.
     */
    test('all methods should include Content-Type header', async () => {
      const methods = ['get', 'post', 'put', 'delete', 'patch', 'options'];
      for (const method of methods) {
        const response = await request(server)[method]('/');
        expect(response.headers['content-type']).toBe('text/plain');
      }
    });
  });

  /**
   * URL Path Variation Tests
   * 
   * Verifies that the server responds identically regardless of the
   * URL path requested, since there is no routing logic.
   */
  describe('URL Paths', () => {
    /**
     * Test PV-001: /api path returns same response
     * 
     * Request to /api should return identical response as root.
     */
    test('GET /api returns same response (PV-001)', async () => {
      const response = await request(server).get('/api');
      expect(response.status).toBe(200);
      expect(response.text).toBe('Hello, World!\n');
    });

    /**
     * Test PV-002: Nested path returns same response
     * 
     * Request to /test/path should return identical response as root.
     */
    test('GET /test/path returns same response (PV-002)', async () => {
      const response = await request(server).get('/test/path');
      expect(response.status).toBe(200);
      expect(response.text).toBe('Hello, World!\n');
    });

    /**
     * Test PV-003: Query parameters do not affect response
     * 
     * Request with query parameters should return identical response.
     */
    test('GET /?query=param returns same response (PV-003)', async () => {
      const response = await request(server).get('/?query=param');
      expect(response.status).toBe(200);
      expect(response.text).toBe('Hello, World!\n');
    });

    /**
     * Test: Deeply nested path returns same response
     * 
     * Request to deeply nested path should return identical response.
     */
    test('GET /deeply/nested/path/here returns same response', async () => {
      const response = await request(server).get('/deeply/nested/path/here');
      expect(response.status).toBe(200);
      expect(response.text).toBe('Hello, World!\n');
    });

    /**
     * Test: Path with special characters returns same response
     * 
     * Request with encoded special characters should return identical response.
     */
    test('GET /path%20with%20spaces returns same response', async () => {
      const response = await request(server).get('/path%20with%20spaces');
      expect(response.status).toBe(200);
      expect(response.text).toBe('Hello, World!\n');
    });

    /**
     * Test: Multiple query parameters do not affect response
     * 
     * Request with multiple query parameters should return identical response.
     */
    test('GET /?foo=bar&baz=qux returns same response', async () => {
      const response = await request(server).get('/?foo=bar&baz=qux');
      expect(response.status).toBe(200);
      expect(response.text).toBe('Hello, World!\n');
    });
  });

  /**
   * Server Shutdown Tests
   * 
   * Verifies that the server can be gracefully terminated without
   * errors or resource leaks.
   */
  describe('Server Shutdown', () => {
    /**
     * Test SS-001: Server closes without error
     * 
     * Calling server.close() should complete without passing an error
     * to the callback.
     */
    test('should close without error (SS-001)', (done) => {
      const testServer = createServer();
      testServer.listen(0, hostname, () => {
        testServer.close((err) => {
          expect(err).toBeUndefined();
          done();
        });
      });
    });

    /**
     * Test SS-002: Server is not listening after close
     * 
     * After close is called, the server.listening property should be false.
     */
    test('should not be listening after close (SS-002)', (done) => {
      const testServer = createServer();
      testServer.listen(0, hostname, () => {
        expect(testServer.listening).toBe(true);
        testServer.close(() => {
          expect(testServer.listening).toBe(false);
          done();
        });
      });
    });

    /**
     * Test: Multiple close calls do not cause errors
     * 
     * Closing an already closed server should not throw.
     */
    test('should handle multiple close calls gracefully', (done) => {
      const testServer = createServer();
      testServer.listen(0, hostname, () => {
        testServer.close(() => {
          // Second close should not throw
          expect(() => {
            testServer.close();
          }).not.toThrow();
          done();
        });
      });
    });
  });

  /**
   * Error Handling Tests
   * 
   * Verifies that the server properly handles error conditions,
   * particularly port binding conflicts.
   */
  describe('Error Handling', () => {
    /**
     * Test EH-001: Port in use error handling
     * 
     * When attempting to bind to a port already in use, the server
     * should emit an error event with EADDRINUSE code.
     */
    test('should emit EADDRINUSE when port in use (EH-001)', (done) => {
      // Create a blocker server on a specific port
      const blocker = http.createServer();
      const testPort = 3001;
      
      blocker.listen(testPort, hostname, () => {
        // Attempt to start another server on the same port
        const testServer = createServer();
        
        testServer.on('error', (err) => {
          expect(err.code).toBe('EADDRINUSE');
          expect(err.port).toBe(testPort);
          blocker.close(done);
        });
        
        testServer.listen(testPort, hostname);
      });
    });

    /**
     * Test: Server emits error event for invalid hostname
     * 
     * Attempting to listen on an invalid hostname should emit an error.
     * This is more reliable than testing privileged ports which may succeed as root.
     */
    test('should emit error for invalid hostname', (done) => {
      const testServer = createServer();
      
      testServer.on('error', (err) => {
        expect(err).toBeDefined();
        // EADDRNOTAVAIL for invalid address
        expect(['EADDRNOTAVAIL', 'ENOENT', 'EINVAL'].includes(err.code)).toBe(true);
        testServer.close();
        done();
      });
      
      // Use an invalid IP address that is not available on the system
      testServer.listen(0, '192.0.2.1'); // TEST-NET-1 - reserved, not routable
    });
  });

  /**
   * Edge Case Tests
   * 
   * Verifies server behavior under edge conditions including
   * concurrent requests and unusual input scenarios.
   */
  describe('Edge Cases', () => {
    /**
     * Test CR-001: Handle concurrent requests
     * 
     * The server should successfully handle multiple simultaneous
     * requests without errors or data corruption.
     * Uses a dedicated listening server to avoid connection issues.
     */
    test('should handle 10 concurrent requests (CR-001)', (done) => {
      const testServer = createServer();
      testServer.listen(0, hostname, async () => {
        try {
          const requests = Array(10).fill().map(() => request(testServer).get('/'));
          const responses = await Promise.all(requests);
          
          responses.forEach((response) => {
            expect(response.status).toBe(200);
            expect(response.text).toBe('Hello, World!\n');
            expect(response.headers['content-type']).toBe('text/plain');
          });
          testServer.close(done);
        } catch (err) {
          testServer.close(() => done(err));
        }
      });
    });

    /**
     * Test: Handle high volume of concurrent requests
     * 
     * Server should handle a larger number of concurrent requests.
     * Uses a dedicated listening server to avoid connection issues.
     */
    test('should handle 50 concurrent requests', (done) => {
      const testServer = createServer();
      testServer.listen(0, hostname, async () => {
        try {
          const requests = Array(50).fill().map(() => request(testServer).get('/'));
          const responses = await Promise.all(requests);
          
          expect(responses.length).toBe(50);
          responses.forEach((response) => {
            expect(response.status).toBe(200);
            expect(response.text).toBe('Hello, World!\n');
          });
          testServer.close(done);
        } catch (err) {
          testServer.close(() => done(err));
        }
      });
    });

    /**
     * Test: Handle sequential rapid requests
     * 
     * Server should handle many sequential requests in rapid succession.
     */
    test('should handle rapid sequential requests', async () => {
      for (let i = 0; i < 20; i++) {
        const response = await request(server).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Hello, World!\n');
      }
    });

    /**
     * Test: Request with large headers is handled
     * 
     * Server should handle requests with additional headers.
     */
    test('should handle requests with custom headers', async () => {
      const response = await request(server)
        .get('/')
        .set('X-Custom-Header', 'test-value')
        .set('Accept', 'text/plain');
      
      expect(response.status).toBe(200);
      expect(response.text).toBe('Hello, World!\n');
    });

    /**
     * Test: POST with body is handled (body ignored)
     * 
     * Server should handle POST requests with body data,
     * even though the body is not processed.
     */
    test('should handle POST with body (body ignored)', async () => {
      const response = await request(server)
        .post('/')
        .send({ data: 'test payload' })
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(200);
      expect(response.text).toBe('Hello, World!\n');
    });

    /**
     * Test: Empty path handling
     * 
     * Supertest normalizes empty paths to '/', but verify behavior.
     */
    test('should handle root path correctly', async () => {
      const response = await request(server).get('/');
      expect(response.status).toBe(200);
      expect(response.text).toBe('Hello, World!\n');
    });
  });

  /**
   * Server Instance Management Tests
   * 
   * Verifies that multiple server instances can be created and
   * managed independently.
   */
  describe('Server Instance Management', () => {
    /**
     * Test: Multiple server instances can be created
     * 
     * createServer should create independent server instances.
     */
    test('should create multiple independent server instances', () => {
      const server1 = createServer();
      const server2 = createServer();
      
      expect(server1).toBeInstanceOf(http.Server);
      expect(server2).toBeInstanceOf(http.Server);
      expect(server1).not.toBe(server2);
    });

    /**
     * Test: Multiple servers can listen on different ports
     * 
     * Multiple server instances should be able to listen simultaneously
     * on different ports.
     */
    test('should allow multiple servers on different ports', (done) => {
      const server1 = createServer();
      const server2 = createServer();
      
      server1.listen(0, hostname, () => {
        server2.listen(0, hostname, () => {
          const port1 = server1.address().port;
          const port2 = server2.address().port;
          
          expect(port1).not.toBe(port2);
          expect(server1.listening).toBe(true);
          expect(server2.listening).toBe(true);
          
          server1.close(() => {
            server2.close(done);
          });
        });
      });
    });
  });
});
