"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const streamUserVideo = (socket, io) => {
    socket.on('streamUser', (video) => {
        io.emit('streamUser', video);
        console.log('streaming', video);
    });
};
const videoHandlers = {
    streamUserVideo
};
exports.default = videoHandlers;
