var vm = {};

var MAJOR = 0;
var MINOR = 1;
var PATCH = 2;

vm.carPiInfo = ko.observable();
vm.availableVersion = ko.observable();

vm.updateAvailable = ko.computed(function () {
	if (!vm.carPiInfo() || !vm.carPiInfo().version || !vm.availableVersion()) return false;
	var currentVer = vm.carPiInfo().version.split(".").select(function (each) { return parseInt(each); });
	var latestVer = vm.availableVersion().split(".").select(function (each) { return parseInt(each); });
	return latestVer[MAJOR] > currentVer[MAJOR] ||
		(latestVer[MAJOR] == currentVer[MAJOR] &&
			(latestVer[MINOR] > currentVer[MINOR] ||
				(latestVer[MINOR] == currentVer[MINOR] && latestVer[PATCH] > currentVer[PATCH])
			)
		);
});

vm.checkForUpdates = function () {
	$.get("/system/updateAvailable", function (data) {
		var latest = null;
		if (data) latest = JSON.parse(data);
		if (latest) vm.availableVersion(latest.version);
	});
};

vm.update = function () {
	$.get("/system/update");
};

vm.quit = function () {
	if (confirm("Quit CarPi?")) {
	  $.get("/system/quit");
	}
}

vm.shutdown = function () {
	$.get("/system/shutdown");
};

vm.reboot = function () {
	$.get("/system/reboot");
};

$.get("/system/info", vm.carPiInfo);

ko.applyBindings(vm);

//$("#keyboard").keyboard();