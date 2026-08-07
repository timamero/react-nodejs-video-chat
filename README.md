# Video Chat App

A video chat app created with Socket.io, Typescript, React, Redux, Node.js, Express, Redis, and Docker.

## Active Development

This project is under active development. I am currently updating tests, moving the frontend from Create React App to Vite, and improving code organization and error handling.

## Overview

I built this project to learn and practice test-driven development, web sockets, and RTCPeerConnection. The most challenging part was getting the peer-to-peer video connection working reliably while the React app was re-rendering.

I used dev logging and the MDN WebRTC signaling sample to better understand the connection flow, and React.memo helped keep unnecessary re-renders from breaking it.

Most recently, I migrated the backend from MongoDB to Redis and fixed the socket implementation to make the app simpler and more reliable.

## Demo
https://github.com/user-attachments/assets/c12aa5b9-2041-4963-ae88-e99645bea5e4

## Quick Start

**Required:** Must have Docker installed

1. Clone this repository
   ```sh
   git clone https://github.com/timamero/react-nodejs-video-chat.git
   ```
2. Install dependencies
   ```sh
   npm install
   ```
   ```sh
   cd backend && npm install && cd ..
   ```
   ```sh
   cd frontend && npm install && cd ..
   ```
3. Run the Redis server
   ```sh
   cd backend && npm run redis:start && cd ..
   ```
4. Run the server and client in development mode
   ```sh
   npm run dev
   ```

- Concurrently is used to run the server and client at the same time
- You can also run the app by running the server and client separately.
  ```sh
  cd backend
  npm run dev
  ```
  _Open new terminal_
  ```sh
  cd frontend
  npm start
  ```

4. Open the browser and go to http://localhost:3000/.

## How to Demo

To test the application, open the app in two separate browsers or browser tabs and sign in with different usernames in each browser.

Video streaming between two peers works best between the same browsers. The video streams are not displayed on mobile browsers.
