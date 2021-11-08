"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const chatHandler_1 = __importDefault(require("./controllers/chatHandler"));
const videoHandler_1 = __importDefault(require("./controllers/videoHandler"));
const port = 3001;
const server = http_1.default.createServer(app_1.default);
const options = {
    path: '/',
    serveClient: false,
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    },
};
const io = new socket_io_1.Server(server, options);
io.on('connection', (socket) => {
    console.log('a user connected');
    chatHandler_1.default.chatMessage(socket, io);
    videoHandler_1.default.streamUserVideo(socket, io);
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
io.listen(port);
