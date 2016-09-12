var vm = {};

var MAJOR = 0;
var MINOR = 1;
var PATCH = 2;
var SDLSTAGE = 3;

vm.carPiInfo = ko.observable();
vm.availableVersion = ko.observable();
vm.availableDevVersion = ko.observable();
vm.volume = ko.observable();

vm.updateAvailable = ko.computed(function () {
	if (!vm.carPiInfo() || !vm.carPiInfo().version || !vm.availableVersion()) return false;
	return vm.availableVersion().canUpdate;
});

vm.isCurrentlyDev = ko.computed(function () {
	if (!vm.carPiInfo() || !vm.carPiInfo().version) return false;
	return vm.carPiInfo().version.contains("-alpha");
});

vm.devUpdateAvailable = ko.computed(function () {
	if (!vm.carPiInfo() || !vm.carPiInfo().version || !vm.availableDevVersion()) return false;
	return vm.availableDevVersion().canUpdate;
});

vm.checkForUpdates = function () {
	$.get("/system/updateAvailable/master", function (data) {
		var latest = null;
		if (data) latest = JSON.parse(data);
		if (latest) vm.availableVersion(latest);
	});
	$.get("/system/updateAvailable/dev", function (data) {
		var latest = null;
		if (data) latest = JSON.parse(data);
		if (latest) vm.availableDevVersion(latest);
	});
};

vm.update = function () {
	if (!vm.isCurrentlyDev()) $.get("/system/update/master");
	else if (confirm("Revert to Stable CarPi build?")) {
		$.get("/system/update/master");
	}
};

vm.updateDev = function () {
	if (vm.isCurrentlyDev()) $.get("/system/update/dev");
	else if (confirm("Switch to development CarPi builds?")) {
		$.get("/system/update/dev");
	}
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

var slider = document.getElementById('volume');
noUiSlider.create(slider, {
	start: 0,
	connect: 'lower',
	range: {
		'min': 0,
		'max': 100
	}
});
vm.volume.subscribe(function (value) { slider.noUiSlider.set([value.volume]); });
slider.noUiSlider.on('update', function (values, handle) {
	if (vm.volume() && values[0] != vm.volume().volume) $.get("/controls/volume/set/{0}?_u={1}".format(values[0], new Date().getTime()), vm.volume);
});
$.get("/controls/volume/get?_u={0}".format(new Date().getTime()), vm.volume);

ko.applyBindings(vm);

//$("#keyboard").keyboard();