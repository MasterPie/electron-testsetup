// Module to control application life.
var app = require('app');
var test = require('../backend/test/build/Release/main_node.node');
var ipc = require('electron').ipcMain;
var Promise = require("promise");

//console.log("nth fibonacci is: " + test.get_nth_fibonacci_number(10));

// Module to create native browser window.
var BrowserWindow = require('browser-window');
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function () {

    // Create the browser window.
    mainWindow = new BrowserWindow({ width: 800, height: 600 });

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    // Open the devtools.
    // mainWindow.openDevTools();
    // Emitted when the window is closed.
    mainWindow.on('closed', function () {

        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

});

function get_function_result_async(arg)
{
	return 	new Promise(function(fulfill, reject)
	{
		var res =  test.get_nth_fibonacci_number(arg);
		fulfill(res);
	});
}

// Need a function to take in the function def, args, and callback

// This should take in:
// function-name:{}

ipc.on('function_exec', function(event, arg) {
	console.log(arg);
	mainWindow.setProgressBar(0.5);
	test.get_nth_fibonacci_number(arg, function(res){
		event.sender.send('function_exec_response', res);
		mainWindow.setProgressBar(1);
	});
});