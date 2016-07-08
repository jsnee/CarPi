'use strict';

const Hapi = require('hapi');
const Path = require('path');
const PythonShell = require('python-shell');
const Sys = require('sys')
const Exec = require('child_process').exec;
const Loudness = require('loudness');
const Https = require('https');
//function puts(error, stdout, stderr) { Sys.puts(stdout) }

// Read in package info
const CarPiInfo = require('./package.json');

String.prototype.format = function () {
	var args = arguments;
	return this.replace(/{(\d+)}/g, function (match, number) {
		return (args[number] != undefined ? args[number] : '');
	});
};

if (!Array.prototype.forEach) {
	Array.prototype.forEach = function (func) {
		for (var i = 0; i < this.length; i++) func.call(this[i], this[i]);
	};
}

if (!Array.prototype.select) {
    Array.prototype.select = function (func) {
        var list = [];
        for (var i = 0; i < this.length; i++) list.push(func.call(this[i], this[i]));
        return list;
    };
}

String.prototype.replaceAll = function (search, replace) {
    if (search instanceof Array) {
        if (search.length < 1) return this;
        if (search.length == 1) return this.replaceAll(search[0][0], search[0][1]);
        else return this.replaceAll([search.shift()]).replaceAll(search);
    }
    return this.split(search).join(replace);
};

const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'public')
            }
        }
    }
});

