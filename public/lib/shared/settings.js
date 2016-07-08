var vm = {};

vm.update = function () {
	$.get("/system/update");
};

vm.shutdown = function () {
	$.get("/system/shutdown");
};

vm.reboot = function () {
	$.get("/system/reboot");
};

ko.applyBindings(vm);