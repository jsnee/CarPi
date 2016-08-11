var vm = {};

vm.playing = ko.observable(false);
vm.track = {
    album: ko.observable(),
    artist: ko.observable(),
    title: ko.observable(),
    duration: ko.observable()
};
vm.volume = ko.observable();

vm.info = ko.observable();

vm.info.subscribe(function (value) {
    if (value.mediaPlayer) {
        if (vm.track.album() != value.mediaPlayer.Track.Album
            || vm.track.artist() != value.mediaPlayer.Track.Artist
            || vm.track.title() != value.mediaPlayer.Track.Title
            || vm.track.duration() != value.mediaPlayer.Track.Duration)
        {
            vm.loadNewTrack(value.mediaPlayer);
        } else {
            scrubber.noUiSlider.set([value.mediaPlayer.Position]);
        }
        vm.playing(value.mediaPlayer.Status == "playing");
    } else {
        vm.playing(false);
    }
});

vm.loadNewTrack = function (mediaPlayer) {
    mediaPlayer = $.extend({
        Position: 0,
        Track: {
            Title: null,
            Artist: null,
            Album: null,
            Duration: 100
        }
    }, mediaPlayer);
    noUiSlider.create(scrubber, {
        start: mediaPlayer.Position,
        connect: 'lower',
        range: {
            'min': 0,
            'max': mediaPlayer.Track.Duration
        }
    });
    vm.track.album(mediaPlayer.Track.Album);
    vm.track.artist(mediaPlayer.Track.Artist);
    vm.track.title(mediaPlayer.Track.Title);
    vm.track.duration(mediaPlayer.Track.Duration);
};

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

var scrubber = document.getElementById('scrubber');


vm.volume.subscribe(function (value) { slider.noUiSlider.set([value.volume]); });
slider.noUiSlider.on('update', function (values, handle) {
	if (vm.volume() && values[0] != vm.volume().volume) $.get("/controls/volume/set/{0}?_u={1}".format(values[0], new Date().getTime()), vm.volume);
});
$.get("/controls/volume/get?_u={0}".format(new Date().getTime()), vm.volume);

ko.applyBindings(vm);

setInterval(function () {
    $.get("/controls/info", vm.info);
}, 500);