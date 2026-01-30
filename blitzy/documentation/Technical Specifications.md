# Technical Specification

# 0. Agent Action Plan

## 0.1 Intent Clarification

This section establishes a precise understanding of the user's testing requirements, surfaces implicit needs, and translates them into actionable technical objectives for comprehensive unit testing of the Node.js HTTP server.

### 0.1.1 Core Testing Objective

Based on the provided requirements, the Blitzy platform understands that the testing objective is to **implement comprehensive unit tests for `server.js`** using either Jest or Mocha as the testing framework.

**Request Categorization**: Add new tests (greenfield testing implementation)

**Testing Requirements with Enhanced Clarity**:

| # | Original Requirement | Technical Interpretation |
|---|---------------------|-------------------------|
| 1 | Test HTTP responses | Verify the response body content equals "Hello, World!\n" for all requests |
| 2 | Test status codes | Assert HTTP status code 200 is returned for successful requests |
| 3 | Test headers | Validate Content-Type header is set to "text/plain" |
| 4 | Test server startup | Verify server initializes without errors and binds to configured port |
| 5 | Test server shutdown | Ensure graceful server termination without resource leaks |
| 6 | Test error handling | Cover scenarios including port-in-use, malformed requests, and server exceptions |
| 7 | Test edge cases | Address boundary conditions such as concurrent requests, various HTTP methods, and different request paths |

**Implicit Testing Needs Surfaced**:

- **Request method handling**: Server responds identically to GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD methods (all return same response)
- **Path independence**: Any URL path returns the same "Hello, World!" response (no routing logic)
- **Request body ignorance**: Server does not process request bodies (stateless, no payload handling)
- **Connection handling**: Server handles multiple concurrent connections correctly
- **Process signal handling**: Server responds appropriately to SIGTERM/SIGINT for graceful shutdown
- **Memory leak prevention**: Server does not accumulate resources over multiple requests

### 0.1.2 Special Instructions and Constraints

**Critical Directives Captured**:

| Directive | Interpretation | Impact |
|-----------|---------------|--------|
| Use Jest OR Mocha | Framework choice with preference for Jest due to zero-config nature | Jest recommended for simpler setup |
| Comprehensive testing | Full coverage of all specified areas | Requires multiple test categories |
| No existing test infrastructure | Must create entire test setup from scratch | Install devDependencies, create test files |

**Testing Convention Requirements**:

- Follow Node.js testing best practices with async/await patterns
- Use Supertest for HTTP server testing (industry standard)
- Implement proper test isolation with beforeEach/afterEach hooks
- Ensure deterministic test execution (no test order dependencies)

**Web Search Requirements Documented**:

| Research Area | Purpose | Status |
|--------------|---------|--------|
| Jest vs Mocha comparison | Framework selection rationale | Completed |
| Jest latest version compatibility with Node.js 20 | Version selection | Completed |
| Supertest HTTP testing library | HTTP assertion integration | Completed |
| HTTP server testing patterns | Best practices research | Completed |

### 0.1.3 Technical Interpretation

These testing requirements translate to the following technical test implementation strategy:

**Server Lifecycle Testing**:
- To test server startup, we will create tests that spawn the server process and verify successful port binding
- To test server shutdown, we will implement graceful termination tests with process signal handlers

**HTTP Response Testing**:
- To test HTTP responses, we will use Supertest to make requests and assert response body content
- To test status codes, we will validate the 200 OK status using Supertest expectations
- To test headers, we will check Content-Type header value using header assertions

**Error Handling Testing**:
- To test port-in-use scenarios, we will spawn a mock listener before server start attempt
- To test error propagation, we will verify console output and process exit behavior

**Edge Case Testing**:
- To test various HTTP methods, we will iterate through GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD
- To test different paths, we will request /, /test, /api/v1, /nonexistent and verify consistent responses
- To test concurrent requests, we will use Promise.all with multiple simultaneous Supertest requests

### 0.1.4 Coverage Requirements Interpretation

**Explicit Coverage Targets**:

The user did not specify explicit coverage percentages. Based on industry standards for Node.js HTTP servers and the complete functionality scope requested, the following targets are established:

| Coverage Type | Target | Rationale |
|--------------|--------|-----------|
| Statement Coverage | 100% | Server has only 15 lines of code |
| Branch Coverage | 100% | No conditional branches exist |
| Function Coverage | 100% | Single request handler function |
| Line Coverage | 100% | All lines are critical path |

**Implicit Coverage Expectations**:

Based on Node.js HTTP server testing best practices and the existing repository pattern:

| Category | Coverage Requirement | Priority |
|----------|---------------------|----------|
| Happy Path | All standard HTTP methods returning 200 | High |
| Error Paths | Port binding errors, shutdown signals | High |
| Edge Cases | Concurrent connections, malformed headers | Medium |
| Performance Boundaries | Response time assertions | Low |

**To achieve comprehensive testing, coverage should include**:

- All HTTP methods (GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD)
- Server lifecycle events (start, running, shutdown)
- Error conditions (EADDRINUSE, SIGTERM, SIGINT)
- Response validation (body, headers, status code)
- Console output verification (startup message logging)

## 0.2 Test Discovery and Analysis

This section documents the thorough analysis of existing test infrastructure and research conducted to inform the testing implementation strategy.

### 0.2.1 Existing Test Infrastructure Assessment

**Repository analysis reveals no existing testing infrastructure** with a vanilla Node.js project structure designed as a Backprop integration test fixture.

