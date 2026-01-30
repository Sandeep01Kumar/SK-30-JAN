# hao-backprop-test

Test project for backprop integration. Do not touch!

## Overview

This is a simple Node.js HTTP server built with the Express.js framework. The server provides REST API endpoints that return plain text responses.

> **Note:** This project was migrated from the native Node.js `http` module to Express.js for improved routing capabilities and cleaner code structure.

## Prerequisites

- Node.js (v18.0.0 or higher)
- npm (v6.0.0 or higher)

## Installation

Install the project dependencies before running the server:

```bash
npm install
```

## Starting the Server

You can start the server using either of the following commands:

```bash
npm start
```

Or directly with Node.js:

```bash
node server.js
```

The server binds to `127.0.0.1:3000` by default.

## API Endpoints

The server exposes the following REST API endpoints:

| Endpoint | Method | Content-Type | Response |
|----------|--------|--------------|----------|
| `/` | GET | text/plain | `Hello, World!\n` |
| `/evening` | GET | text/plain | `Good evening` |

### GET /

Returns a "Hello, World!" greeting message.

**Request:**
```
GET http://127.0.0.1:3000/
```

**Response:**
```
HTTP/1.1 200 OK
Content-Type: text/plain

Hello, World!
```

### GET /evening

Returns a "Good evening" greeting message.

**Request:**
```
GET http://127.0.0.1:3000/evening
```

**Response:**
```
HTTP/1.1 200 OK
Content-Type: text/plain

Good evening
```

## Technical Details

- **Framework:** Express.js v5.x
- **Server Binding:** 127.0.0.1:3000
- **Response Format:** Plain text (text/plain)
