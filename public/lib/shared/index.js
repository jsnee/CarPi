var vm = {};

vm.playing = ko.observable(false);
vm.track = {
    album: ko.observable(),
    artist: ko.observable(),
    title: ko.observable(),
    duration: ko.observable(),
    position: ko.observable()
};

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
            vm.track.position(value.mediaPlayer.Position);
        }
        vm.playing(value.mediaPlayer.Status == "playing");
    } else {
        vm.playing(false);
    }
});

vm.track.position.subscribe(function (value) {
    scrubber.noUiSlider.set([value]);
})

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
    vm.track.album(mediaPlayer.Track.Album);
    vm.track.artist(mediaPlayer.Track.Artist);
    vm.track.title(mediaPlayer.Track.Title);
    vm.track.duration(mediaPlayer.Track.Duration);
    scrubber.noUiSlider.destroy()
    noUiSlider.create(scrubber, {
        start: mediaPlayer.Position,
        connect: 'lower',
        range: {
            'min': 0,
            'max': mediaPlayer.Track.Duration
        }
    });
    vm.track.position(mediaPlayer.Position);
};

function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return mins + ':' + (secs < 10 ? '0' + secs : secs);
}

vm.trackPosition = ko.computed(function () {
    return msToTime(vm.track.position());
});

vm.timeRemaining = ko.computed(function () {
    if (!vm.track.position() || !vm.track.duration()) return '--:--';
    return '-' + msToTime(vm.track.duration() - vm.track.position());
})

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

var scrubber = document.getElementById('scrubber');
noUiSlider.create(scrubber, {
    start: 0,
    connect: 'lower',
    range: {
        'min': 0,
        'max': 100
    }
});

vm.trackInfo = ko.observable(false);

ko.applyBindings(vm);

setInterval(function () {
    if (vm.trackInfo()) $.get("/controls/info", vm.info);
}, 500);