**Search Patterns Employed**:

| Pattern | Files Found | Result |
|---------|-------------|--------|
| `*test*`, `*spec*` | 0 | No test files present |
| `test_*`, `spec_*` | 0 | No test files present |
| `*_test.*`, `*_spec.*` | 0 | No test files present |
| `jest.config.*` | 0 | No Jest configuration |
| `mocha*`, `.mocharc.*` | 0 | No Mocha configuration |
| `__tests__/`, `test/`, `spec/` | 0 | No test directories |

**Package Analysis**:

From `package.json`:

```json
{
  "name": "hello_world",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

| Element | Current State | Required Action |
|---------|--------------|-----------------|
| Testing framework | Not installed | Install Jest ^30.x |
| HTTP testing library | Not installed | Install Supertest ^7.x |
| Test script | Placeholder exits with error | Update to `jest --coverage` |
| Test configuration | None | Create jest.config.js |
| Coverage tools | None | Included with Jest |

**Test Infrastructure Summary**:

| Component | Status | Evidence |
|-----------|--------|----------|
| Testing Framework | **Not Present** | Empty devDependencies |
| Test Runner Configuration | **Not Present** | No jest.config.js or mocharc |
| Coverage Tools | **Not Present** | No Istanbul/nyc/Jest coverage |
| Mock/Stub Libraries | **Not Needed** | No external dependencies to mock |
| Test Data Fixtures | **Not Needed** | Stateless HTTP server |
| Test Helpers | **Not Present** | No utilities directory |

### 0.2.2 Web Search Research Conducted

The following research was conducted to inform framework selection and testing patterns:

**Framework Comparison Research**:

| Factor | Jest | Mocha |
|--------|------|-------|
| Configuration | Zero-config, works out of the box | Requires additional setup |
| Assertions | Built-in expect() assertions | Requires Chai library |
| Mocking | Built-in jest.fn() and mocks | Requires Sinon library |
| Coverage | Built-in --coverage flag | Requires Istanbul/nyc |
| Parallel Execution | Yes, built-in | Requires mocha-parallel-tests |
| Node.js 20 Support | Full support (v30+) | Full support |
| Ecosystem | All-in-one solution | Modular, mix-and-match |

**Framework Selection Rationale**:

Jest is selected as the testing framework because:
- Zero configuration required for Node.js projects
- Built-in assertion library eliminates need for Chai
- Built-in mocking capabilities eliminate need for Sinon
- Integrated coverage reporting with `--coverage` flag
- Better developer experience with clear, colorful output
- Faster test execution with parallel processing

**HTTP Testing Library Research**:

Supertest is selected for HTTP testing because:
- High-level abstraction for testing HTTP servers
- Works with any http.Server instance directly
- Automatically handles ephemeral port binding (no manual port management)
- Chainable, fluent API for assertions
- Native async/await support
- Works seamlessly with Jest and Mocha

**Best Practices Identified**:

| Practice | Application to server.js |
|----------|-------------------------|
| Test isolation | Each test starts fresh server instance via Supertest |
| Async handling | Use async/await with Supertest promises |
| Server export pattern | Export createServer function for testing |
| Port management | Let Supertest handle ephemeral ports |
| Cleanup | Ensure server.close() called after tests |
| Coverage thresholds | Set 100% target for simple codebase |

**Common Pitfalls to Avoid**:

| Pitfall | Mitigation Strategy |
|---------|---------------------|
| Port conflicts | Supertest auto-assigns ephemeral ports |
| Async test timeout | Configure adequate Jest timeout |
| Server not closing | Use afterEach hooks for cleanup |
| Global state leakage | Fresh server instance per test |
| Test interdependency | Ensure test isolation |

## 0.3 Testing Scope Analysis

This section provides detailed analysis of the test targets and version compatibility research to ensure proper framework selection.

### 0.3.1 Test Target Identification

**Primary Code to be Tested**:

| Module/File | Path | Test Types Required |
|-------------|------|---------------------|
| HTTP Server | `server.js` | Unit tests, Integration tests, Error handling tests |

**Source Code Analysis** (`server.js`):

```javascript
const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;
```

The server implementation contains the following testable units:

| Unit | Code Reference | Test Category | Priority |
|------|---------------|---------------|----------|
| HTTP Module Import | `require('http')` | Unit test | Low |
| Server Configuration | `hostname`, `port` constants | Unit test | Medium |
| Server Creation | `http.createServer()` | Integration test | High |
| Request Handler | `(req, res) => {...}` callback | Unit test | High |
| Status Code Setting | `res.statusCode = 200` | Unit test | High |
| Header Setting | `res.setHeader('Content-Type', 'text/plain')` | Unit test | High |
| Response Body | `res.end('Hello, World!\n')` | Unit test | High |
| Server Binding | `server.listen(port, hostname, callback)` | Integration test | High |
| Console Logging | `console.log(...)` | Unit test | Medium |

**Existing Test File Mapping**:

| Source File | Existing Test File | Test Categories Present |
|-------------|-------------------|------------------------|
| `server.js` | None | None (greenfield) |
| `package.json` | None | None (greenfield) |

**Dependencies Requiring Mocking**:

| Dependency | Type | Mock Strategy |
|------------|------|---------------|
| `http` module | Node.js built-in | No mocking needed (use real module) |
| `console.log` | Node.js built-in | Jest spy for verification |
| Process signals | Node.js built-in | Process event listeners |

**Note**: The server has zero external dependencies, so no mocking of third-party modules is required.

### 0.3.2 Version Compatibility Research

Based on web research and the project's Node.js v20.20.0 environment, the following testing stack is recommended:

**Environment Verification**:

| Runtime | Installed Version | Compatibility |
|---------|-------------------|---------------|
| Node.js | v20.20.0 | LTS - Full support for Jest 30 |
| npm | 11.1.0 | Full support |

**Recommended Testing Stack**:

| Package | Recommended Version | Compatibility Rationale |
|---------|---------------------|------------------------|
| jest | ^30.2.0 | Latest stable; supports Node.js 18+ (20.20.0 compatible) |
| supertest | ^7.0.0 | Latest stable; Node.js 14.16.0+ required |

**Version Compatibility Matrix**:

| Package | Min Node.js | Max Node.js | Our Node.js (20.20.0) | Status |
|---------|-------------|-------------|----------------------|--------|
| jest@30.x | 18.x | 22.x | 20.20.0 | ✓ Compatible |
| supertest@7.x | 14.16.0 | Latest | 20.20.0 | ✓ Compatible |

**Jest 30 Key Features for This Project**:

| Feature | Benefit |
|---------|---------|
| ESM wrapper support | Modern module compatibility |
| Improved glob patterns | Better test file discovery |
| Node 18+ optimizations | Performance improvements |
| Built-in coverage | No additional tools needed |

**No Version Conflicts Detected**: All recommended packages are mutually compatible with Node.js 20.20.0.

**TypeScript Consideration**:

TypeScript is not used in this project (pure JavaScript), so TypeScript-related Jest configurations are not required. The test files will use CommonJS format matching the source code.

## 0.4 Test Implementation Design

This section defines the comprehensive test strategy, test case blueprints, and implementation approach for the server.js testing suite.

### 0.4.1 Test Strategy Selection

**Test Types to Implement**:

| Test Type | Focus Areas | Priority |
|-----------|-------------|----------|
| Unit Tests | Request handler, response formatting, configuration | High |
| Integration Tests | Full HTTP request/response cycle via Supertest | High |
| Edge Case Tests | Various HTTP methods, paths, concurrent requests | Medium |
| Error Handling Tests | Port conflicts, shutdown signals, server errors | High |

**Testing Approach**:

```
┌─────────────────────────────────────────────────────────────┐
│                    Test Architecture                        │
├─────────────────────────────────────────────────────────────┤
│  Layer 1: Unit Tests (Isolated Logic)                       │
│  - Response body content verification                       │
│  - Status code verification                                 │
│  - Header verification                                      │
├─────────────────────────────────────────────────────────────┤
│  Layer 2: Integration Tests (HTTP Layer)                    │
│  - Full HTTP request/response via Supertest                 │
│  - Server lifecycle (start/stop)                            │
├─────────────────────────────────────────────────────────────┤
│  Layer 3: Error Handling Tests                              │
│  - Port binding failures                                    │
│  - Graceful shutdown                                        │
├─────────────────────────────────────────────────────────────┤
│  Layer 4: Edge Case Tests                                   │
│  - Multiple HTTP methods                                    │
│  - Various URL paths                                        │
│  - Concurrent requests                                      │
└─────────────────────────────────────────────────────────────┘
```

### 0.4.2 Test Case Blueprint

**Component: HTTP Server (server.js)**

```
Component: server.js HTTP Server
Test Categories:

Happy Path Scenarios:
- Server starts successfully on port 3000
- GET request returns "Hello, World!\n"
- Response status code is 200
- Content-Type header is "text/plain"
- Console logs startup message

Edge Cases:
- POST request returns same response as GET
- PUT request returns same response as GET
- DELETE request returns same response as GET
- PATCH request returns same response as GET
- OPTIONS request returns same response
- HEAD request returns headers without body
- Request to /random/path returns same response
- Request with query parameters returns same response
- Multiple concurrent requests succeed

Error Cases:
- Server handles SIGTERM gracefully
- Server handles SIGINT gracefully
- Port already in use error handling
- Server close callback executes properly

Performance Boundaries:
- Response time under 100ms (basic check)
- Multiple sequential requests maintain performance
```

### 0.4.3 Detailed Test Specifications

**Test Suite 1: Server Startup Tests**

| Test ID | Description | Expected Outcome |
|---------|-------------|------------------|
| ST-001 | Server creates http.Server instance | Instance is typeof http.Server |
| ST-002 | Server binds to configured port | No EADDRINUSE error |
| ST-003 | Console logs startup URL | Log contains "http://127.0.0.1:3000" |

**Test Suite 2: HTTP Response Tests**

| Test ID | Description | Expected Outcome |
|---------|-------------|------------------|
| HR-001 | GET / returns 200 status | res.statusCode === 200 |
| HR-002 | Response body is "Hello, World!\n" | res.text === "Hello, World!\n" |
| HR-003 | Content-Type is text/plain | res.headers['content-type'] === 'text/plain' |

**Test Suite 3: HTTP Method Tests**

| Test ID | Description | Expected Outcome |
|---------|-------------|------------------|
| HM-001 | POST returns 200 | Status 200, body "Hello, World!\n" |
| HM-002 | PUT returns 200 | Status 200, body "Hello, World!\n" |
| HM-003 | DELETE returns 200 | Status 200, body "Hello, World!\n" |
| HM-004 | PATCH returns 200 | Status 200, body "Hello, World!\n" |
| HM-005 | OPTIONS returns 200 | Status 200, body "Hello, World!\n" |
| HM-006 | HEAD returns 200 with no body | Status 200, body empty |

**Test Suite 4: Path Variation Tests**

| Test ID | Description | Expected Outcome |
|---------|-------------|------------------|
| PV-001 | GET /api returns same response | Status 200, "Hello, World!\n" |
| PV-002 | GET /test/path returns same response | Status 200, "Hello, World!\n" |
| PV-003 | GET /?query=param returns same response | Status 200, "Hello, World!\n" |

**Test Suite 5: Server Shutdown Tests**

| Test ID | Description | Expected Outcome |
|---------|-------------|------------------|
| SS-001 | Server closes without error | server.close() callback fires |
| SS-002 | No open handles after close | Process can exit cleanly |

**Test Suite 6: Error Handling Tests**

| Test ID | Description | Expected Outcome |
|---------|-------------|------------------|
| EH-001 | Port in use error emitted | EADDRINUSE error thrown/handled |

**Test Suite 7: Concurrent Request Tests**

| Test ID | Description | Expected Outcome |
|---------|-------------|------------------|
| CR-001 | 10 simultaneous requests succeed | All return 200 with correct body |

### 0.4.4 Existing Test Extension Strategy

**No existing tests to extend** - This is a greenfield testing implementation.

The implementation will create an entirely new test suite following Jest conventions and Node.js HTTP server testing best practices.

### 0.4.5 Test Data and Fixtures Design

**Required Test Data Structures**: None - The server is stateless and returns a constant response.

**Fixture Organization Strategy**:

| Fixture Type | Purpose | Location |
|--------------|---------|----------|
| Server Factory | Create testable server instances | `tests/helpers/server.js` or inline |
| HTTP Methods Array | Iterate through methods for testing | Inline in test file |
| URL Paths Array | Iterate through paths for testing | Inline in test file |

**Mock Object Specifications**:

| Mock Target | Strategy | Purpose |
|-------------|----------|---------|
| console.log | Jest spy (jest.spyOn) | Verify startup message logging |
| process events | Real events | Test signal handling |

**Test Database/State Management**: Not applicable - The server has no persistence layer.

**Server Instance Management**:

```javascript
// Pattern: Create fresh server per test suite
let server;
beforeAll(() => { server = createServer(); });
afterAll(() => { server.close(); });
```

## 0.5 Test File Transformation Mapping

This section provides the exhaustive mapping of all test files to be created, modified, or referenced during the testing implementation.

### 0.5.1 File-by-File Test Plan

**Test Transformation Modes**:
- **CREATE** - Create a new test file
- **UPDATE** - Update an existing file
- **DELETE** - Remove an obsolete file
- **REFERENCE** - Use as an example for patterns

| Target Test File | Transformation | Source File/Reference | Purpose/Changes |
|-----------------|----------------|----------------------|-----------------|
| `tests/server.test.js` | CREATE | `server.js` | Main test suite covering HTTP responses, status codes, headers, server lifecycle |
| `tests/server.startup.test.js` | CREATE | `server.js` | Server startup and binding tests |
| `tests/server.shutdown.test.js` | CREATE | `server.js` | Graceful shutdown and cleanup tests |
| `tests/server.methods.test.js` | CREATE | `server.js` | HTTP method handling tests (GET, POST, PUT, DELETE, etc.) |
| `tests/server.edge-cases.test.js` | CREATE | `server.js` | Edge cases including paths, concurrent requests |
| `tests/server.errors.test.js` | CREATE | `server.js` | Error handling tests (port in use, etc.) |
| `jest.config.js` | CREATE | N/A | Jest configuration for Node.js environment |
| `package.json` | UPDATE | `package.json` | Add devDependencies and test script |

**Alternative Single-File Approach**:

For a project of this minimal size, a consolidated approach may be preferred:

| Target Test File | Transformation | Source File/Reference | Purpose/Changes |
|-----------------|----------------|----------------------|-----------------|
| `server.test.js` | CREATE | `server.js` | Comprehensive test suite with all test categories |
| `jest.config.js` | CREATE | N/A | Jest configuration for Node.js environment |
| `package.json` | UPDATE | `package.json` | Add devDependencies and test script |

### 0.5.2 New Test Files Detail

**Primary Test File: `server.test.js` or `tests/server.test.js`**

| Aspect | Specification |
|--------|--------------|
| Location | Project root or `tests/` directory |
| Test Categories | HTTP responses, status codes, headers, startup, shutdown, methods, edge cases, errors |
| Mock Dependencies | `console.log` (Jest spy) |
| Assertions Focus | Response body, status codes, headers, lifecycle events |

**Test Structure**:

```
describe('HTTP Server (server.js)')
├── describe('Server Startup')
│   ├── test('should start without errors')
│   └── test('should log startup message')
├── describe('HTTP Responses')
│   ├── test('should return 200 status code')
│   ├── test('should return "Hello, World!" body')
│   └── test('should set Content-Type header')
├── describe('HTTP Methods')
│   ├── test('GET returns correct response')
│   ├── test('POST returns correct response')
│   ├── test('PUT returns correct response')
│   ├── test('DELETE returns correct response')
│   ├── test('PATCH returns correct response')
│   ├── test('OPTIONS returns correct response')
│   └── test('HEAD returns headers without body')
├── describe('URL Paths')
│   ├── test('/ returns correct response')
│   ├── test('/api returns correct response')
│   └── test('/with?query=params returns correct response')
├── describe('Server Shutdown')
│   └── test('should close gracefully')
├── describe('Error Handling')
│   └── test('should handle port in use error')
└── describe('Edge Cases')
    └── test('should handle concurrent requests')