server.connection({ port: 3000 });
server.register(require('inert'), (err) => {
    if (err) throw err;

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply.file('./index.html');
        }
    });

    server.route({
        method: 'GET',
        path: '/bluetooth',
        handler: function (request, reply) {
            reply.file('./bluetooth.html');
        }
    });

    server.route({
        method: 'GET',
        path: '/settings',
        handler: function (request, reply) {
            reply.file('./settings.html');
        }
    });

    server.route({
        method: 'GET',
        path: '/style.css',
        handler: function (request, reply) {
            reply.file('./style.css');
        }
    });

    server.route({
        method: 'GET',
        path: '/lib/{param*}',
        handler: {
            directory: {
                path: 'lib',
                listing: true
            }
        }
    });
	
	// Loudness Volume Control Endpoints
    server.route({
        method: 'GET',
        path: '/controls/volume/get',
        handler: function (request, reply) {
			Loudness.getVolume(function (err, vol) {
				if (err) throw err;
				reply({volume: vol});
			});
		}
    });
    server.route({
        method: 'GET',
        path: '/controls/volume/set/{volume}',
        handler: function (request, reply) {
			Loudness.setVolume(request.params.volume, function (err) {
				if (err) throw err;
				reply({volume: request.params.volume});
			});
		}
    });

    // Python Media Control Endpoints
    server.route({
        method: 'GET',
        path: '/controls/play',
        handler: function (request, reply) {
            PythonShell.run('bin/play.py', function (err) {
                if (err) throw err;
                reply('{Message: "Playing ..."}');
            });
        }
    });
	
    server.route({
        method: 'GET',
        path: '/controls/pause',
        handler: function (request, reply) {
            PythonShell.run('bin/pause.py', function (err) {
                if (err) throw err;
                reply('{Message: "Pausing ..."}');
            });
        }
    });
	
    server.route({
        method: 'GET',
        path: '/controls/next',
        handler: function (request, reply) {
            PythonShell.run('bin/next.py', function (err) {
                if (err) throw err;
                reply('{Message: "Next Track ..."}');
            });
        }
    });
	
    server.route({
        method: 'GET',
        path: '/controls/previous',
        handler: function (request, reply) {
            PythonShell.run('bin/previous.py', function (err) {
                if (err) throw err;
                reply('{Message: "Previous Track ..."}');
            });
        }
    });
	
    server.route({
        method: 'GET',
        path: '/controls/properties',
        handler: function (request, reply) {
            var results;
            PythonShell.run('bin/Adapter/getProperties.py', function (err, data) {
                if (err) throw err;
                reply(data);
            });
        }
    });
	
    server.route({
        method: 'GET',
        path: '/controls/scan',
        handler: function (request, reply) {
			var cmd = "echo 'power on\nscan on\nquit' | bluetoothctl";
            Exec(cmd, function (error, stdout, stderr) {
				if (error) console.log("Error: " + error);
				if (stderr) console.log("StdErr: " + stderr);
			});
            Exec("hcitool scan", function (error, stdout, stderr) {
				if (error) console.log("Error: " + error);
				if (stderr) console.log("StdErr: " + stderr);
				if (stdout) {
					var results = stdout.split("\n\t");
					results.forEach(function (each) { each = each.split("\t"); });
					reply(stdout.split("\n\t").select(function (each) {
						var device = each.split("\t");
						if (device.length != 2) return each;
						return {
							name: device[1].trim(),
							address: device[0].trim()
						};
					}));
				} else {
					reply("There was a problem scanning ...");
				}
			});
        }
    });
	
    server.route({
        method: 'GET',
        path: '/controls/discoverable/{state}',
        handler: function (request, reply) {
			var cmd = "echo 'discoverable {0}\nquit' | bluetoothctl".format(request.params.state == "on" ? "on" : "off");
            Exec(cmd, function (error, stdout, stderr) {
				if (error) console.log("Error: " + error);
				if (stderr) console.log("StdErr: " + stderr);
				reply(stdout);
			});
        }
    });
	
    server.route({
        method: 'GET',
        path: '/controls/connect/{device}',
        handler: function (request, reply) {
			var cmd = "echo 'trust {0}\n connect {0}\nquit' | bluetoothctl".format(request.params.device);
            Exec(cmd, function (error, stdout, stderr) {
				if (error) console.log("Error: " + error);
				if (stderr) console.log("StdErr: " + stderr);
				reply(stdout);
			});
        }
    });
	
    server.route({
        method: 'GET',
        path: '/controls/disconnect/{device}',
        handler: function (request, reply) {
			var cmd = "echo 'disconnect {0}\nquit' | bluetoothctl".format(request.params.device);
            Exec(cmd, function (error, stdout, stderr) {
				if (error) console.log("Error: " + error);
				if (stderr) console.log("StdErr: " + stderr);
				reply(stdout);
			});
        }
    });
	
    server.route({
        method: 'GET',
        path: '/controls/pair/{device}',
        handler: function (request, reply) {
			var cmd = "echo 'pair {0}\ntrust {0}\n connect {0}\nquit' | bluetoothctl".format(request.params.device);
            Exec(cmd, function (error, stdout, stderr) {
				if (error) console.log("Error: " + error);
				if (stderr) console.log("StdErr: " + stderr);
				reply(stdout);
			});
        }
    });
	
    server.route({
        method: 'GET',
        path: '/controls/unpair/{device}',
        handler: function (request, reply) {
			var cmd = "echo 'remove {0}\nquit' | bluetoothctl".format(request.params.device);
            Exec(cmd, function (error, stdout, stderr) {
				if (error) console.log("Error: " + error);
				if (stderr) console.log("StdErr: " + stderr);
				reply(stdout);
			});
        }
    });
	
    server.route({
        method: 'GET',
        path: '/controls/listPaired',
        handler: function (request, reply) {
			var cmd = "echo 'paired-devices\nquit' | bluetoothctl";
            Exec(cmd, function (error, stdout, stderr) {
				if (error) console.log("Error: " + error);
				if (stderr) console.log("StdErr: " + stderr);
				var startIndex = stdout.indexOf("paired-devices") + 14;
				var strLen = stdout.indexOf("quit") - 24;
				var results = stdout.substring(startIndex, strLen).split("Device");
				results.shift();
				reply(results.select(function (each) {
					var eachDevice = each.trim();
					var splitNdx = eachDevice.indexOf(" ");
					return {
						name: eachDevice.substring(splitNdx + 1),
						address: eachDevice.substring(0, splitNdx)
					};
				}));
			});
        }
    });

    // CarPi Command Endpoints
    server.route({
        method: 'GET',
        path: '/system/update',
        handler: function (request, reply) {
			var cmd = "./update.sh";
            Exec(cmd, function (error, stdout, stderr) {
				if (error) console.log("Error: " + error);
				if (stderr) console.log("StdErr: " + stderr);
				console.log(stdout);
			});
        }
    });
    server.route({
        method: 'GET',
        path: '/system/info',
        handler: function (request, reply) {
			reply({ version: CarPiInfo.version });
        }
    });
    server.route({
        method: 'GET',
        path: '/system/updateAvailable',
        handler: function (request, reply) {
            Https.get('https://raw.githubusercontent.com/jsnee/CarPi/master/package.json', function (res) {
                res.on('data', function (data) {
                    reply(data);
                });
            });
        }
    });
	
	// OS Command Endpoints
    server.route({
        method: 'GET',
        path: '/system/shutdown',
        handler: function (request, reply) {
			var cmd = "sudo shutdown -h now";
            Exec(cmd, function (error, stdout, stderr) {
				if (error) console.log("Error: " + error);
				if (stderr) console.log("StdErr: " + stderr);
				console.log(stdout);
			});
        }
    });
    server.route({
        method: 'GET',
        path: '/system/reboot',
        handler: function (request, reply) {
			var cmd = "sudo reboot";
            Exec(cmd, function (error, stdout, stderr) {
				if (error) console.log("Error: " + error);
				if (stderr) console.log("StdErr: " + stderr);
				console.log(stdout);
			});
        }
    });
});

server.start((err) => {


    if (err) {
        throw err;
    }

    console.log('Server running at: ', server.info.uri);
});
