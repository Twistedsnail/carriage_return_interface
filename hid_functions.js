const HID = require('node-hid');
const {StringDecoder} = require('string_decoder');
const decoder = new StringDecoder('utf8');

const empty_packet = [
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];

var device = null;
var debug_data = "";
var data_callback = null;
var error_callback = null;

function error_handler(err) {
	disconnect_device();
	
	console.log("Error: ", err);
	error_callback();
}

function data_handler(data) {
	if(data.length != 64) {
		console.log("Short message", data.length);
		console.log(data);
	}
	else if(data[0] == 1) {
		var data_end = 2 + data[1]
		var data_seg = data.slice(2, data_end + 1);

		debug_data += decoder.write(data_seg);
		data_callback(debug_data);
	}
	else {
		console.log("Unhandled message type", data[0]);
	}
}

function send_packet(packet) {
	packet.splice(0, 0, 0);
	device.write(packet);
	console.log("Wrote to device", packet);
}

function send_debug_connect() {
	var packet = empty_packet;
	packet[0] = 1;
	send_packet(packet);
}

function disconnect_device() {
	if(device != null) {
		device.close();
	}

	// Clear debug window
	debug_data = "";
	data_callback(debug_data);

	device = null;
}

function connect_device(callback, error) {
	var success;
	var devices = HID.devices();
	
	try {		
		var deviceInfo = devices.find( function(d) {
			var isComms = d.vendorId===5824 && d.productId===1500 && d.interface===1;
			return isComms;
		});
		
		device = new HID.HID(deviceInfo.path);
		success = true;
		
		data_callback = callback;
		error_callback = error;
		
		device.on('error', error_handler);
		device.on('data', data_handler);

		send_debug_connect();
	}
	catch (error) {
		success = false;
	}
	
	return success;
}

function send_code(code) {
	var code_seg = code.split(" ");
	var code_size = code_seg.length + 1;

	if(code_size > 64) {
		console.log("Can't send code larger than a packet yet");
	}
	else {
		var packet = empty_packet;
		packet[0] = 2;
		for(var n = 0; n < code_seg.length; n ++) {
			packet[1 + n] = parseInt(code_seg[n], 16);
		}
		send_packet(packet);
	}
}

module.exports = {connect_device, disconnect_device, send_code};