const {app, BrowserWindow, ipcMain} = require('electron');
const hid_device = require('./hid_functions.js');

var win = null;

function createWindow() {
	win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true
		},
		icon: __dirname + "/logo.png"
	});
	
	win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
	if(process.platform != 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if(BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

function data_callback(debug_data) {
	win.webContents.send('set_debug_data', debug_data);
}

function error_callback() {
	win.webContents.send('device_error');
}

ipcMain.handle("connect_device", function (event, args) {
	var success = hid_device.connect_device(data_callback, error_callback);	
	event.sender.send("connection_result", success);
});

ipcMain.handle("disconnect_device", function (event, args) {
	hid_device.disconnect_device();
});

ipcMain.handle("send_code", function(event, code) {
	hid_device.send_code(code);
});