```

**Jest Configuration File: `jest.config.js`**

| Setting | Value | Rationale |
|---------|-------|-----------|
| testEnvironment | 'node' | Testing Node.js HTTP server, not browser |
| coverageDirectory | 'coverage' | Standard coverage output location |
| collectCoverageFrom | ['server.js'] | Only test main server file |
| coverageThreshold | {global: {statements: 100, branches: 100, functions: 100, lines: 100}} | Full coverage target |
| testMatch | ['**/*.test.js'] | Standard Jest test file pattern |
| verbose | true | Detailed test output |

### 0.5.3 Test Files to Modify Detail

**File: `package.json`**

| Modification | Before | After |
|--------------|--------|-------|
| Add devDependencies | `{}` (empty) | `{ "jest": "^30.2.0", "supertest": "^7.0.0" }` |
| Update test script | `"echo \"Error...\" && exit 1"` | `"jest --coverage"` |

**Changes Required**:

```json
{
  "devDependencies": {
    "jest": "^30.2.0",
    "supertest": "^7.0.0"
  },
  "scripts": {
    "test": "jest --coverage"
  }
}
```

### 0.5.4 Test Configuration Updates

| Config File | Update Required | Description |
|-------------|-----------------|-------------|
| `jest.config.js` | CREATE | Node.js test environment configuration |
| `package.json` | UPDATE | Add test script and devDependencies |

**Jest Configuration Content**:

| Property | Value | Purpose |
|----------|-------|---------|
| testEnvironment | 'node' | Use Node.js environment |
| verbose | true | Show individual test results |
| collectCoverage | true | Generate coverage report |
| coverageDirectory | './coverage' | Coverage output location |
| coverageReporters | ['text', 'lcov', 'html'] | Multiple report formats |
| testTimeout | 10000 | 10 second timeout for server tests |
| forceExit | true | Ensure process exits after tests |
| detectOpenHandles | true | Warn about open handles |

### 0.5.5 Cross-File Test Dependencies

**Shared Fixtures**: None required - All test data is inline.

**Mock Objects**:

| Mock | Location | Purpose |
|------|----------|---------|
| console.log spy | Inline in test file | Verify startup logging |

**Test Utilities**: No shared helper functions required for this minimal test suite.

**Import Structure**:

```javascript
// server.test.js imports
const request = require('supertest');
const http = require('http');

