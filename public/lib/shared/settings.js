var vm = {};

vm.shutdown = function () {
	$.get("/system/shutdown");
};

vm.reboot = function () {
	$.get("/system/reboot");
};

ko.applyBindings(vm);