var HID = require('node-hid');
console.log('devices: ', HID.devices());
/*var dev = new HID.HID(5824, 1500);
var data = [0x0, 0x00, 0x2, 0xff, 0x7, 0x1, 0xff, 0x1, 0xff];
dev.on("data", function(data) {
	data = new Uint8Array(data.buffer);
	console.log('received: ', data);
})
console.log('sending: ', data);
dev.write(data);*/