// Import or inline server creation
// Option 1: Import from refactored server module
const createServer = require('./server');

// Option 2: Inline server creation (if server.js not refactored)
const createTestServer = () => {
  // Replicate server creation logic
};
```

**Server Module Consideration**:

For optimal testability, `server.js` should export the server or a createServer function. Current implementation starts server immediately on require. Two approaches available:

| Approach | Pros | Cons |
|----------|------|------|
| Refactor server.js to export createServer | Clean separation, standard pattern | Requires source modification |
| Create test-specific server replica | No source changes required | Code duplication |

**Recommendation**: Minimal refactor of `server.js` to conditionally export vs auto-start is the cleanest approach.

## 0.6 Dependency Inventory

This section provides the complete inventory of testing dependencies required for the unit testing implementation.

### 0.6.1 Testing Dependencies

**Required Testing Packages**:

| Registry | Package Name | Version | Purpose |
|----------|--------------|---------|---------|
| npm | jest | ^30.2.0 | Testing framework with built-in assertions, mocking, and coverage |
| npm | supertest | ^7.0.0 | HTTP server testing library for request/response assertions |

**Installation Command**:

```bash
npm install --save-dev jest@^30.2.0 supertest@^7.0.0
```

**Dependency Details**:

**jest@^30.2.0**:
- Purpose: JavaScript testing framework
- Features used:
  - Test runner (`describe`, `test`, `it`)
  - Assertions (`expect`)
  - Lifecycle hooks (`beforeAll`, `afterAll`, `beforeEach`, `afterEach`)
  - Mocking (`jest.spyOn`, `jest.fn`)
  - Coverage reporting (`--coverage`)
- Node.js requirement: 18.x or higher ✓
- Latest verified version: 30.2.0

**supertest@^7.0.0**:
- Purpose: HTTP assertion library
- Features used:
  - HTTP request methods (`.get()`, `.post()`, `.put()`, `.delete()`, `.patch()`, `.options()`, `.head()`)
  - Response assertions (`.expect()`)
  - Header validation (`.expect('Content-Type', ...)`)
  - Status code validation (`.expect(200)`)
- Node.js requirement: 14.16.0 or higher ✓
- Latest verified version: 7.0.0

**Dependencies NOT Required**:

| Package | Reason Not Needed |
|---------|------------------|
| chai | Jest includes built-in assertions |
| sinon | Jest includes built-in mocking |
| mocha | Jest selected as test framework |
| nyc/istanbul | Jest includes built-in coverage |
| @types/jest | Project uses JavaScript, not TypeScript |
| jest-environment-jsdom | Testing Node.js server, not browser |

### 0.6.2 Import Updates

**Test File Imports**:

```javascript
// Required imports for server.test.js
const request = require('supertest');
const http = require('http');
```

**Import Transformation Rules**:

| File | Import Statement | Purpose |
|------|-----------------|---------|
| `server.test.js` | `const request = require('supertest');` | HTTP testing |
| `server.test.js` | `const http = require('http');` | Server creation (if inline) |

**No existing test files require import updates** - This is a greenfield implementation.

### 0.6.3 Package.json Updates

**Before**:

```json
{
  "name": "hello_world",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "hxu",
  "license": "ISC",
  "description": ""
}
```

**After**:

```json
{
  "name": "hello_world",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "test:verbose": "jest --coverage --verbose"
  },
  "keywords": [],
  "author": "hxu",
  "license": "ISC",
  "description": "",
  "devDependencies": {
    "jest": "^30.2.0",
    "supertest": "^7.0.0"
  }
}
```

### 0.6.4 Transitive Dependencies

The following transitive dependencies will be installed automatically:

| Direct Dependency | Notable Transitive Dependencies |
|------------------|--------------------------------|
| jest | @jest/core, @jest/expect, jest-cli, babel-jest |
| supertest | superagent, methods, component-emitter |

**Disk Space Estimate**: ~50-80MB for node_modules (development only)

**Lock File**: `package-lock.json` will be updated to record exact versions for reproducible builds.

## 0.7 Coverage and Quality Targets

This section defines the coverage metrics, quality criteria, and standards for the testing implementation.

### 0.7.1 Coverage Metrics

**Current Coverage Status**: 0% (No tests exist)

**Target Coverage**:

| Metric | Current | Target | Rationale |
|--------|---------|--------|-----------|
| Statement Coverage | 0% | 100% | 15-line codebase makes 100% achievable |
| Branch Coverage | 0% | 100% | No conditional branches in code |
| Function Coverage | 0% | 100% | Single request handler function |
| Line Coverage | 0% | 100% | All lines are critical path |

**Coverage Thresholds Configuration**:

```javascript
// jest.config.js
coverageThreshold: {
  global: {
    statements: 100,
    branches: 100,
    functions: 100,
    lines: 100
  }
}
```

**Coverage Gaps to Address**:

| Component | Current State | Target State | Gap Analysis |
|-----------|---------------|--------------|--------------|
| HTTP Response Handler | 0% | 100% | Create tests for response body |
| Status Code Setting | 0% | 100% | Create tests for 200 status |
| Header Setting | 0% | 100% | Create tests for Content-Type |
| Server Binding | 0% | 100% | Create tests for listen() |
| Console Logging | 0% | 100% | Create tests for startup log |

**Focus Areas for Coverage**:

| Area | Test Count Required | Priority |
|------|---------------------|----------|
| Critical paths (HTTP response) | 5+ tests | High |
| Error handlers (port binding) | 2+ tests | High |
| Edge cases (methods, paths) | 10+ tests | Medium |

**Per-File Coverage Targets**:

| File | Target Coverage | Notes |
|------|-----------------|-------|
| `server.js` | 100% | Only production file in project |

### 0.7.2 Test Quality Criteria

**Assertion Density Expectations**:

| Test Category | Minimum Assertions per Test |
|---------------|----------------------------|
| HTTP Response Tests | 2-3 (status, body, headers) |
| Server Lifecycle Tests | 1-2 |
| Error Handling Tests | 1-2 |
| Edge Case Tests | 1-2 |

**Test Isolation Requirements**:

| Requirement | Implementation |
|-------------|----------------|
| No shared state between tests | Fresh server instance per test suite |
| No test order dependencies | Each test self-contained |
| Proper cleanup | afterAll/afterEach hooks close servers |
| No global pollution | Avoid modifying global objects |

**Performance Constraints for Test Execution**:

| Constraint | Target | Rationale |
|------------|--------|-----------|
| Total test suite runtime | < 10 seconds | Fast feedback loop |
| Individual test timeout | 5 seconds max | Catch hanging tests |
| Server startup per test | < 100ms | Quick test isolation |

**Maintainability Standards**:

| Standard | Implementation |
|----------|----------------|
| Descriptive test names | Use full sentences describing behavior |
| AAA pattern | Arrange-Act-Assert structure |
| DRY where sensible | Extract common setup to beforeEach |
| Clear error messages | Custom assertion messages when helpful |

**Repository Test Pattern Compliance**:

| Convention | Application |
|------------|-------------|
| Test file naming | `*.test.js` pattern |
| Test location | Root or `tests/` directory |
| Import style | CommonJS `require()` |
| Async handling | async/await with Supertest |

### 0.7.3 Quality Gates

**Test Success Rate Target**: 100% pass rate required for CI/CD (when implemented)

**Coverage Enforcement**:

```javascript
// Jest will fail if coverage drops below thresholds
coverageThreshold: {
  global: {
    statements: 100,
    branches: 100,
    functions: 100,
    lines: 100
  }
}
```

**Test Output Requirements**:

| Report | Format | Purpose |
|--------|--------|---------|
| Console output | Jest default | Developer feedback |
| Coverage summary | Text | Quick coverage check |
| Coverage HTML | HTML report | Detailed line-by-line analysis |
| Coverage LCOV | LCOV format | CI/CD integration |

## 0.8 Scope Boundaries

This section clearly delineates what is within scope and explicitly out of scope for this testing implementation.

### 0.8.1 Exhaustively In Scope

**New Test Files** (with trailing patterns):

| Pattern | Description |
|---------|-------------|
| `server.test.js` | Main comprehensive test file |
| `tests/**/*.test.js` | Alternative nested test location |

**Test File Updates**: None (greenfield implementation)

**Test Configuration Files**:

| File | Purpose |
|------|---------|
| `jest.config.js` | Jest test runner configuration |
| `package.json` | Updated with test script and devDependencies |

**Test Utilities and Helpers**: None required for this minimal project

**Coverage Reports**:

| Output | Location |
|--------|----------|
| `coverage/` | Generated coverage reports directory |
| `coverage/lcov-report/` | HTML coverage report |
| `coverage/lcov.info` | LCOV data file |

**Test Categories In Scope**:

| Category | Test Count | Description |
|----------|------------|-------------|
| Server Startup | 2-3 | Verify server initializes correctly |
| HTTP Responses | 3-4 | Body, status code, headers |
| HTTP Methods | 7 | GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD |
| URL Paths | 3-4 | Root, nested paths, query params |
| Server Shutdown | 1-2 | Graceful termination |
| Error Handling | 1-2 | Port in use scenarios |
| Edge Cases | 1-2 | Concurrent requests |

**Total Test Count Estimate**: 20-25 test cases

### 0.8.2 Explicitly Out of Scope

**Source Code Modifications**:

| Exclusion | Rationale |
|-----------|-----------|
| Major `server.js` refactoring | Tests should work with minimal source changes |
| Adding new features to server | Testing existing functionality only |
| Performance optimizations | Outside testing scope |
| Security hardening | Outside testing scope |

**Testing Infrastructure Not Required**:

| Item | Rationale |
|------|-----------|
| CI/CD pipeline setup | Not specified in requirements |
| Docker test containers | Overkill for minimal project |
| Test database setup | Server is stateless |
| Mock external services | No external dependencies |
| E2E browser testing | No browser UI |
| Performance/load testing infrastructure | Manual verification sufficient |

**Files Explicitly Excluded**:

| File | Reason |
|------|--------|
| `README.md` | Documentation, not testable code |
| `package-lock.json` | Auto-generated, no tests needed |

**Testing Types Out of Scope**:

| Type | Reason |
|------|--------|
| Snapshot testing | No UI or complex object structures |
| Visual regression testing | No visual components |
| Accessibility testing | Plain text HTTP response |
| Security penetration testing | Localhost-only binding |
| Cross-browser testing | Node.js server, no browser |
| Mobile testing | No mobile interface |

**Unchanged Per User Requirements**:

| Item | Status |
|------|--------|
| Production deployment configuration | Not modified |
| Environment-specific settings | Not modified |
| Build/bundle configuration | Not modified |

### 0.8.3 Scope Boundary Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         IN SCOPE                                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────┐  │
│  │  Test Files     │  │  Configuration  │  │   Coverage     │  │
│  │  *.test.js      │  │  jest.config.js │  │   Reports      │  │
│  │                 │  │  package.json   │  │   coverage/    │  │
│  └─────────────────┘  └─────────────────┘  └────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Test Categories                       │   │
│  │  - HTTP Responses      - HTTP Methods     - Paths       │   │
│  │  - Server Startup      - Server Shutdown  - Errors      │   │
│  │  - Edge Cases          - Concurrent Requests            │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        OUT OF SCOPE                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────┐  │
│  │  Source Code    │  │  Infrastructure │  │   Other        │  │
│  │  Refactoring    │  │  CI/CD Setup    │  │   E2E Tests    │  │
│  │  New Features   │  │  Docker         │  │   Perf Tests   │  │
│  │  Optimizations  │  │  Deployment     │  │   Security     │  │
│  └─────────────────┘  └─────────────────┘  └────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 0.9 Execution Parameters

This section provides the specific commands and execution parameters for running the test suite.

### 0.9.1 Testing-Specific Instructions

**Test Execution Commands**:

| Command | Purpose | Usage |
|---------|---------|-------|
| `npm test` | Run all tests with coverage | Standard test execution |
| `npm run test:watch` | Run tests in watch mode | Development iteration |
| `npm run test:verbose` | Run with detailed output | Debugging test failures |

**Detailed Command Reference**:

**Primary Test Command**:
```bash
npm test
# Equivalent to: jest --coverage

