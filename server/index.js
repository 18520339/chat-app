const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');
const moment = require('moment');

const app = express();
const server = http.createServer(app);

// http://localhost:5000/socket.io/socket.io.js
const io = socketIO(server);
io.on('connection', socket => {
	socket.on('USER_INFO', message => {
		const { name, room } = message;
		socket.join(room);

		socket.emit('MESSAGE_TO_CLIENT', {
			from: 'Admin',
			content: 'Welcome to the Chat app',
			createdAt: moment().format('hh:mm a'),
		});

		socket.broadcast.to(room).emit('MESSAGE_TO_CLIENT', {
			from: 'Admin',
			content: `${name} joins`,
			createdAt: moment().format('hh:mm a'),
		});

		socket.on('MESSAGE_TO_SERVER', message => {
			io.to(room).emit('MESSAGE_TO_CLIENT', {
				from: message.from,
				content: message.content,
				createdAt: moment().format('hh:mm a'),
			});
		});

		socket.on('LOCATION_TO_SERVER', message => {
			io.to(room).emit('LOCATION_TO_CLIENT', {
				from: message.from,
				lat: message.lat,
				lng: message.lng,
				createdAt: moment().format('hh:mm a'),
			});
		});
	});

	socket.on('disconnect', () => console.log('User exit'));
});

const publicPath = path.join(__dirname + '/../public');
app.use(express.static(publicPath));

const port = process.env.NODE_ENV || 5000;
server.listen(port, () => console.log(`App is running on port ${port}`));

// Design Pattern Observer (subscriber, publisher)
// Vd: lifecircle hook, mongoose-pre, socket.io
