# 💬 Video Chat App

A video chat app created with Socket.io, Typescript, React, Redux, Node.js, and Express.  
  
*This project is still in development.*

## ✨Overview

### Purpose

*Why did I build this project?*

- To learn and develop my skills in Test Driven Development.
- To learn about web sockets and learn how to use [Socket.io](https://socket.io/).
- To learn about [RTCPeerConnection](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/RTCPeerConnection).

### Process

*What was your process for completing this project?* 

I used a kan ban board and created user stories to plan and visualize the tasks to create the application.

### Challenges

[To do] 

### Outcome

*What did you learn from making this project?*

[To do] 

*What learnings have you taken with you into other projects?*

[To do] 

### Retrospection

*What would you do differently next time?*

[To do] 

## 🚀 Quick Start
1. Clone this repository
    ```sh
    git clone https://github.com/timamero/react-nodejs-video-chat.git
    ```
2. Install dependencies
    ```sh
    npm install
    ```
3. Add .env file and set value for `MONGODB_URI`
4. Run the server and client in development mode
    ```sh
    npm run dev
    ```
 - Concurrently is used to run the server and client at the same time
 - You can also run the the app by running the server and client separately.
    ```sh
    cd backend
    npm run dev
    ```
    *Open new terminal*
    ```sh
    cd frontend
    npm start
    ```

4. Open the browser and go to http://localhost:3000/.

5. To demo the video chat room go to http://localhost:3000/testroom.

## 🧪 Testing
1. To run E2E testing run the following commands from the root folder.
    ```sh
    npm run cypress:prestart
    npm run cypress-e2e
    ```
2. To run component testing run the following commands from the root folder.
    ```sh
    npm run cypress:prestart
    npm run cypress-ct
    ```

E2E tests are located in `frontend/cypress/integration`.
Component tests are located in `frontend/src/__tests__`.