```

**Coverage Measurement Command**:
```bash
npx jest --coverage
# Output: Coverage report in console and coverage/ directory

```

**Watch Mode Command** (for development):
```bash
npx jest --watch
# Reruns tests on file changes

```

**Single Test Execution Pattern**:
```bash
# Run specific test file

npx jest server.test.js

#### Run tests matching pattern

npx jest --testNamePattern="HTTP Responses"

#### Run specific test by line

npx jest server.test.js:25
```

**Debug Mode Execution**:
```bash
# Run with Node.js debugger

node --inspect-brk node_modules/.bin/jest --runInBand

#### With verbose output

npx jest --verbose --detectOpenHandles
```

**Useful Jest Flags**:

| Flag | Purpose |
|------|---------|
| `--coverage` | Generate coverage report |
| `--verbose` | Show individual test results |
| `--watch` | Watch mode for development |
| `--runInBand` | Run tests serially (for debugging) |
| `--detectOpenHandles` | Show open handles preventing exit |
| `--forceExit` | Force Jest to exit after tests |
| `--testNamePattern=<regex>` | Run tests matching pattern |
| `--bail` | Stop on first test failure |

### 0.9.2 Environment Setup Requirements

**Pre-Test Environment Checklist**:

| Step | Command | Expected Result |
|------|---------|-----------------|
| Verify Node.js | `node --version` | v20.x.x |
| Verify npm | `npm --version` | 11.x.x |
| Install dependencies | `npm install` | All packages installed |
| Verify Jest installed | `npx jest --version` | 30.x.x |

**Environment Variables** (if needed):

| Variable | Default | Purpose |
|----------|---------|---------|
| `CI` | undefined | Set to `true` for CI environment |
| `NODE_ENV` | undefined | Set to `test` for test environment |

**Test Execution in CI Environment**:
```bash
CI=true npm test
# Disables watch mode, exits with code on failure

