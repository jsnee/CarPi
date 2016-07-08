var vm = {};

vm.playing = ko.observable(false);
vm.track = {
    album: ko.observable(),
    artist: ko.observable(),
    title: ko.observable()
};
vm.volume = ko.observable();
vm.updateVolume

vm.play = function () {
    $.get("/controls/play", function (result) { });
};

vm.pause = function () {
    $.get("/controls/pause", function (result) { });
};

vm.next = function () {
    $.get("/controls/next", function (result) { });
};

vm.previous = function () {
    $.get("/controls/previous", function (result) { });
};

vm.refresh = function () {
    $.get("/controls/info", function (result) {
        console.log(result);
    });
};

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