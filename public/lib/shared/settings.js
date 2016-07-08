var vm = {};

vm.carPiInfo = ko.observable();

vm.update = function () {
	$.get("/system/update");
};

vm.shutdown = function () {
	$.get("/system/shutdown");
};

vm.reboot = function () {
	$.get("/system/reboot");
};

$.get("/system/info", vm.carPiInfo);

ko.applyBindings(vm);