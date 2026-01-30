# hao-backprop-test

Test project for backprop integration. Do not touch!

## Overview

This is a simple Node.js HTTP server built with Express.js framework.

## Installation

Install dependencies before running the server:

```bash
npm install
```

## Starting the Server

Run the server using npm:

```bash
npm start
```

Or directly with Node.js:

```bash
node server.js
```

The server binds to `127.0.0.1:3000` by default.

## API Endpoints

| Endpoint | Method | Response | Content-Type |
|----------|--------|----------|--------------|
| `/` | GET | `Hello, World!\n` | text/plain |
| `/evening` | GET | `Good evening` | text/plain |

### GET /

Returns a "Hello, World!" greeting message.

**Response:**
```
Hello, World!
```

### GET /evening

Returns a "Good evening" greeting message.

**Response:**
```
Good evening
```

## Technical Details

- **Framework:** Express.js 5.x
- **Runtime:** Node.js 18+
- **Server:** Binds to `127.0.0.1:3000`

This server was migrated from the native Node.js `http` module to Express.js framework to provide a more extensible routing system.
