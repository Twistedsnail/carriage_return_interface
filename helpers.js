const ipcRenderer = require('electron').ipcRenderer;
const crc = require("./crc.js");

var workspace = null;

function select_tab(event, tab) {
	var i;

	var contents = document.getElementsByClassName("content");
	for(i = 0; i < contents.length; i ++) {
		contents[i].style.display = "none";
	}

	var active = document.getElementsByClassName("active");
	for(i = 0; i < active.length; i ++) {
		active[i].className= "";
	}

	document.getElementById(tab).style.display = "block";
	event.currentTarget.className = "active";

	if(tab == "edit_menu") {
		// Force redraw so blockly appears
		window.dispatchEvent(new Event('resize'));
	}
}

function set_buttons_enable(do_enable) {
	if(do_enable) {
		document.getElementById("btnDebugMenu").disabled = false;
		document.getElementById("btnMacroMenu").disabled = false;
	}
	else {
		document.getElementById("btnDebugMenu").disabled = true;
		document.getElementById("btnMacroMenu").disabled = true;
	}
}

function connect_pressed(event) {
	if(event.currentTarget.innerHTML == "Disconnect") {
		ipcRenderer.invoke("disconnect_device");
		var connection_status = document.getElementById('connection_status');
		connection_status.innerHTML = "Please connect to your Carriage Return device";
		connection_status.style.color="#000000";

		document.getElementById('button_connect').innerHTML="Connect";
		set_buttons_enable(false);
	}
	else {
		ipcRenderer.invoke("connect_device");
	}
}

function send_to_device(event) {
	var code = custom_generator.workspaceToCode(workspace);
	ipcRenderer.invoke("send_code", code);
}

function check_file(event) {
	event.currentTarget.files[0].arrayBuffer().then(crc.get_file_crc);
}

window.onload = function () {	
	var button_connect = document.getElementById('button_connect');
	var connection_status = document.getElementById('connection_status');
	var debug_window = document.getElementById('debug_window');

	workspace = Blockly.inject('blockly_div', {
		toolbox: carriage_return_toolbox,
		horizontalLayout: true,
		toolboxPosition: "end",
		scrollbars: true,
		zoom: {
			controls: true,
			startScale: 0.9
		},
		grid: {
			spacing: 20,
			length: 15,
			colour: '#eeeeee'
		}
	});
	
	Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(start_space), workspace);
	workspace.addChangeListener(Blockly.Events.disableOrphans);
	
	ipcRenderer.on("connection_result", function (event, result) {
		if(result == true) {
			connection_status.style.color="green";
			connection_status.innerHTML = "Connected :)";
			button_connect.innerHTML="Disconnect";
			set_buttons_enable(true);
		}
		else {
			connection_status.style.color="red";
			connection_status.innerHTML = "Couldn't connect :(";
			button_connect.innerHTML="Retry";
			set_buttons_enable(false);
		}
	});
	
	ipcRenderer.on("set_debug_data", function (event, debug_data) {
		debug_window.value = debug_data;
	});

	ipcRenderer.on("device_error", function (event) {
		connection_status.style.color="red";
		connection_status.innerHTML = "Device had error or was disconnected";
		button_connect.innerHTML="Reconnect";
		set_buttons_enable(false);

		var ev = document.createEvent('Events');
		ev.currentTarget = document.getElementById("btnDevMenu");
		select_tab(ev, "dev_menu");
	});
}