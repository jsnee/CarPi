var vm = {};

vm.bluetoothDevices = ko.observableArray([]);
vm.foundDevices = ko.observableArray([]);
vm.bluetoothDevice = ko.observable();
vm.discovering = ko.observable(false);
vm.connectedDevice = ko.observable();

vm.bluetoothDevices.subscribe(function (value) {
	//vm.connectedDevice(null);
	if (value && value.length) {
		value.forEach(function (each) {
			$.get("/controls/device/{0}".format(each.address), function (deviceProps) {
				if (deviceProps.Connected) vm.connectedDevice(deviceProps.Address);
			});
		});
	}
});

vm.beginPairing = function () {
	vm.foundDevices([]);
	$.get("/controls/discoverable/on?_u={0}".format(new Date().getTime()));
    $("#pairing-modal").openModal();
    vm.discovering(true);
	$.get("/controls/scan?_u=" + new Date().getTime(), function (result) {
        if (result && result.length > 0) {
			result.shift();
			vm.foundDevices(result);
			vm.discovering(false);
		}
    });
};

vm.pairDevice = function (device) {
	$.get("/controls/pair/{0}?_u={1}".format(device.address, new Date().getTime()), function () {
		setTimeout(function () {
			$.get("/controls/listPaired?_u={0}".format(new Date().getTime()), vm.bluetoothDevices);
		});
	});
};

vm.connect = function (device) {
	$.get("/controls/connect/{0}?_u={1}".format(device.address, new Date().getTime()), function (result) {
		if (result) {
			setTimeout(function () {
				//$.get("/controls/listPaired?_u={0}".format(new Date().getTime()), vm.bluetoothDevices);
				vm.connectedDevice(device.address);
			});
		}
	});
};

vm.disconnect = function (device) {
	$.get("/controls/disconnect/{0}?_u={1}".format(device.address, new Date().getTime()), function (result) {
		if (result) {
			setTimeout(function () {
				vm.connectedDevice(null);
				//$.get("/controls/listPaired?_u={0}".format(new Date().getTime()), vm.bluetoothDevices);
			});
		}
	});
};

vm.unpair = function (device) {
	$.get("/controls/unpair/{0}?_u={1}".format(device.address, new Date().getTime()), function () {
		setTimeout(function () {
			$.get("/controls/listPaired?_u={0}".format(new Date().getTime()), vm.bluetoothDevices);
		});
	});
};

$.get("/controls/listPaired?_u={0}".format(new Date().getTime()), vm.bluetoothDevices);
//$.get("/controls/device", vm.connectedDevice);

ko.applyBindings(vm);