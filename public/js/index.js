// const socket = io('http://localhost:5000/'); // Neu khac port
const socket = io();
const { name, room } = $.deparam(window.location.search);

socket.on('connect', () => {
	socket.emit('USER_INFO', { name, room });
});
socket.on('disconnect', () => console.log('Server downs'));

socket.on('MESSAGE_TO_CLIENT', message => {
	const { content, from, createdAt } = message;
	const template = $('#message-template').html();
	const html = Mustache.render(template, { content, from, createdAt });
	$('#messages').append(html);
});

socket.on('LOCATION_TO_CLIENT', message => {
	const { lat, lng, from, createdAt } = message;
	const template = $('#location-template').html();
	const html = Mustache.render(template, {
		href: `https://www.google.com/maps?q=${lat},${lng}`,
		from,
		createdAt,
	});
	$('#messages').append(html);
});

$('#message-form').on('submit', event => {
	event.preventDefault();
	const content = $('[name=message]').val();
	socket.emit('MESSAGE_TO_SERVER', { from: name, content });
	$('[name=message]').val('');
	$('#messages').scrollTop($('#messages').height());
});

$('#message-location').on('click', event => {
	if (!navigator.geolocation) alert('Your browser is old');
	navigator.geolocation.getCurrentPosition(position => {
		const lat = position.coords.latitude;
		const lng = position.coords.longitude;
		socket.emit('LOCATION_TO_SERVER', { from: name, lat, lng });
	});
});
// Co the xai trong Dev Tool de gui tin nhan
// socket.emit('MESSAGE_TO_SERVER', { from: name, content: 'Hello server !!!' })
