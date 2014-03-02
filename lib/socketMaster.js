var io;
exports.init = function(server){
	io = require('socket.io').listen(server); // , { log: false }
	io.sockets.on('connection', function (socket) {
	  console.log("hit")
	  socket.on('joinStore', function (data) {
	  	console.log(data)
			socket.join(data.storeID);
			//io.sockets.in(data.storeID).emit('purchase', {test: 1});
		});
	  socket.on('disconnect', function () {
	    
	  });
	});
}

exports.getIO = function(){
	return io;
}