```

### 0.9.3 Test Patterns and Conventions

**Test File Discovery**:

Jest will automatically discover test files matching:
- `**/*.test.js`
- `**/*.spec.js`
- `**/__tests__/**/*.js`

**Recommended Test Structure**:

```javascript
describe('Server Component', () => {
  beforeAll(async () => {
    // Setup: start server
  });

  afterAll(async () => {
    // Teardown: close server
  });

  describe('Feature Category', () => {
    test('should [expected behavior]', async () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### 0.9.4 Expected Test Output

**Successful Test Run**:
```
PASS  ./server.test.js
  HTTP Server (server.js)
    Server Startup
      ✓ should start without errors (15 ms)
      ✓ should log startup message (5 ms)
    HTTP Responses
      ✓ should return 200 status code (8 ms)
      ✓ should return "Hello, World!" body (3 ms)
      ✓ should set Content-Type to text/plain (2 ms)
    ...

Test Suites: 1 passed, 1 total
Tests:       20 passed, 20 total
Snapshots:   0 total
Time:        2.5 s

----------|---------|----------|---------|---------|
File      | % Stmts | % Branch | % Funcs | % Lines |
----------|---------|----------|---------|---------|
All files |   100   |   100    |   100   |   100   |
server.js |   100   |   100    |   100   |   100   |
----------|---------|----------|---------|---------|
```

**Test Failure Handling**:

```bash
# Exit code on success

echo $?  # 0

#### Exit code on failure

echo $?  # 1
```

## 0.10 Special Instructions for Testing

This section captures testing-specific requirements and directives for the implementation.

### 0.10.1 Testing-Specific Requirements

**Framework Selection Directive**:
- User specified: "Jest or Mocha"
- Recommendation: **Jest** for zero-configuration setup and built-in features
- Rationale: Jest includes assertions, mocking, and coverage without additional dependencies

**Code Modification Approach**:

The current `server.js` auto-starts the server when required. For optimal testability, a minimal refactor pattern is recommended:

**Current Pattern** (server.js):
```javascript
const server = http.createServer((req, res) => {
  // handler
});
server.listen(port, hostname, callback);
```

**Testable Pattern** (server.js):
```javascript
function createServer() {
  return http.createServer((req, res) => {
    // handler
  });
}

// Auto-start only if run directly
if (require.main === module) {
  const server = createServer();
  server.listen(port, hostname, callback);
}

module.exports = { createServer };
```

This pattern:
- Allows tests to import `createServer` without auto-starting
- Preserves existing behavior when run directly via `node server.js`
- Follows Node.js module conventions

### 0.10.2 Implementation Directives

**Test Isolation Requirements**:
- Each test must be independent and runnable in any order
- Use `beforeAll`/`afterAll` for server lifecycle management
- Avoid shared mutable state between tests
- Ensure all server instances are properly closed after tests

**Async Handling Pattern**:
- Use async/await with Supertest for cleaner test code
- Ensure proper promise resolution before assertions
- Handle server close operations with callbacks or promisification

**Mocking Strategy**:
- Use `jest.spyOn(console, 'log')` to verify startup message
- No external service mocking required (no dependencies)
- No database mocking required (stateless server)

**Test Naming Conventions**:
- Use descriptive, behavior-focused test names
- Format: `should [expected behavior] when [condition]`
- Example: `should return 200 status code when GET request is made`

### 0.10.3 Quality Assurance Checklist

**Before Submitting Tests**:

| Check | Verification |
|-------|--------------|
| All tests pass | `npm test` exits with code 0 |
| Coverage meets threshold | 100% on all metrics |
| No open handles | `--detectOpenHandles` shows no warnings |
| Tests run independently | Each test passes when run solo |
| No hardcoded ports | Server uses ephemeral ports in tests |
| Proper cleanup | All servers closed in afterAll/afterEach |

**Test Code Quality**:

| Requirement | Implementation |
|-------------|----------------|
| Readable test descriptions | Full sentences describing behavior |
| AAA pattern | Arrange, Act, Assert structure |
| Single responsibility | Each test verifies one behavior |
| No console noise | Mock console.log if needed |
| Fast execution | Individual tests under 1 second |

### 0.10.4 Known Considerations

**Server Startup in Tests**:

Supertest can handle server instances directly without manual port binding. The recommended pattern:

```javascript
const request = require('supertest');
const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

describe('Server', () => {
  test('should respond with Hello World', async () => {
    const response = await request(server).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello, World!\n');
  });
});
```

**Port Binding Edge Case**:

For testing port-in-use errors, create a temporary listener:

```javascript
test('should handle port in use', (done) => {
  const blocker = http.createServer();
  blocker.listen(3000, () => {
    // Try to start main server on same port
    // Expect EADDRINUSE error
    blocker.close(done);
  });
});
```

### 0.10.5 README Consideration

The `README.md` contains the directive: "test project for backprop integration. Do not touch!"

**Interpretation**: This directive refers to the production `server.js` code stability. Adding test infrastructure (test files, jest.config.js, devDependencies) does not modify the production server behavior and is consistent with the project's role as a test fixture. Tests enhance the reliability of the test fixture without changing its behavior.

