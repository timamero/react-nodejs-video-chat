"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chatMessage = (socket, io) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
        console.log('message: ' + msg);
    });
};
const chatHandlers = {
    chatMessage
};
exports.default = chatHandlers;
