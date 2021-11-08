"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const streamVideo = (socket, io) => {
    socket.on('stream video', (video) => {
        io.emit('stream video', video);
        console.log('streaming video', video);
    });
};
const videoHandlers = {
    streamVideo
};
exports.default = videoHandlers;
